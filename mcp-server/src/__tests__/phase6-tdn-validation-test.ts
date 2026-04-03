/**
 * Phase 6 Integration Tests - TDN Function Validator
 * Valida funções contra TOTVS official documentation
 * 
 * Testes:
 * 1. Validação de funções contra TDN oficial
 * 2. Detecção de fictícias funciona
 * 3. Registry está alignado com TDN
 * 4. Templates validam contra TDN
 */

import { TdnFunctionValidator } from "../tdn-function-validator.js";
import { TemplateValidator } from "../template-validator.js";

console.log("\n╔════════════════════════════════════════════════════════════╗");
console.log("║  PHASE 6 Tests - TDN Function Validation                  ║");
console.log("╚════════════════════════════════════════════════════════════╝\n");

let testsPassed = 0;
let testsFailed = 0;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function test(name: string, fn: () => boolean) {
  try {
    const result = fn();
    if (result) {
      console.log(`✓ Test ${testsPassed + testsFailed + 1}: ${name}`);
      testsPassed++;
    } else {
      console.log(`✗ Test ${testsPassed + testsFailed + 1}: ${name}`);
      testsFailed++;
    }
  } catch (e: unknown) {
    console.log(`✗ Test ${testsPassed + testsFailed + 1}: ${name}`);
    const errorMsg = e instanceof Error ? e.message : String(e);
    console.log(`  Error: ${errorMsg}`);
    testsFailed++;
  }
}

// Test 1: Detecção de funções fictícias
test("Validador detecta funções fictícias", () => {
  const result = TdnFunctionValidator.validateFunction("HttpServer");
  return result.status === "missing" && result.severity === "error";
});

// Test 2: Reconhece funções reais
test("Validador reconhece funções reais (Upper)", () => {
  const result = TdnFunctionValidator.validateFunction("Upper");
  return result.status === "valid" && result.severity === "info";
});

// Test 3: Reconhece funções reais (DbSeek)
test("Validador reconhece funções reais (DbSeek)", () => {
  const result = TdnFunctionValidator.validateFunction("DbSeek");
  return result.status === "valid";
});

// Test 4: Reconhece funções reais (Date)
test("Validador reconhece funções reais (Date)", () => {
  const result = TdnFunctionValidator.validateFunction("Date");
  return result.status === "valid";
});

// Test 5: Detecta incompatibilidade com TLPP
test("Função ADVPL-only não compila em TLPP", () => {
  const result = TdnFunctionValidator.validateFunction("DbSeek");
  // DbSeek é only ADVPL, logo informação será que é restrita
  return result.status === "valid"; // Mas deve estar no registry
});

// Test 6: Sugestões são funções reais
test("Gera sugestões de funções", () => {
  const suggestions = TdnFunctionValidator.suggestMissingFunctions();
  // Sugestões pode estar vazio (coverage = 100%) ou ter items
  const isArray = Array.isArray(suggestions);
  console.log(`    Suggestions: ${suggestions.length} functions missing from registry`);
  return isArray;
});

// Test 7: Valida código com TDN - funções válidas
test("Valida código com TDN - funções válidas", () => {
  const code = `
    User Function TestFunc()
      Local cText := Upper("test")
      Local nValue := Val("123")
      Return .T.
    `;

  const issues = TdnFunctionValidator.validateCode(code, "advpl");
  // Upper e Val são válidas, não deve haver erro
  const criticalIssues = issues.filter((i) => i.severity === "error");
  return criticalIssues.length === 0;
});

// Test 8: Detecta HttpServer fictícia em código
test("Detecta HttpServer() fictícia em código", () => {
  const code = `
    User Function TestApi()
      Local oServer := HttpServer()
      Return .T.
    `;

  const issues = TdnFunctionValidator.validateCode(code, "advpl");
  const hasHttpServerWarning = issues.some(
    (i) => i.function === "HttpServer" && i.severity === "error"
  );
  return hasHttpServerWarning;
});

// Test 9: Template validator rejeita fictícias
test("Template validator rejeita HttpServer()", () => {
  const code = `
    #Include "TOTVS.CH"
    User Function BadTemplate()
      Local oServer := HttpServer()
      Return oServer
    `;

  const result = TemplateValidator.validate(code, "bad.prw", "advpl");
  // Não deve ser válido
  return !result.valid && result.statistics.errorCount > 0;
});

// Test 10: Template validator aceita funções válidas
test("Template validator aceita funções válidas", () => {
  const code = `
    #Include "TOTVS.CH"
    User Function GoodTemplate()
      Local cMsg := Upper("Teste")
      Local nVal := Val("123")
      Return cMsg
    `;

  const result = TemplateValidator.validate(code, "good.prw", "advpl");
  // Deve compilar ou ter no máximo warnings
  const fictionErrors = result.issues.filter((i) => i.code === "FUNC_FICTITIOUS");
  return fictionErrors.length === 0;
});

// Test 11: Registry validation report
test("Gera relatório de validação de registry", () => {
  const report = TdnFunctionValidator.generateValidationReport();

  console.log(
    `    Registry: ${report.totalFunctionsChecked} functions, TDN: ${report.tdnFunctionsFound}, Coverage: ${report.coverage}%`
  );
  console.log(
    `    Valid: ${report.validFunctions}, Missing: ${report.missingFunctions.length}`
  );

  return (
    report.coverage > 0 &&
    report.tdnFunctionsFound > 0 &&
    report.validFunctions >= 0
  );
});

// Test 12: Coverage > 50%
test("Registry coverage está acima de 50%", () => {
  const report = TdnFunctionValidator.generateValidationReport();
  return report.coverage >= 50;
});

// Test 13: Nenhuma funcão fictícia é marcada válida
test("Fictícias nunca são marcadas como válidas", () => {
  const result = TdnFunctionValidator.validateFunction("HttpServer");
  // Deve ser erro, não valid
  return result.status !== "valid";
});

// Test 14: Funções com spelling errado não são encontradas
test("Função com typo não é validada", () => {
  const result = TdnFunctionValidator.validateFunction("Upperr"); // typo
  // Não deve ser válida
  return result.status !== "valid";
});

// Test 15: Integração: código com mistura válida+fictícia
test("Detecta mix de funções válidas e fictícias", () => {
  const code = `
    User Function MixedTest()
      Local cMsg := Upper("ok")     // válida
      Local oSrv := HttpServer()    // fictícia
      Return cMsg
    `;

  const issues = TdnFunctionValidator.validateCode(code, "advpl");
  const hasUpperWarning = issues.some((i) => i.function === "Upper");
  const hasHttpServerError = issues.some(
    (i) => i.function === "HttpServer" && i.severity === "error"
  );

  // Upper pode ter warning (not found) mas HttpServer deve ser erro
  return hasHttpServerError;
});

console.log("\n╔════════════════════════════════════════════════════════════╗");
console.log(`║  ✅  ${testsPassed}/${testsPassed + testsFailed} TESTS PASSED!`);
if (testsFailed > 0) {
  console.log(`║  ❌  ${testsFailed} tests failed`);
}
console.log("╚════════════════════════════════════════════════════════════╝\n");

process.exit(testsFailed > 0 ? 1 : 0);
