/**
 * Phase 9 Tests - TDN Function Scraper
 * Testa scraper automático que atualiza lista de funções TDN
 * 
 * Objetivos:
 * 1. Extrair funções da TDN
 * 2. Manter cache atualizado
 * 3. Gerar relatórios de cobertura
 * 4. Integração com TdnFunctionValidator
 */

import { TdnFunctionScraper, TdnFunction, ScraperResult } from "../tdn-scraper.js";

console.log(
  "\n╔════════════════════════════════════════════════════════════╗"
);
console.log(
  "║       Phase 9 Tests - TDN Function Scraper               ║"
);
console.log(
  "╚════════════════════════════════════════════════════════════╝\n"
);

let passedTests = 0;
let totalTests = 0;

function test(name: string, fn: () => boolean | Promise<boolean>): void {
  totalTests++;
  try {
    const result = fn();
    if (result instanceof Promise) {
      result
        .then((passed) => {
          if (passed) {
            console.log(`✓ ${name}`);
            passedTests++;
          } else {
            console.log(`✗ ${name}`);
          }
        })
        .catch((error) => {
          console.log(`✗ ${name} - Error: ${error}`);
        });
    } else {
      if (result) {
        console.log(`✓ ${name}`);
        passedTests++;
      } else {
        console.log(`✗ ${name}`);
      }
    }
  } catch (error) {
    console.log(`✗ ${name} - Error: ${error}`);
  }
}

// Test 1: Get all functions
test("TdnFunctionScraper.getFunctions() returns ScraperResult", async () => {
  const result = await TdnFunctionScraper.getFunctions();
  return (
    result &&
    result.totalFunctions > 0 &&
    result.functions.length > 0 &&
    result.timestamp > 0
  );
});

// Test 2: Functions have required fields
test("All functions have required fields", async () => {
  const result = await TdnFunctionScraper.getFunctions();
  return result.functions.every(
    (f) =>
      f.name &&
      f.type &&
      f.language &&
      f.description &&
      f.category
  );
});

// Test 3: Cache works on second call
test("Cache works - second call returns cacheHit=true", async () => {
  TdnFunctionScraper.clearCache();
  const result1 = await TdnFunctionScraper.getFunctions();
  const result2 = await TdnFunctionScraper.getFunctions();

  return result1.cacheHit === false && result2.cacheHit === true;
});

// Test 4: Force refresh clears cache
test("forceRefresh parameter bypasses cache", async () => {
  await TdnFunctionScraper.getFunctions();
  const result = await TdnFunctionScraper.getFunctions(true);

  return result.cacheHit === false;
});

// Test 5: Get function names
test("getFunctionNames() returns array of strings", async () => {
  const names = await TdnFunctionScraper.getFunctionNames();

  return (
    Array.isArray(names) &&
    names.length > 0 &&
    names.every((n) => typeof n === "string") &&
    names.includes("Upper") &&
    names.includes("DbSeek")
  );
});

// Test 6: Get functions by category
test("getFunctionsByCategory('Database') returns Database functions", async () => {
  const dbFunctions = await TdnFunctionScraper.getFunctionsByCategory("Database");

  return (
    dbFunctions.length > 0 &&
    dbFunctions.every((f) => f.category === "Database") &&
    dbFunctions.some((f) => f.name === "DbSeek")
  );
});

// Test 7: Get functions by language (ADVPL)
test("getFunctionsByLanguage('advpl') filters correctly", async () => {
  const advplFuncs = await TdnFunctionScraper.getFunctionsByLanguage("advpl");

  return (
    advplFuncs.length > 0 &&
    advplFuncs.every(
      (f) => f.language === "advpl" || f.language === "both"
    )
  );
});

// Test 8: Get functions by language (TLPP)
test("getFunctionsByLanguage('tlpp') filters correctly", async () => {
  const tlppFuncs = await TdnFunctionScraper.getFunctionsByLanguage("tlpp");

  // TLPP functions should be "both" mostly or specific to TLPP
  return (
    tlppFuncs.length > 0 &&
    tlppFuncs.every(
      (f) => f.language === "tlpp" || f.language === "both"
    )
  );
});

// Test 9: Get functions with "both" language
test("getFunctionsByLanguage('both') returns all 'both' functions", async () => {
  const allLang = await TdnFunctionScraper.getFunctionsByLanguage("both");

  return (
    allLang.length > 0 &&
    allLang.every((f) => f.language === "both") &&
    allLang.some((f) => f.name === "Upper")
  );
});

// Test 10: Generate TDN verified Set
test("generateTdnVerifiedSet() returns Set with function names", async () => {
  const set = await TdnFunctionScraper.generateTdnVerifiedSet();

  return (
    set instanceof Set &&
    set.size > 0 &&
    set.has("Upper") &&
    set.has("DbSeek") &&
    set.has("GetErrorMessage")
  );
});

// Test 11: Coverage report generation
test("getCoverageReport() returns formatted string", async () => {
  const report = await TdnFunctionScraper.getCoverageReport();

  return (
    typeof report === "string" &&
    report.includes("TDN Scraper") &&
    report.includes("Summary") &&
    report.includes("Total Functions") &&
    report.includes("Category")
  );
});

// Test 12: Coverage report includes categories
test("Coverage report groups functions by category", async () => {
  const report = await TdnFunctionScraper.getCoverageReport();

  return (
    report.includes("Database") &&
    report.includes("String") &&
    report.includes("Type") &&
    report.includes("Array")
  );
});

// Test 13: Source shows "live" or "cache"
test("ScraperResult.source is either 'live' or 'cache'", async () => {
  TdnFunctionScraper.clearCache();
  const result1 = await TdnFunctionScraper.getFunctions();
  const result2 = await TdnFunctionScraper.getFunctions();

  return (
    (result1.source === "live" || result1.source === "cache") &&
    (result2.source === "live" || result2.source === "cache")
  );
});

// Test 14: Timestamp is valid
test("ScraperResult.timestamp is valid", async () => {
  const result = await TdnFunctionScraper.getFunctions(true);
  const now = Date.now();

  return result.timestamp > 0 && result.timestamp <= now;
});

// Test 15: Errors array exists and is empty (no errors)
test("ScraperResult.errors is empty array on success", async () => {
  const result = await TdnFunctionScraper.getFunctions();

  return Array.isArray(result.errors) && result.errors.length === 0;
});

// Test 16: Specific functions exist
test("Known TOTVS functions are in the list", async () => {
  const names = await TdnFunctionScraper.getFunctionNames();

  const knownFunctions = [
    "DbSeek",
    "DbSkip",
    "Upper",
    "Lower",
    "GetMV",
    "GetSX3",
    "Alert",
    "GetErrorMessage",
    "GetException",
  ];

  return knownFunctions.every((fn) => names.includes(fn));
});

// Test 17: Category distribution
test("Categories have reasonable distribution", async () => {
  const result = await TdnFunctionScraper.getFunctions();
  const categories = new Set(result.functions.map((f) => f.category));

  // Should have at least 8 categories
  return categories.size >= 8;
});

// Test 18: Clear cache works
test("clearCache() clears the cache", async () => {
  await TdnFunctionScraper.getFunctions();
  TdnFunctionScraper.clearCache();
  const result = await TdnFunctionScraper.getFunctions();

  return result.cacheHit === false;
});

// Wait for all async tests to complete
setTimeout(() => {
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
  console.log(
    `Status: ${passedTests === totalTests ? "🎉 ALL TESTS PASSED!" : "❌ SOME TESTS FAILED"}\n`
  );

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}, 2000);
