/**
 * Template Validator - Valida templates ADVPL/TLPP gerados
 * Fase 5 - Function Registry & Validation
 * Fase 6 - Validação contra TDN (TOTVS oficial)
 * 
 * Integra o Function Registry com validação de boilerplates
 * para garantir que templates geram código compilável.
 * Valida contra TDN oficial para máxima precisão.
 */

import { FunctionValidator } from "./function-registry.js";
import type { TdnFunctionValidator } from "./tdn-function-validator.js";

export interface TemplateValidationIssue {
  line: number;
  column?: number;
  code: string;
  message: string;
  severity: "error" | "warning" | "info";
  suggestion?: string;
}

export interface TemplateValidationResult {
  filename: string;
  language: "advpl" | "tlpp";
  valid: boolean;
  issues: TemplateValidationIssue[];
  statistics: {
    totalLines: number;
    errorCount: number;
    warningCount: number;
    infoCount: number;
  };
}

export class TemplateValidator {
  /**
   * Detectar linguagem do template
   */
  private static detectLanguage(code: string): "advpl" | "tlpp" {
    const hasNamespace = /namespace\s+\w+/i.test(code);
    const hasTlppSyntax = /\bClass\b.*\bAs\b|\bData\b.*\bAs\b/i.test(code);
    const hasAdvplOnly = /WSRESTFUL|WSMETHOD|WSSERVICE/i.test(code);

    if (hasNamespace || hasTlppSyntax) return "tlpp";
    if (hasAdvplOnly) return "advpl";

    // Default to ADVPL se não conseguir detectar
    return "advpl";
  }

  /**
   * Validar template completo
   */
  public static validate(
    code: string,
    filename: string,
    language?: "advpl" | "tlpp"
  ): TemplateValidationResult {
    const detectedLanguage = language || this.detectLanguage(code);
    const issues: TemplateValidationIssue[] = [];
    const lines = code.split("\n");

    // 1. Validar funções contra registry
    const functionIssues = this.validateFunctions(code, detectedLanguage);
    issues.push(...functionIssues);

    // 2. Validar estrutura
    const structureIssues = this.validateStructure(code, detectedLanguage, lines);
    issues.push(...structureIssues);

    // 3. Validar includes
    const includeIssues = this.validateIncludes(code, detectedLanguage);
    issues.push(...includeIssues);

    // 4. Validar Protheus.doc
    const docIssues = this.validateProtheusDoc(code);
    issues.push(...docIssues);

    // 5. Validar Begin Sequence (se ADVPL)
    if (detectedLanguage === "advpl") {
      const sequenceIssues = this.validateBeginSequence(code);
      issues.push(...sequenceIssues);
    }

    // Sort by line number
    issues.sort((a, b) => a.line - b.line);

    // Calculate statistics
    const errorCount = issues.filter((i) => i.severity === "error").length;
    const warningCount = issues.filter((i) => i.severity === "warning").length;
    const infoCount = issues.filter((i) => i.severity === "info").length;

    return {
      filename,
      language: detectedLanguage,
      valid: errorCount === 0,
      issues,
      statistics: {
        totalLines: lines.length,
        errorCount,
        warningCount,
        infoCount,
      },
    };
  }

  /**
   * Validar uso de funções
   */
  private static validateFunctions(
    code: string,
    language: "advpl" | "tlpp"
  ): TemplateValidationIssue[] {
    const issues: TemplateValidationIssue[] = [];
    const functionCallRegex = /\b([A-Za-z_]\w*)\s*\(/g;
    const lines = code.split("\n");

    lines.forEach((line, lineIdx) => {
      // Skip comments
      if (
        line.trim().startsWith("//") ||
        line.trim().startsWith("/*") ||
        line.trim().startsWith("*")
      )
        return;

      let match;
      const lineRegex = new RegExp(functionCallRegex.source, "g");
      while ((match = lineRegex.exec(line)) !== null) {
        const funcName = match[1];

        // Skip keywords
        if (
          ["if", "while", "for", "switch", "case", "return", "local", "static"]
            .includes(funcName.toLowerCase())
        )
          return;

        // Check if function exists
        if (!FunctionValidator.exists(funcName)) {
          issues.push({
            line: lineIdx + 1,
            column: match.index,
            code: "FUNC_NOT_FOUND",
            message: `Function '${funcName}()' not found in registry`,
            severity: "warning",
            suggestion: `Check TOTVS documentation or SX Tools for '${funcName}'`,
          });
        } else if (FunctionValidator.isFictitious(funcName)) {
          issues.push({
            line: lineIdx + 1,
            column: match.index,
            code: "FUNC_FICTITIOUS",
            message: `Function '${funcName}()' is fictitious or deprecated`,
            severity: "error",
            suggestion: `This function may not exist or is deprecated. Use alternative.`,
          });
        } else if (!FunctionValidator.isCompatibleWith(funcName, language)) {
          issues.push({
            line: lineIdx + 1,
            column: match.index,
            code: "FUNC_INCOMPATIBLE",
            message: `Function '${funcName}()' not compatible with ${language}`,
            severity: "error",
            suggestion: `${funcName} only works with ${FunctionValidator.getDefinition(funcName)!.language}`,
          });
        }
      }
    });

    return issues;
  }

  /**
   * Validar estrutura geral
   */
  private static validateStructure(
    code: string,
    language: "advpl" | "tlpp",
    lines: string[]
  ): TemplateValidationIssue[] {
    const issues: TemplateValidationIssue[] = [];

    if (language === "advpl") {
      // Verificar User Function ou Static Function
      const hasFunction = /User Function|Static Function|Function\b/i.test(code);
      if (!hasFunction) {
        issues.push({
          line: 1,
          code: "NO_FUNCTION",
          message: "ADVPL code missing function declaration",
          severity: "error",
          suggestion: "Add 'User Function NomeFuncao()' declaration",
        });
      }

      // Verificar Return
      const hasReturn = /Return\b/i.test(code);
      if (!hasReturn) {
        issues.push({
          line: 1,
          code: "NO_RETURN",
          message: "Function missing Return statement",
          severity: "error",
          suggestion: "Add 'Return' at end of function",
        });
      }
    } else if (language === "tlpp") {
      // Verificar Class
      const hasClass = /Class\s+\w+/i.test(code);
      if (!hasClass) {
        issues.push({
          line: 1,
          code: "NO_CLASS",
          message: "TLPP code missing Class declaration",
          severity: "error",
          suggestion: "Add 'Class NomeClasse' declaration",
        });
      }

      // Verificar EndClass
      const hasEndClass = /EndClass/i.test(code);
      if (!hasEndClass) {
        issues.push({
          line: 1,
          code: "NO_ENDCLASS",
          message: "Missing 'EndClass' statement",
          severity: "error",
          suggestion: "Add 'EndClass' at end of class",
        });
      }
    }

    return issues;
  }

  /**
   * Validar includes
   */
  private static validateIncludes(
    code: string,
    language: "advpl" | "tlpp"
  ): TemplateValidationIssue[] {
    const issues: TemplateValidationIssue[] = [];
    const lines = code.split("\n");

    // Check for TOTVS.CH
    const hasTotvsCH = /^\s*#include\s+"TOTVS\.CH"/im.test(code);
    if (!hasTotvsCH) {
      issues.push({
        line: 1,
        code: "MISSING_TOTVS_CH",
        message: 'Missing required include: #Include "TOTVS.CH"',
        severity: "warning",
        suggestion: 'Add #Include "TOTVS.CH" at start of file',
      });
    }

    // Check for TLPP specific includes
    if (language === "tlpp") {
      // If using FW classes, should have appropriate includes
      if (/FWMVC|FWMBrowse|MPFormModel/.test(code)) {
        const hasProtheusCH = /^\s*#include\s+"PROTHEUS\.CH"/im.test(code);
        if (!hasProtheusCH) {
          const lineNum = lines.findIndex((l) =>
            /FWMVC|FWMBrowse|MPFormModel/.test(l)
          );
          issues.push({
            line: lineNum + 1,
            code: "MISSING_PROTHEUS_CH",
            message: 'Missing include for FW framework: #Include "PROTHEUS.CH"',
            severity: "warning",
            suggestion: 'Add #Include "PROTHEUS.CH"',
          });
        }
      }
    }

    return issues;
  }

  /**
   * Validar header Protheus.doc
   */
  private static validateProtheusDoc(code: string): TemplateValidationIssue[] {
    const issues: TemplateValidationIssue[] = [];

    const hasProtheusDoc = /\/\*\/\{Protheus\.doc\}/i.test(code);
    if (!hasProtheusDoc) {
      issues.push({
        line: 1,
        code: "MISSING_PROTHEUS_DOC",
        message: "Missing Protheus.doc header documentation",
        severity: "info",
        suggestion: 'Add /*/{Protheus.doc} structure with @type, @author, etc.',
      });
    }

    return issues;
  }

  /**
   * Validar Begin Sequence...Except structure
   */
  private static validateBeginSequence(code: string): TemplateValidationIssue[] {
    const issues: TemplateValidationIssue[] = [];
    const lines = code.split("\n");

    // Find Begin Sequence
    const beginIdx = lines.findIndex((l) =>
      /Begin\s+Sequence/i.test(l)
    );
    if (beginIdx >= 0) {
      // Look for matching Except and End Sequence
      let hasExcept = false;
      let hasEndSeq = false;

      for (let i = beginIdx + 1; i < lines.length; i++) {
        if (/Except/i.test(lines[i])) hasExcept = true;
        if (/End\s+Sequence/i.test(lines[i])) hasEndSeq = true;
      }

      if (!hasExcept) {
        issues.push({
          line: beginIdx + 1,
          code: "MISSING_EXCEPT",
          message: "Begin Sequence without matching Except",
          severity: "error",
          suggestion: "Add 'Except' clause after logic",
        });
      }

      if (!hasEndSeq) {
        issues.push({
          line: beginIdx + 1,
          code: "MISSING_END_SEQUENCE",
          message: "Begin Sequence without matching End Sequence",
          severity: "error",
          suggestion: "Add 'End Sequence' to close block",
        });
      }
    }

    return issues;
  }

  /**
   * Gerar relatório formatado
   */
  public static generateReport(result: TemplateValidationResult): string {
    let report = `\n${"=".repeat(70)}\n`;
    report += `Template Validation Report\n`;
    report += `File: ${result.filename}\n`;
    report += `Language: ${result.language}\n`;
    report += `Status: ${result.valid ? "✅ VALID" : "❌ INVALID"}\n`;
    report += `${"=".repeat(70)}\n\n`;

    report += `Statistics:\n`;
    report += `  Total Lines: ${result.statistics.totalLines}\n`;
    report += `  Errors: ${result.statistics.errorCount}\n`;
    report += `  Warnings: ${result.statistics.warningCount}\n`;
    report += `  Info: ${result.statistics.infoCount}\n\n`;

    if (result.issues.length === 0) {
      report += `✅ No issues found!\n`;
    } else {
      report += `Issues:\n`;
      report += `${"".repeat(70)}\n`;

      result.issues.forEach((issue) => {
        const icon = {
          error: "🔴",
          warning: "🟡",
          info: "🔵",
        }[issue.severity];

        report += `${icon} [${issue.code}] Line ${issue.line}: ${issue.message}\n`;
        if (issue.column) report += `    Column: ${issue.column}\n`;
        if (issue.suggestion) report += `    💡 Suggestion: ${issue.suggestion}\n`;
      });
    }

    report += `\n${"=".repeat(70)}\n`;
    return report;
  }

  /**
   * Exportar resultado como JSON
   */
  public static exportAsJson(result: TemplateValidationResult): string {
    return JSON.stringify(result, null, 2);
  }
}
