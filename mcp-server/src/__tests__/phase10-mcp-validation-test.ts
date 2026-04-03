/**
 * Phase 10: MCP Validation Command Integration Tests
 * 
 * Testa a integração do comando 'advpl_validate_tdn' no servidor MCP
 * 
 * Features testadas:
 * - Handler: validação de função individual
 * - Handler: validação de bloco de código
 * - Handler: validação combinada (code + function)
 * - Schema: parâmetros e tipos corretos
 * - Output: formatação e estrutura
 * - Cache: forceRefresh funciona
 * - Detailed: modo detalhado ativado
 */

import { handleValidateTdn, validateTdnSchema } from "../commands/validate-tdn.js";

/**
 * Test Counter
 */
let testCount = 0;
let passCount = 0;
let failCount = 0;

function assert(condition: boolean, message: string) {
  testCount++;
  if (condition) {
    passCount++;
    console.log(`  ✅ Test ${testCount}: ${message}`);
  } else {
    failCount++;
    console.log(`  ❌ Test ${testCount}: ${message}`);
  }
}

/**
 * TEST 1: Schema validation
 */
console.log("\n📋 TEST GROUP 1: Schema Validation");
assert(
  validateTdnSchema.name === "advpl_validate_tdn",
  "Schema name is correct"
);
assert(
  typeof validateTdnSchema.description === "string" && validateTdnSchema.description.includes("TDN"),
  "Schema description mentions TDN"
);
assert(
  validateTdnSchema.inputSchema?.properties?.code !== undefined,
  "Schema has 'code' property"
);
assert(
  validateTdnSchema.inputSchema?.properties?.function !== undefined,
  "Schema has 'function' property"
);
assert(
  validateTdnSchema.inputSchema?.properties?.language !== undefined,
  "Schema has 'language' property"
); assert(
  validateTdnSchema.inputSchema?.properties?.detailed !== undefined,
  "Schema has 'detailed' property"
);
assert(
  validateTdnSchema.inputSchema?.properties?.forceRefresh !== undefined,
  "Schema has 'forceRefresh' property"
);

/**
 * TEST 2: Handler invocation with valid function
 */
console.log("\n📋 TEST GROUP 2: Validate Single Function");
let result = await handleValidateTdn({
  function: "DbSeek",
  language: "advpl",
});
assert(
  result.type === "text",
  "Handler returns TextContent type"
);
const text2 = typeof result.text === "string" ? result.text : "";
assert(
  text2.includes("DbSeek"),
  "Result includes function name"
);
assert(
  text2.includes("✅"),
  "Valid function shows success icon"
);
assert(
  text2.includes("Status:"),
  "Result includes status"
);

/**
 * TEST 3: Handler with fictitious function
 */
console.log("\n📋 TEST GROUP 3: Detect Fictitious Function");
result = await handleValidateTdn({
  function: "HttpServer",
  language: "advpl",
});
const text3 = typeof result.text === "string" ? result.text : "";
assert(
  text3.includes("❌"),
  "Fictitious function shows error icon"
);
assert(
  text3.includes("HttpServer"),
  "Result includes function name"
);

/**
 * TEST 4: Handler with code validation
 */
console.log("\n📋 TEST GROUP 4: Validate Code Block");
result = await handleValidateTdn({
  code: "Local x := Upper('hello')",
  language: "advpl",
  filename: "test.prw",
});
const text4 = typeof result.text === "string" ? result.text : "";
assert(
  text4.includes("test.prw"),
  "Result includes filename"
);
assert(
  text4.includes("Validating Code Block"),
  "Result indicates code validation"
);
assert(
  result.type === "text",
  "Code validation returns TextContent"
);

/**
 * TEST 5: Code validation (structure detected)
 */
console.log("\n📋 TEST GROUP 5: Code Validation");
result = await handleValidateTdn({
  code: "Local nValue := Abs(-100)\nLocal cText := Upper('hello')",
  language: "advpl",
});
const text5 = typeof result.text === "string" ? result.text : "";
assert(
  text5.includes("Validating Code Block") || text5.includes("Issues Found") || text5.includes("No issues"),
  "Code validation processes the code block"
);
assert(
  text5.length > 50,
  "Code validation produces a detailed report"
);

/**
 * TEST 6: Invalid code (with fictitious function)
 */
console.log("\n📋 TEST GROUP 6: Invalid Code Detection");
result = await handleValidateTdn({
  code: "Local oServer := HttpServer():New()",
  language: "advpl",
});
const text6 = typeof result.text === "string" ? result.text : "";
assert(
  text6.includes("⚠️"),
  "Invalid code shows warning icon"
);
assert(
  text6.includes("HttpServer"),
  "Result mentions fictional function"
);

/**
 * TEST 7: Detailed mode
 */
console.log("\n📋 TEST GROUP 7: Detailed Mode");
result = await handleValidateTdn({
  function: "Upper",
  language: "advpl",
  detailed: true,
});
const text7 = typeof result.text === "string" ? result.text : "";
assert(
  text7.includes("Details:"),
  "Detailed mode shows extra information"
);
assert(
  text7.includes("Category:"),
  "Detailed mode includes category"
);

/**
 * TEST 8: Multiple language validation
 */
console.log("\n📋 TEST GROUP 8: Language Compatibility");
result = await handleValidateTdn({
  code: "DbSeek(cCodigo)",
  language: "advpl",
});
assert(
  typeof result.text === "string",
  "ADVPL validation works"
);

result = await handleValidateTdn({
  code: "DbSeek(cCodigo)",
  language: "tlpp",
});
assert(
  typeof result.text === "string",
  "TLPP validation works"
);

/**
 * TEST 9: Both language validation
 */
console.log("\n📋 TEST GROUP 9: Both Language Validation");
result = await handleValidateTdn({
  code: "Local x := Val('123')",
  language: "both",
});
const text9 = typeof result.text === "string" ? result.text : "";
assert(
  text9.includes("both"),
  "Both language mode is handled"
);
assert(
  typeof result.text === "string",
  "Both language validation completes"
);

/**
 * TEST 10: Force refresh parameter
 */
console.log("\n📋 TEST GROUP 10: Force Refresh");
result = await handleValidateTdn({
  code: "Local x := Upper('test')",
  language: "advpl",
  forceRefresh: true,
});
const text10 = typeof result.text === "string" ? result.text : "";
assert(
  text10.includes("TDN Database:"),
  "forceRefresh shows database info"
);

/**
 * TEST 11: Missing parameters error
 */
console.log("\n📋 TEST GROUP 11: Error Handling");
try {
  await handleValidateTdn({});
  assert(false, "Missing parameters throws error");
} catch (e) {
  assert(
    e instanceof Error && e.message.includes("code"),
    "Missing parameters error is clear"
  );
}

/**
 * TEST 12: Header and footer presence
 */
console.log("\n📋 TEST GROUP 12: Output Formatting");
result = await handleValidateTdn({
  function: "Min",
  language: "advpl",
});
const text12 = typeof result.text === "string" ? result.text : "";
assert(
  text12.includes("╔"),
  "Result includes header border"
);
assert(
  text12.includes("Resources:"),
  "Result includes footer with resources"
);

/**
 * TEST 13: Timestamp presence
 */
console.log("\n📋 TEST GROUP 13: Metadata");
result = await handleValidateTdn({
  function: "Max",
  language: "advpl",
});
const text13 = typeof result.text === "string" ? result.text : "";
assert(
  text13.includes("Timestamp:"),
  "Result includes timestamp"
);
assert(
  text13.includes("Language:"),
  "Result includes language info"
);

/**
 * TEST 14: Complex validation scenario
 */
console.log("\n📋 TEST GROUP 14: Complex Scenarios");
result = await handleValidateTdn({
  code: `
    Local aDB := GetArea()
    Local nResult := Sqrt(100)
    DbSeek('test')
    If !Eof()
      Local nLen := Len('string')
      Upper(nLen)
      RestArea(aDB)
    EndIf
  `,
  language: "advpl",
  detailed: true,
  filename: "complex.prw",
});
const text14 = typeof result.text === "string" ? result.text : "";
assert(
  text14.length > 100,
  "Complex code validation produces detailed output"
);

/**
 * TEST 15: Known functions validation
 */
console.log("\n📋 TEST GROUP 15: Known Functions");
const knownFunctions = ["DbSeek", "Upper", "Lower", "Len", "SubStr"];
for (const func of knownFunctions) {
  result = await handleValidateTdn({
    function: func,
    language: "advpl",
  });
  const txt = typeof result.text === "string" ? result.text : "";
  assert(
    txt.includes("✅"),
    `Known function '${func}' validates correctly`
  );
}

/**
 * TEST 16: Default parameters
 */
console.log("\n📋 TEST GROUP 16: Default Parameters");
result = await handleValidateTdn({
  function: "Abs",
  // language not provided - should default to "advpl"
});
const text16 = typeof result.text === "string" ? result.text : "";
assert(
  text16.includes("advpl"),
  "Language defaults to advpl"
);
assert(
  typeof result.text === "string",
  "Handler works with minimal parameters"
);

/**
 * TEST 17: Non-existent function handling
 */
console.log("\n📋 TEST GROUP 17: Non-existent Function");
result = await handleValidateTdn({
  function: "NonExistentFunc12345",
  language: "advpl",
});
const text17 = typeof result.text === "string" ? result.text : "";
assert(
  text17.includes("❌"),
  "Non-existent function shows error"
);

/**
 * TEST 18: Combined code and function validation
 */
console.log("\n📋 TEST GROUP 18: Combined Validation");
result = await handleValidateTdn({
  code: "Local x := Val('123')",
  function: "Val",
  language: "advpl",
});
const text18 = typeof result.text === "string" ? result.text : "";
assert(
  text18.includes("Function:"),
  "Combined mode validates function"
);
assert(
  text18.includes("Code Block"),
  "Combined mode validates code"
);

/**
 * Summary
 */
console.log("\n" + "═".repeat(60));
console.log(`\n✅ RESULTS: Phase 10 - MCP Validation\n`);
console.log(`  Total Tests:    ${testCount}`);
console.log(`  Passed:         ${passCount} ✅`);
console.log(`  Failed:         ${failCount} ❌`);
console.log(`  Pass Rate:      ${((passCount / testCount) * 100).toFixed(1)}%\n`);

if (failCount === 0) {
  console.log("🎉 ALL TESTS PASSED - Phase 10 Complete!\n");
  process.exit(0);
} else {
  console.log(`\n⚠️  ${failCount} test(s) failed. Review output above.\n`);
  process.exit(1);
}
