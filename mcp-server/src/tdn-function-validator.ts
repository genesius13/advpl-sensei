/**
 * TDN Function Validator - Valida registro de funções contra TDN oficial
 * Fase 6 - Validação contra fonte TOTVS oficial
 */

import { FUNCTION_REGISTRY, FunctionValidator } from "./function-registry.js";

export interface ValidationResult {
  status: "valid" | "missing" | "deprecated" | "incompatible";
  function: string;
  message: string;
  severity: "error" | "warning" | "info";
  tdnUrl?: string;
}

export interface RegistryValidationReport {
  totalFunctionsChecked: number;
  validFunctions: number;
  missingFunctions: string[];
  deprecatedFunctions: string[];
  coverage: number;
  tdnFunctionsFound: number;
}

/**
 * Validador de funções contra TDN
 * Lista básica de funções TDN verificadas
 */
export class TdnFunctionValidator {
  // Lista expandida: 50+ funções verificadas em TDN
  private static readonly TDN_VERIFIED = new Set([
    // ========== DATABASE ==========
    "DbSeek",
    "DbSkip",
    "Eof",
    "DbGoTop",
    "DbGoBottom",
    "RecNo",
    "GetArea",
    "RestArea",
    "RecLock",
    "DbAppend",
    "DbEdit",
    "DbDelete",
    "DbStruct",
    "Field",
    "FieldLen",
    "FieldDec",
    "OrdKey",
    "OrdCreate",
    "MsUnlock",
    
    // ========== STRING ==========
    "Upper",
    "Lower",
    "SubStr",
    "StrTran",
    "Len",
    "At",
    "Alltrim",
    "LTrim",
    "RTrim",
    "Trim",
    "Stuff",
    "PadLeft",
    "PadRight",
    
    // ========== TYPE/CONVERSION ==========
    "Val",
    "Str",
    "Date",
    "Empty",
    "Int",
    "Round",
    "Abs",
    "Type",
    "ValType",
    "CtoD",
    "DtoC",
    "SToD",
    "DToS",
    "Iif",
    
    // ========== MATH ==========
    "Min",
    "Max",
    "Mod",
    "Sqrt",
    "Exp",
    "Log",
    
    // ========== DATE ==========
    "Month",
    "Year",
    "Day",
    "Time",
    
    // ========== ARRAY ==========
    "AClone",
    "AAdd",
    "ADel",
    "ASize",
    "AScan",
    "ASort",
    
    // ========== PARAMETERS ==========
    "GetMV",
    "GetSX3",
    "GetSX5",
    "PutMV",
    
    // ========== INTERFACE ==========
    "Alert",
    "MsgBox",
    "ConOut",
    
    // ========== FRAMEWORK ==========
    "GetException",
    "GetErrorMessage",
    "OldNotation",
  ]);


  /**
   * Validar função única contra TDN
   */
  public static validateFunction(functionName: string): ValidationResult {
    const registryEntry = FunctionValidator.getDefinition(functionName);

    // Detectar fictícias
    if (
      functionName === "HttpServer" ||
      (registryEntry?.deprecated === true) || 
      (registryEntry?.description.includes("❌") || registryEntry?.description.includes("FICTÍCIA"))
    ) {
      return {
        status: "missing",
        function: functionName,
        message: `Function '${functionName}' is fictitious or deprecated`,
        severity: "error",
      };
    }

    // Verificar se está em TDN verificado
    if (this.TDN_VERIFIED.has(functionName)) {
      return {
        status: "valid",
        function: functionName,
        message: `Function '${functionName}' verified in TDN ✅`,
        severity: "info",
      };
    }

    // Se está em registry mas não passou em TDN
    if (registryEntry) {
      return {
        status: "missing",
        function: functionName,
        message: `Function '${functionName}' in registry but not verified in TDN ⚠️`,
        severity: "warning",
      };
    }

    return {
      status: "missing",
      function: functionName,
      message: `Function '${functionName}' not found`,
      severity: "warning",
    };
  }

  /**
   * Validar código contra TDN
   */
  public static validateCode(code: string, _language: "advpl" | "tlpp"): ValidationResult[] {
    const results: ValidationResult[] = [];
    const functionCallRegex = /\b([A-Za-z_]\w*)\s*\(/g;

    let match;
    while ((match = functionCallRegex.exec(code)) !== null) {
      const funcName = match[1];

      // Skip keywords
      if (
        ["if", "while", "for", "switch", "case", "return", "local", "static", "function"].includes(
          funcName.toLowerCase()
        )
      ) {
        continue;
      }

      const result = this.validateFunction(funcName);
      if (result.status !== "valid") {
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Gerar relatório de validação
   */
  public static generateValidationReport(): RegistryValidationReport {
    const report: RegistryValidationReport = {
      totalFunctionsChecked: 0,
      validFunctions: 0,
      missingFunctions: [],
      deprecatedFunctions: [],
      coverage: 0,
      tdnFunctionsFound: this.TDN_VERIFIED.size,
    };

    Object.values(FUNCTION_REGISTRY).forEach((func) => {
      report.totalFunctionsChecked++;

      if (func.deprecated === true) {
        report.deprecatedFunctions.push(func.name);
      } else if (this.TDN_VERIFIED.has(func.name)) {
        report.validFunctions++;
      } else {
        report.missingFunctions.push(func.name);
      }
    });

    report.coverage = Math.round((report.validFunctions / report.tdnFunctionsFound) * 100);

    return report;
  }

  /**
   * Sugerir funções para adicionar
   */
  public static suggestMissingFunctions(): string[] {
    const registryNames = new Set(Object.values(FUNCTION_REGISTRY).map((f) => f.name));
    return Array.from(this.TDN_VERIFIED).filter((name) => !registryNames.has(name));
  }
}
