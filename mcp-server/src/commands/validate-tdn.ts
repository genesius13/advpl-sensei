/**
 * Command: advpl_validate_tdn
 * Phase 10 - Expõe validação TDN via MCP
 * 
 * Entrada: Código ADVPL/TLPP ou nome de função
 * Saída: Relatório de validação contra TDN
 * 
 * USO:
 * - Validar código: advpl_validate_tdn code="Local x := Upper('test')"
 * - Validar função: advpl_validate_tdn function="DbSeek"
 */

import {
  Tool,
  TextContent,
} from "@modelcontextprotocol/sdk/types.js";
import { TdnFunctionValidator, ValidationResult } from "../tdn-function-validator.js";
import { TdnFunctionScraper } from "../tdn-scraper.js";
import { TemplateValidator } from "../template-validator.js";

/**
 * Schema do comando advpl_validate_tdn
 */
export const validateTdnSchema: Tool = {
  name: "advpl_validate_tdn",
  description:
    "Valida código ADVPL/TLPP ou funções individuais contra TDN (TOTVS Developer Network). " +
    "Detecta funções fictícias, incompatibilidades de linguagem e indica cobertura TDN.",
  inputSchema: {
    type: "object" as const,
    properties: {
      code: {
        type: "string",
        description:
          "Código ADVPL/TLPP a validar. Análise de funções usadas. Exemplo: 'Local x := Upper(\"test\")'",
      },
      function: {
        type: "string",
        description:
          "Nome de função individual a validar. Exemplo: 'DbSeek'",
      },
      language: {
        type: "string",
        enum: ["advpl", "tlpp", "both"],
        description:
          "Linguagem do código. Padrão: 'advpl'. Usado para verificar compatibilidade.",
        default: "advpl",
      },
      filename: {
        type: "string",
        description:
          "Nome do arquivo (opcional). Usado para contexto. Exemplo: 'meu-programa.prw'",
      },
      detailed: {
        type: "boolean",
        description:
          "Se true, retorna detalhes completos incluindo sugestões. Padrão: false",
        default: false,
      },
      forceRefresh: {
        type: "boolean",
        description:
          "Se true, busca dados TDN atualizados (ignora cache de 24h). Padrão: false",
        default: false,
      },
    },
    required: [],
  },
};

/**
 * Handler do comando advpl_validate_tdn
 */
export async function handleValidateTdn(params: {
  code?: string;
  function?: string;
  language?: "advpl" | "tlpp" | "both";
  filename?: string;
  detailed?: boolean;
  forceRefresh?: boolean;
}): Promise<TextContent> {
  const {
    code,
    function: functionName,
    language = "advpl",
    filename = "code.prw",
    detailed = false,
    forceRefresh = false,
  } = params;

  // Validar entrada
  if (!code && !functionName) {
    throw new Error(
      "Forneça 'code' ou 'function' para validar"
    );
  }

  try {
    let result = "";
    result += "\n╔════════════════════════════════════════════════════════════╗\n";
    result += "║          TDN Validation Report                           ║\n";
    result += "╚════════════════════════════════════════════════════════════╝\n\n";

    // Adicionar contexto
    if (filename) {
      result += `📄 File: ${filename}\n`;
    }
    result += `🔍 Language: ${language}\n`;
    result += `⏰ Timestamp: ${new Date().toLocaleString()}\n\n`;

    // CASO 1: Validar função individual
    if (functionName) {
      result += await validateSingleFunction(functionName, detailed);
    }

    // CASO 2: Validar código
    if (code) {
      result += await validateCodeBlock(code, language, filename, detailed, forceRefresh);
    }

    // Adicionar rodapé
    result += "\n" + generateFooter(detailed);

    return {
      type: "text",
      text: result,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return {
      type: "text",
      text: `❌ Error validating TDN:\n${errorMsg}`,
    };
  }
}

/**
 * Validar função individual
 */
async function validateSingleFunction(
  functionName: string,
  detailed: boolean
): Promise<string> {
  let result = `📌 Validating Function: ${functionName}\n`;
  result += `─────────────────────────────────────────────────────────────\n\n`;

  const validation = TdnFunctionValidator.validateFunction(functionName);

  // Status icon
  const icon =
    validation.status === "valid"
      ? "✅"
      : validation.status === "deprecated"
        ? "⚠️"
        : "❌";

  result += `${icon} Status: ${validation.status.toUpperCase()}\n`;
  result += `📝 Message: ${validation.message}\n`;
  result += `⚠️  Severity: ${validation.severity}\n`;

  if (validation.tdnUrl) {
    result += `🔗 TDN URL: ${validation.tdnUrl}\n`;
  }

  if (detailed) {
    const scraper = await TdnFunctionScraper.getFunctions();
    const func = scraper.functions.find((f) => f.name === functionName);

    if (func) {
      result += `\n📋 Details:\n`;
      result += `  Category: ${func.category}\n`;
      result += `  Type: ${func.type}\n`;
      result += `  Language: ${func.language}\n`;
      result += `  Description: ${func.description}\n`;
    }
  }

  result += `\n`;
  return result;
}

/**
 * Validar bloco de código
 */
async function validateCodeBlock(
  code: string,
  language: "advpl" | "tlpp" | "both",
  filename: string,
  detailed: boolean,
  forceRefresh: boolean
): Promise<string> {
  let result = `💻 Validating Code Block\n`;
  result += `─────────────────────────────────────────────────────────────\n\n`;

  // Determinar linguagens a validar
  const languages: Array<"advpl" | "tlpp"> = 
    language === "both" ? ["advpl", "tlpp"] : [language as "advpl" | "tlpp"];

  // Validar com TdnFunctionValidator (análise de funções)
  const allTdnIssues: any[] = [];
  for (const lang of languages) {
    const tdnIssues = TdnFunctionValidator.validateCode(code, lang);
    allTdnIssues.push(...tdnIssues);
  }

  // Validar com TemplateValidator (estrutura + funções)
  const templateIssues = TemplateValidator.validate(code, filename, language as any);

  // Compilar resultado
  const totalIssues = allTdnIssues.length + templateIssues.issues.length;

  if (totalIssues === 0) {
    result += `✅ No issues found - Code is valid!\n\n`;
    result += `🎯 TDN Coverage: 100%\n`;
    result += `📊 Functions Found: 0 (none to validate)\n`;
  } else {
    result += `⚠️  Issues Found: ${totalIssues}\n\n`;

    // TDN Issues
    if (allTdnIssues.length > 0) {
      result += `🔴 TDN Validation Issues:\n`;

      const errors = allTdnIssues.filter((i) => i.severity === "error");
      const warnings = allTdnIssues.filter((i) => i.severity === "warning");
      const info = allTdnIssues.filter((i) => i.severity === "info");

      if (errors.length > 0) {
        result += `\n  ERRORS (${errors.length}):\n`;
        errors.forEach((issue) => {
          result += `    • ${issue.function}: ${issue.message}\n`;
        });
      }

      if (warnings.length > 0) {
        result += `\n  WARNINGS (${warnings.length}):\n`;
        warnings.forEach((issue) => {
          result += `    • ${issue.function}: ${issue.message}\n`;
        });
      }

      if (info.length > 0 && detailed) {
        result += `\n  INFO (${info.length}):\n`;
        info.forEach((issue) => {
          result += `    • ${issue.function}: ${issue.message}\n`;
        });
      }

      result += `\n`;
    }

    // Template Issues
    if (templateIssues.issues.length > 0) {
      result += `🟡 Structure Validation Issues:\n`;
      templateIssues.issues.slice(0, detailed ? undefined : 5).forEach((issue) => {
        result += `  • [${issue.severity.toUpperCase()}] ${issue.message}\n`;
      });

      if (!detailed && templateIssues.issues.length > 5) {
        result += `  ... and ${templateIssues.issues.length - 5} more\n`;
      }
      result += `\n`;
    }
  }

  // Scraper stats se forceRefresh
  if (forceRefresh) {
    const scraperResult = await TdnFunctionScraper.getFunctions(true);
    result += `📊 TDN Database:\n`;
    result += `  Total Functions: ${scraperResult.totalFunctions}\n`;
    result += `  Source: ${scraperResult.source}\n`;
    result += `  Cache Hit: ${scraperResult.cacheHit ? "Yes" : "No"}\n\n`;
  }

  return result;
}

/**
 * Gerar rodapé com links
 */
function generateFooter(detailed: boolean): string {
  let footer = `📚 Resources:\n`;
  footer += `─────────────────────────────────────────────────────────────\n`;
  footer += `• Command: advpl_validate_tdn\n`;
  footer += `• Phase: 10 (MCP Integration)\n`;
  footer += `• Validator: TdnFunctionValidator + TdnFunctionScraper\n`;

  if (detailed) {
    footer += `\n💡 Tips:\n`;
    footer += `  • Use 'detailed: true' for full information\n`;
    footer += `  • Use 'forceRefresh: true' to update TDN cache\n`;
    footer += `  • Check TDN docs for more details\n`;
  }

  return footer;
}
