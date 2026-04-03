#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { SenseiLinter } from "./linter.js";
import { BoilerplateGenerator } from "./boilerplates.js";
import { SXTool } from "./sx-tool.js";
import { SnippetsGenerator } from "./snippets-generator.js";
import { TemplateValidator } from "./template-validator.js";
import { handleValidateTdn } from "./commands/validate-tdn.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Estrutura: dist/index.js -> mcp-server/
const MCP_ROOT = path.resolve(__dirname, "..");

/**
 * Interface para representar o frontmatter dos arquivos .md
 */
interface MarkdownMetadata {
  name?: string;
  description?: string;
  parameters?: Record<string, any>;
  arguments?: Array<{ name: string; description?: string; required?: boolean }>;
}

/**
 * Extrai o frontmatter YAML de um arquivo markdown
 */
function parseFrontmatter(content: string): { metadata: MarkdownMetadata; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (match) {
    try {
      const metadata = yaml.load(match[1]) as MarkdownMetadata;
      return { metadata, body: match[2] };
    } catch (e) {
      console.error("Erro ao processar frontmatter:", e);
    }
  }
  return { metadata: {}, body: content };
}

const server = new Server(
  {
    name: "advpl-sensei",
    version: "1.1.4",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

/**
 * Resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const skillsDir = path.join(MCP_ROOT, "skills");
  const resources: any[] = [];

  async function walk(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.name.endsWith(".md")) {
          const content = await fs.readFile(fullPath, "utf-8");
          const { metadata } = parseFrontmatter(content);
          const relPath = path.relative(skillsDir, fullPath);
          
          resources.push({
            uri: `mcp://advpl/skills/${relPath}`,
            name: metadata.name || relPath,
            description: metadata.description || `Skill: ${relPath}`,
            mimeType: "text/markdown",
          });
        }
      }
    } catch (e) {}
  }

  await walk(skillsDir);
  return { resources };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = new URL(request.params.uri);
  const relPath = uri.pathname.replace("/advpl/skills/", "");
  const filePath = path.join(MCP_ROOT, "skills", relPath);
  const text = await fs.readFile(filePath, "utf-8");
  return {
    contents: [{ uri: request.params.uri, mimeType: "text/markdown", text }],
  };
});

/**
 * Tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const commandsDir = path.join(MCP_ROOT, "commands");
  const tools: any[] = [];
  try {
    const files = await fs.readdir(commandsDir);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const name = file.replace(".md", "");
        const content = await fs.readFile(path.join(commandsDir, file), "utf-8");
        const { metadata } = parseFrontmatter(content);
        const rawParams = metadata.parameters || undefined;
        const properties: Record<string, any> = {};
        if (rawParams) {
          for (const [k, v] of Object.entries(rawParams)) {
            const { required: _req, ...rest } = v as any;
            properties[k] = rest;
          }
        }
        const defaultProperties = {
          prompt: { type: "string", description: "O prompt ou instrução para o comando" },
          args: { type: "string", description: "Argumentos adicionais (opcional)" },
        };

        tools.push({
          name: `advpl_${name}`,
          description: metadata.description || `Command ${name}`,
          inputSchema: {
            type: "object",
            properties: rawParams ? properties : defaultProperties,
            required: rawParams ? Object.keys(rawParams).filter(k => (rawParams as any)[k].required !== false) : ["prompt"],
          },
        });
      }
    }
  } catch (e) {}
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name; // e.g., 'advpl_generate'
  const mcpToolName = toolName.replace("advpl_", ""); // e.g., 'generate'
  const commandFilePath = path.join(MCP_ROOT, "commands", `${mcpToolName}.md`);
  
  let metadata: MarkdownMetadata = {};
  let commandBody: string = "";

  try {
    const content = await fs.readFile(commandFilePath, "utf-8");
    const parsed = parseFrontmatter(content);
    metadata = parsed.metadata;
    commandBody = parsed.body;
  } catch (error) {
    console.error(`Erro ao carregar definição da ferramenta '${toolName}':`, error);
    const errMsg = (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error);
    return {
      content: [{
        type: "text",
        text: `Erro ao carregar definição da ferramenta '${toolName}'. Verifique se o arquivo de comando existe e está formatado corretamente. Detalhe: ${errMsg}`,
      }],
    };
  }

  const toolDescription = metadata.description || `Ferramenta '${toolName}' sem descrição.`;
  const toolParametersSchema = metadata.parameters || {};
  const receivedArguments = request.params.arguments || {};

  // --- Lógica REAL para ferramentas específicas ---
  
  // 1. LINT
  if (toolName === "advpl_lint") {
    const source = receivedArguments.source as string;
    const filename = (receivedArguments.filename as string) || "source.prw";
    
    if (!source) {
      return {
        content: [{ type: "text", text: "Erro: O argumento 'source' é obrigatório para a ferramenta lint." }],
        isError: true
      };
    }

    const result = SenseiLinter.lint(source, filename);
    
    if (result.issues.length === 0) {
      return {
        content: [{ type: "text", text: "✅ Nenhum problema encontrado! O código segue as regras de ouro do Sensei." }]
      };
    }

    let response = `🔍 Resultado do Lint para \`${filename}\`:\n\n`;
    result.issues.forEach(issue => {
      const icon = issue.severity === "error" ? "❌" : "⚠️";
      response += `${icon} [${issue.code}] Linha ${issue.line}: ${issue.message}\n`;
    });

    return {
      content: [{ type: "text", text: response }]
    };
  }

  // 2. GENERATE (Boilerplate)
  if (toolName === "advpl_generate") {
    const type = receivedArguments.type as string;
    const name = receivedArguments.name as string;
    const module = (receivedArguments.module as string) || "GEN";
    const lang = (receivedArguments.lang as string) || "advpl";
    const outputDir = (receivedArguments.outputDir as string) || process.cwd();

    if (!type || !name) {
      return {
        content: [{ type: "text", text: "Erro: Argumentos 'type' e 'name' são obrigatórios para a ferramenta generate." }],
        isError: true
      };
    }

    const boilerplate = BoilerplateGenerator.generate(type, name, module, lang);
    
    // Phase 5: Verificar se há erros de validação
    let validationMessage = "";
    if (boilerplate.validation && !boilerplate.validation.valid) {
      const errorCount = boilerplate.validation.statistics.errorCount;
      validationMessage = `\n\n⚠️ **Validation Issues Found (${errorCount} errors):**\n`;
      
      boilerplate.validation.issues
        .filter(issue => issue.severity === "error")
        .forEach(issue => {
          validationMessage += `- 🔴 **Line ${issue.line}**: ${issue.message}\n`;
          if (issue.suggestion) {
            validationMessage += `  💡 ${issue.suggestion}\n`;
          }
        });
      
      validationMessage += `\n**Recomendação:** Revise o template antes de usar em produção.`;
    }

    const fullPath = path.join(outputDir, boilerplate.filename);

    try {
      await fs.writeFile(fullPath, boilerplate.content, "utf-8");
      
      let successMessage = `🚀 Boilerplate gerado com sucesso!\n\n**Arquivo:** \`${boilerplate.filename}\`\n**Local:** \`${fullPath}\`\n\nAgora o LLM pode prosseguir com a implementação da lógica de negócio solicitada.`;
      
      if (validationMessage) {
        successMessage += validationMessage;
      } else if (boilerplate.validation?.valid) {
        successMessage += `\n\n✅ **Template validation passed** - Código pronto para compilação!`;
      }
      
      return {
        content: [{ type: "text", text: successMessage }]
      };
    } catch (e: any) {
      return {
        content: [{ type: "text", text: `Erro ao criar arquivo de boilerplate: ${e.message}` }],
        isError: true
      };
    }
  }

  // 3. SX TOOL (Consulta ao dicionário)
  if (toolName === "advpl_sx") {
    const action = (receivedArguments.action as string) || "tables";
    const query = (receivedArguments.query as string) || "";
    const format = (receivedArguments.format as string) || "markdown";

    let response = "";

    switch (action.toLowerCase()) {
      case "list_tables":
        const tables = SXTool.getAllTables();
        response = "## Tabelas Disponíveis\n\n";
        tables.forEach(table => {
          response += `- **${table.alias}**: ${table.description}\n`;
        });
        break;

      case "get_table":
        if (!query) {
          return {
            content: [{ type: "text", text: "Erro: 'query' é obrigatório para listar campos de uma tabela." }],
            isError: true
          };
        }
        response = SXTool.formatTableSummary(query);
        break;

      case "search_fields":
        if (!query) {
          return {
            content: [{ type: "text", text: "Erro: 'query' é obrigatório para buscar campos." }],
            isError: true
          };
        }
        const parts = query.split("|");
        const table = parts[0] || "";
        const pattern = parts[1] || "*";
        const fields = SXTool.searchFields(table, pattern);
        if (fields.length === 0) {
          response = `Nenhum campo encontrado em '${table}' correspondendo ao padrão '${pattern}'.`;
        } else {
          response = `## Campos Encontrados em ${table}\n\n`;
          fields.forEach(field => {
            response += `- **${field.name}** (${field.type}${field.size}): ${field.title}\n`;
          });
        }
        break;

      case "get_parameters":
        const module = query || "";
        response = SXTool.formatParametersByModule(module || undefined);
        break;

      case "get_generic_table":
        if (!query) {
          return {
            content: [{ type: "text", text: "Erro: 'query' é obrigatório para buscar tabela genérica." }],
            isError: true
          };
        }
        const genTable = SXTool.getGenericTable(query);
        if (!genTable) {
          response = `Tabela genérica '${query}' não encontrada.`;
        } else {
          response = `## Tabela Genérica: ${genTable.code} - ${genTable.description}\n\n`;
          genTable.entries.forEach(entry => {
            response += `- **${entry.key}**: ${entry.label}\n`;
          });
        }
        break;

      case "export":
        const exportType = query || "tables";
        const json = SXTool.exportAsJson(exportType as any);
        response = `\`\`\`json\n${json}\n\`\`\``;
        format === "markdown" ? undefined : (response = json);
        break;

      default:
        response = "Ação desconhecida. Use: list_tables, get_table, search_fields, get_parameters, get_generic_table ou export.";
    }

    return {
      content: [{ type: "text", text: response }]
    };
  }

  // 4. SNIPPETS (Gerador de snippets VS Code)
  if (toolName === "advpl_snippets") {
    const action = (receivedArguments.action as string) || "list";
    const output = (receivedArguments.output as string) || "";
    const outputDir = (receivedArguments.outputDir as string) || process.cwd();

    let response = "";

    switch (action.toLowerCase()) {
      case "list":
        response = "## Snippets Disponíveis\n\n";
        const snippets = SnippetsGenerator.generateSnippets();
        Object.values(snippets).forEach(snippet => {
          response += `- \`${snippet.prefix}\`: ${snippet.description}\n`;
        });
        break;

      case "generate_vscode":
        const vscodeContent = SnippetsGenerator.generateVscodeSnippetsFile();
        const outputPath = output || path.join(outputDir, ".vscode", "advpl-sensei.code-snippets");
        const outputDir2 = path.dirname(outputPath);
        
        try {
          await fs.mkdir(outputDir2, { recursive: true });
          await fs.writeFile(outputPath, vscodeContent, "utf-8");
          response = `✅ Arquivo de snippets gerado com sucesso!\n\n**Local:** \`${outputPath}\`\n\nAgora você pode usar os snippets no VS Code digitando os prefixos (ex: \`advpl_func\`).`;
        } catch (e: any) {
          return {
            content: [{ type: "text", text: `Erro ao criar arquivo de snippets: ${e.message}` }],
            isError: true
          };
        }
        break;

      case "export_json":
        const json = SnippetsGenerator.exportAsJson();
        response = `\`\`\`json\n${json}\n\`\`\``;
        break;

      case "export_markdown":
        response = SnippetsGenerator.generateMarkdownReference();
        break;

      default:
        response = "Ação desconhecida. Use: list, generate_vscode, export_json ou export_markdown.";
    }

    return {
      content: [{ type: "text", text: response }]
    };
  }

  if (toolName === "advpl_validate") {
    const code = (receivedArguments.code as string) || "";
    const language = (receivedArguments.language as string) || "auto";
    const filename = (receivedArguments.filename as string) || "template.prw";

    if (!code) {
      return {
        content: [{ type: "text", text: "❌ Erro: parâmetro 'code' é obrigatório" }],
        isError: true
      };
    }

    const validLanguage = (language === "advpl" || language === "tlpp" ? language : undefined) as "advpl" | "tlpp" | undefined;
    const result = TemplateValidator.validate(code, filename, validLanguage);
    const report = TemplateValidator.generateReport(result);

    return {
      content: [{ 
        type: "text", 
        text: result.valid ? `✅ Template Válido\n${report}` : `❌ Template Inválido\n${report}`
      }]
    };
  }

  // 6. VALIDATE_TDN - Phase 10
  if (toolName === "advpl_validate_tdn") {
    try {
      const result = await handleValidateTdn({
        code: receivedArguments.code as string | undefined,
        function: receivedArguments.function as string | undefined,
        language: (receivedArguments.language as "advpl" | "tlpp" | "both") || "advpl",
        filename: (receivedArguments.filename as string) || "code.prw",
        detailed: (receivedArguments.detailed as boolean) || false,
        forceRefresh: (receivedArguments.forceRefresh as boolean) || false,
      });

      return {
        content: [result],
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        content: [{
          type: "text",
          text: `❌ Erro na validação TDN: ${errorMsg}`,
        }],
        isError: true,
      };
    }
  }

  // --- Placeholder para outras ferramentas ---
  let responseText = `Chamada da Ferramenta: \`${toolName}\`\n`;
  responseText += `Descrição: ${toolDescription}\n\n`;
  responseText += `Argumentos Recebidos:\n`;

  // Determina quais parâmetros são obrigatórios com base no schema
  const allParameterNames = Object.keys(toolParametersSchema);
  const requiredParams = allParameterNames.filter(paramName => toolParametersSchema[paramName].required !== false);
  const optionalParams = allParameterNames.filter(paramName => toolParametersSchema[paramName].required === false);

  // Lista argumentos obrigatórios
  if (requiredParams.length > 0) {
    responseText += `  * **Obrigatórios**:\n`;
    requiredParams.forEach(paramName => {
      const paramValue = receivedArguments[paramName] !== undefined ? `\`${receivedArguments[paramName]}\`` : "*(não fornecido)*";
      responseText += `    - \`${paramName}\`: ${paramValue}\n`;
    });
  }

  // Lista argumentos opcionais
  if (optionalParams.length > 0) {
    responseText += `  * **Opcionais**:\n`;
    optionalParams.forEach(paramName => {
      const paramValue = receivedArguments[paramName] !== undefined ? `\`${receivedArguments[paramName]}\`` : "*(não fornecido)*";
      responseText += `    - \`${paramName}\`: ${paramValue}\n`;
    });
  }

  // Se houver argumentos recebidos que não estão no schema de parâmetros, liste-os como desconhecidos.
  const receivedArgNames = Object.keys(receivedArguments);
  const unknownParams = receivedArgNames.filter(argName => !allParameterNames.includes(argName));
  if (unknownParams.length > 0) {
      responseText += `  * **Desconhecidos**:\n`;
      unknownParams.forEach(paramName => {
          responseText += `    - \`${paramName}\`: \`${receivedArguments[paramName]}\`\n`;
      });
  }

  // Indica que esta é uma simulação/placeholder
  responseText += `\n--- SIMULAÇÃO DE EXECUÇÃO ---\nEsta é uma resposta simulada. A lógica real de execução para '${toolName}' não está implementada neste handler.`;

  return {
    content: [{
      type: "text",
      text: responseText,
    }],
  };
});

/**
 * Prompts
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  const agentsDir = path.join(MCP_ROOT, "agents");
  const prompts: any[] = [];
  try {
    const files = await fs.readdir(agentsDir);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const name = file.replace(".md", "");
        const content = await fs.readFile(path.join(agentsDir, file), "utf-8");
        const { metadata } = parseFrontmatter(content);
        
        prompts.push({
          name: `advpl_agent_${name}`,
          description: metadata.description || `Agent Persona: ${name}`,
          arguments: metadata.arguments || [{ name: "context", description: "Contexto adicional para o agente", required: false }],
        });
      }
    }
  } catch (e) {}
  return { prompts };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const name = request.params.name.replace("advpl_agent_", "");
  const filePath = path.join(MCP_ROOT, "agents", `${name}.md`);
  const content = await fs.readFile(filePath, "utf-8");
  const { metadata, body } = parseFrontmatter(content);
  
  return {
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Role: ${name}\nDescription: ${metadata.description || ""}\nRules: ${body}\nUser Input: ${JSON.stringify(request.params.arguments)}`,
      },
    }],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  console.log(`MCP server 'advpl-sensei' iniciado — aguardando conexão via stdin/stdout...`);
  await server.connect(transport);
}

main().catch((err) => {
  console.error("MCP Server Error:", err);
});
