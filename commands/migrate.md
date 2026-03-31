---
description: Migrate ADVPL procedural code to TLPP object-oriented code with classes, namespaces, and modern patterns
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent, Skill, WebSearch, WebFetch
argument-hint: "<file.prw> [--output file.tlpp] [--dry-run]"
---

# /advpl-specialist:migrate

**IMPORTANT:** Always respond in the same language the user is writing in. If the user writes in Portuguese, respond in Portuguese. If in English, respond in English. Adapt all explanations and suggestions to the user's language. Code comments may remain in English or match the user's language.

Convert ADVPL procedural code to TLPP with object-oriented patterns.

## Usage

```bash
/advpl-specialist:migrate <file.prw> [options]
```

## Options

| Flag | Description | Default |
|------|------------|---------|
| `--output` | Output .tlpp file path | Same name with .tlpp extension |
| `--dry-run` | Show migration plan without generating files | false |
| `--keep-original` | Keep the original .prw file | true |
| `--wrapper` | Generate backward compatibility wrapper | true |
| `--namespace` | Override namespace | Auto-detect from module |

## Process

**MANDATORY: Always enter planning mode before migrating code. Never skip planning.**

### Analysis Phase
1. **Read source file** - Read the .prw file completely
2. **Analyze structure** - Identify functions, dependencies, shared variables
3. **Search for callers** - Grep codebase for `u_FunctionName` references

### Planning Phase (REQUIRED)
4. **Load skill** - Invoke `advpl-to-tlpp-migration` skill for rules and checklist
5. **Enter plan mode** - Use `EnterPlanMode` to create a structured migration plan
6. **Design class structure** - Map functions to classes and methods
7. **Present plan** - Show the user a detailed migration plan including:
   - Source file analysis (functions found, dependencies, shared variables)
   - External callers that will be impacted
   - Target class structure (class name, namespace, properties, methods)
   - Mapping: which function becomes which method (public/private)
   - Private/Public variables to convert to class properties
   - Includes to update (TOTVS.CH -> tlpp-core.th, etc.)
   - Whether a backward compatibility wrapper is needed
   - Any risks or breaking changes
8. **Wait for approval** - The user must approve the plan before any code is written. If the user requests changes, revise the plan.
9. **If --dry-run** - Stop here after showing the plan
10. **Exit plan mode** - Use `ExitPlanMode` after approval

### Implementation Phase (only after approval)
11. **Execute migration** - Generate .tlpp file(s) following the approved plan and `advpl-to-tlpp-migration` skill
12. **Generate wrapper** - Create backward compatibility .prw wrapper if --wrapper
13. **Run checklist** - Validate against migration-checklist.md
14. **Report** - Show summary of changes

## Examples

```bash
# Migrate a file (shows plan first, then generates)
/advpl-specialist:migrate src/FATA001.prw

# Preview migration without generating files
/advpl-specialist:migrate src/FATA001.prw --dry-run

# Specify output path and namespace
/advpl-specialist:migrate src/FATA001.prw --output src/tlpp/PedidoService.tlpp --namespace mycompany.faturamento

# Migrate without backward compatibility wrapper
/advpl-specialist:migrate src/FATA001.prw --wrapper false
```

## Output

- `.tlpp` file with migrated class-based code
- Optional `.prw` wrapper for backward compatibility
- Migration summary with what changed and why
