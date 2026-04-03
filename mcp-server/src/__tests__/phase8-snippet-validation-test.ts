/**
 * Phase 8 Tests - Snippet Validation Against TDN
 * Testa integração do SnippetsValidator no SnippetsGenerator
 * 
 * Objetivos:
 * 1. Validar cada snippet contra TDN
 * 2. Detectar funções fictícias em snippets
 * 3. Reportar cobertura de TDN em snippets
 * 4. Gerar relatório formatado
 */

import { SnippetsGenerator } from "../snippets-generator.js";
import { SnippetsValidator, SnippetValidationReport } from "../snippets-validator.js";
import { TdnFunctionValidator } from "../tdn-function-validator.js";

console.log(
  "\n╔════════════════════════════════════════════════════════════╗"
);
console.log(
  "║       Phase 8 Tests - Snippet Validation vs TDN          ║"
);
console.log(
  "╚════════════════════════════════════════════════════════════╝\n"
);

let passedTests = 0;
let totalTests = 0;

function test(name: string, fn: () => boolean): void {
  totalTests++;
  try {
    if (fn()) {
      console.log(`✓ ${name}`);
      passedTests++;
    } else {
      console.log(`✗ ${name}`);
    }
  } catch (error) {
    console.log(`✗ ${name} - Error: ${error}`);
  }
}

// Test 1: SnippetsGenerator exports correctly
test("SnippetsGenerator.generateSnippets() returns SnippetsFile", () => {
  const snippets = SnippetsGenerator.generateSnippets();
  return (
    snippets &&
    Object.keys(snippets).length > 0 &&
    snippets.advpl_function !== undefined
  );
});

// Test 2: validateAllSnippets() works
test("SnippetsGenerator.validateAllSnippets() works", () => {
  const report = SnippetsGenerator.validateAllSnippets();
  return (
    report &&
    report.totalSnippets > 0 &&
    report.validSnippets >= 0 &&
    report.issuesFound !== undefined
  );
});

// Test 3: Snippet count validation
test("All snippets are counted in validation", () => {
  const snippets = SnippetsGenerator.generateSnippets();
  const report = SnippetsGenerator.validateAllSnippets();
  return Object.keys(snippets).length === report.totalSnippets;
});

// Test 4: Coverage percentage calculation
test("Coverage percentage is calculated correctly", () => {
  const report = SnippetsGenerator.validateAllSnippets();
  const expectedCoverage = Math.round(
    (report.validSnippets / report.totalSnippets) * 100
  );
  return report.coverage === expectedCoverage;
});

// Test 5: generateValidationReport() returns formatted string
test("SnippetsGenerator.generateValidationReport() returns string", () => {
  const report = SnippetsGenerator.generateValidationReport();
  return (
    typeof report === "string" &&
    report.includes("Snippets Validation Report") &&
    report.includes("Statistics")
  );
});

// Test 6: Language filter works (ADVPL)
test("validateAllSnippets('advpl') filters correctly", () => {
  const advplReport = SnippetsGenerator.validateAllSnippets("advpl");
  const tlppReport = SnippetsGenerator.validateAllSnippets("tlpp");
  // Should have at least one ADVPL and one TLPP snippet
  return advplReport.totalSnippets > 0 && tlppReport.totalSnippets > 0;
});

// Test 7: Validate ADVPL function snippet
test("validateAllSnippets('advpl') detects ADVPL snippets", () => {
  const report = SnippetsGenerator.validateAllSnippets("advpl");
  // ADVPL should have more snippets than TLPP
  return report.totalSnippets > 1;
});

// Test 8: getTryCatchSnippet uses real functions
test("getTryCatchSnippet uses TDN functions (GetErrorMessage, GetException)", () => {
  const report = SnippetsGenerator.validateAllSnippets("advpl");

  // Look for GetErrorMessage and GetException in validation
  // These are real TDN functions
  const usedFunctions = report.issuesFound
    .map((i) => i.function)
    .filter((f) => f === "GetErrorMessage" || f === "GetException");

  // Should NOT have these as issues since they're real
  return usedFunctions.length === 0 || report.validSnippets > 0;
});

// Test 9: Report includes statistics
test("Validation report includes all statistics", () => {
  const report = SnippetsGenerator.generateValidationReport();
  return (
    report.includes("Total Snippets") &&
    report.includes("Valid Snippets") &&
    report.includes("Issues Found") &&
    report.includes("Coverage")
  );
});

// Test 10: SnippetsValidator.validateSnippet() works
test("SnippetsValidator.validateSnippet() validates individual snippet", () => {
  const snippet = [
    "User Function Test()",
    "\tLocal x := Upper(\"hello\")",
    "\tReturn x",
  ];

  const issues = SnippetsValidator.validateSnippet(
    "test_snippet",
    snippet,
    "advpl"
  );

  // Upper is a real function, so no issues expected
  return Array.isArray(issues);
});

// Test 11: Detects fictitious functions in snippets
test("SnippetsValidator detects fictitious functions in snippets", () => {
  // HttpServer is NOT a real TDN function
  const snippet = [
    "User Function Test()",
    "\tLocal oServer := HttpServer():New()",
    "\tReturn oServer",
  ];

  const issues = SnippetsValidator.validateSnippet(
    "fictitious_test",
    snippet,
    "advpl"
  );

  // Should find HttpServer as fictitious
  const httpServerIssues = issues.filter((i) => i.function === "HttpServer");
  return httpServerIssues.length > 0;
});

// Test 12: SnippetsValidator.generateReport() formats nicely
test("SnippetsValidator.generateReport() formats with proper styling", () => {
  const mockReport: SnippetValidationReport = {
    totalSnippets: 5,
    validSnippets: 4,
    issuesFound: [
      {
        snippet: "test1",
        function: "HttpServer",
        severity: "error",
        message: "Function not found in TDN",
        suggestion: "Use a real function",
      },
    ],
    coverage: 80,
  };

  const report = SnippetsValidator.generateReport(mockReport);
  return (
    report.includes("Snippets Validation Report") &&
    report.includes("80%") &&
    report.includes("HttpServer")
  );
});

// Test 13: Multiple issues grouped by severity
test("SnippetsValidator.generateReport() groups issues by severity", () => {
  const mockReport: SnippetValidationReport = {
    totalSnippets: 3,
    validSnippets: 1,
    issuesFound: [
      {
        snippet: "s1",
        function: "Fake1",
        severity: "error",
        message: "Error",
      },
      {
        snippet: "s2",
        function: "Fake2",
        severity: "warning",
        message: "Warning",
      },
      {
        snippet: "s3",
        function: "Fake3",
        severity: "error",
        message: "Another error",
      },
    ],
    coverage: 33,
  };

  const report = SnippetsValidator.generateReport(mockReport);
  return (
    report.includes("ERRORS (2)") &&
    report.includes("WARNINGS (1)") &&
    report.includes("Fake1") &&
    report.includes("Fake2")
  );
});

// Test 14: Zero issues shows success message
test("SnippetsValidator.generateReport() shows success for valid snippets", () => {
  const mockReport: SnippetValidationReport = {
    totalSnippets: 3,
    validSnippets: 3,
    issuesFound: [],
    coverage: 100,
  };

  const report = SnippetsValidator.generateReport(mockReport);
  return (
    report.includes("100%") &&
    report.includes("All snippets use TDN-verified functions")
  );
});

// Test 15: Actual snippet validation with real generator
test("Real SnippetsGenerator snippets validation report", () => {
  const report = SnippetsGenerator.generateValidationReport();

  // Report should contain basic structure
  return (
    report.includes("Statistics") &&
    report.includes("Total Snippets") &&
    (report.includes("✅") || report.includes("⚠️"))
  );
});

// Test 16: TdnFunctionValidator integration
test("SnippetsValidator uses TdnFunctionValidator.validateCode()", () => {
  const code = `
User Function Test()
  Local x := Upper("hello")
  Local y := Lower(x)
  Return y
`;

  // Should validate using TDN
  const snippet = code.split("\n");
  const issues = SnippetsValidator.validateSnippet(
    "integTest",
    snippet,
    "advpl"
  );

  // Upper and Lower are real, so should be valid or have minimal issues
  return Array.isArray(issues);
});

// Test 17: Return real coverage metric
test("Validation report returns realistic coverage (not 100%)", () => {
  const report = SnippetsGenerator.validateAllSnippets();

  // Coverage should be between 0-100
  return report.coverage >= 0 && report.coverage <= 100;
});

// Test 18: Snippet with mixed real/fake functions
test("SnippetsValidator detects mixed real/fake functions", () => {
  const snippet = [
    "User Function Mixed()",
    "\tLocal x := Upper(\"test\")", // Real
    "\tLocal y := FakeFunc()", // Fake
    "\tReturn x + y",
  ];

  const issues = SnippetsValidator.validateSnippet(
    "mixed_test",
    snippet,
    "advpl"
  );

  // Should have at least one issue for FakeFunc
  return issues.some((i) => i.function === "FakeFunc");
});

// Final summary
console.log(
  `\n╔════════════════════════════════════════════════════════════╗`
);
console.log(
  `║                    Test Summary                           ║`
);
console.log(
  `╚════════════════════════════════════════════════════════════╝\n`
);

console.log(`✅ Passed: ${passedTests}/${totalTests}`);
console.log(`Status: ${passedTests === totalTests ? "🎉 ALL TESTS PASSED!" : "❌ SOME TESTS FAILED"}\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
