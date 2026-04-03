/**
 * Snippets Validator - Valida snippets contra TDN
 * Phase 8 - Garantir que snippets só usam funções reais
 * 
 * Valida cada snippet VS Code para verificar:
 * - Funções fictícias
 * - Incompatibilidades de linguagem
 * - Funções não verificadas em TDN
 */

import { TdnFunctionValidator } from "./tdn-function-validator.js";

export interface SnippetValidationIssue {
  snippet: string;
  function: string;
  severity: "error" | "warning" | "info";
  message: string;
  suggestion?: string;
}

export interface SnippetValidationReport {
  totalSnippets: number;
  validSnippets: number;
  issuesFound: SnippetValidationIssue[];
  coverage: number;
}

/**
 * Validador de snippets contra TDN
 */
export class SnippetsValidator {
  /**
   * Validar um snippet
   */
  public static validateSnippet(
    snippetName: string,
    body: string[],
    language: "advpl" | "tlpp"
  ): SnippetValidationIssue[] {
    const issues: SnippetValidationIssue[] = [];
    const code = body.join("\n");

    // Usar TdnFunctionValidator
    const tdnIssues = TdnFunctionValidator.validateCode(code, language);

    // Converter para SnippetValidationIssue
    tdnIssues.forEach((issue) => {
      issues.push({
        snippet: snippetName,
        function: issue.function,
        severity: issue.severity,
        message: issue.message,
        suggestion: `Use a TDN-verified function instead of '${issue.function}'`,
      });
    });

    return issues;
  }

  /**
   * Validar múltiplos snippets
   */
  public static validateSnippets(
    snippets: Map<string, { body: string[]; language: "advpl" | "tlpp" }>
  ): SnippetValidationReport {
    const report: SnippetValidationReport = {
      totalSnippets: snippets.size,
      validSnippets: 0,
      issuesFound: [],
      coverage: 0,
    };

    snippets.forEach((snippet, name) => {
      const issues = this.validateSnippet(name, snippet.body, snippet.language);

      if (issues.length === 0) {
        report.validSnippets++;
      }

      report.issuesFound.push(...issues);
    });

    report.coverage = Math.round((report.validSnippets / report.totalSnippets) * 100);

    return report;
  }

  /**
   * Gerar relatório formatado
   */
  public static generateReport(report: SnippetValidationReport): string {
    let output = "\n╔════════════════════════════════════════════════════════════╗\n";
    output += "║         Snippets Validation Report (vs TDN)               ║\n";
    output += "╚════════════════════════════════════════════════════════════╝\n\n";

    output += `📊 Statistics\n`;
    output += `─────────────────────────────────────────────────────────────\n`;
    output += `Total Snippets:  ${report.totalSnippets}\n`;
    output += `Valid Snippets:  ${report.validSnippets}\n`;
    output += `Issues Found:    ${report.issuesFound.length}\n`;
    output += `Coverage:        ${report.coverage}%\n\n`;

    if (report.issuesFound.length === 0) {
      output += `✅ All snippets use TDN-verified functions!\n`;
    } else {
      output += `⚠️  Issues Found:\n`;
      output += `─────────────────────────────────────────────────────────────\n`;

      // Group by severity
      const errors = report.issuesFound.filter((i) => i.severity === "error");
      const warnings = report.issuesFound.filter((i) => i.severity === "warning");
      const info = report.issuesFound.filter((i) => i.severity === "info");

      if (errors.length > 0) {
        output += `\n🔴 ERRORS (${errors.length}):\n`;
        errors.forEach((issue) => {
          output += `  • [${issue.snippet}] ${issue.function}: ${issue.message}\n`;
          if (issue.suggestion) output += `    💡 ${issue.suggestion}\n`;
        });
      }

      if (warnings.length > 0) {
        output += `\n🟡 WARNINGS (${warnings.length}):\n`;
        warnings.forEach((issue) => {
          output += `  • [${issue.snippet}] ${issue.function}: ${issue.message}\n`;
        });
      }

      if (info.length > 0) {
        output += `\n🔵 INFO (${info.length}):\n`;
        info.forEach((issue) => {
          output += `  • [${issue.snippet}] ${issue.function}: ${issue.message}\n`;
        });
      }
    }

    output += `\n`;
    return output;
  }
}
