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
    version: "1.1.0",
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
        
        tools.push({
          name: `advpl_${name}`,
          description: metadata.description || `Command ${name}`,
          inputSchema: {
            type: "object",
            properties: metadata.parameters || {
              prompt: { type: "string", description: "O prompt ou instrução para o comando" },
              args: { type: "string", description: "Argumentos adicionais (opcional)" },
            },
            required: metadata.parameters ? Object.keys(metadata.parameters).filter(k => metadata.parameters![k].required !== false) : ["prompt"],
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

  // Constrói uma resposta mais descritiva
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
  await server.connect(transport);
}

main().catch((err) => {
  console.error("MCP Server Error:", err);
});
