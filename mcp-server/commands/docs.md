---
description: Look up Protheus documentation - native functions, SX data dictionary, REST APIs, MV parameters, and framework reference
allowed-tools: Read, Glob, Grep, Bash, Agent, Skill, WebSearch, WebFetch
parameters:
  term:
    type: string
    description: "Termo de busca (função, tabela SX, parâmetro MV, API)"
  source:
    type: string
    enum: ["local", "tdn", "both"]
    description: "Fonte de busca: local, TDN (online) ou ambos"
    required: false
  type:
    type: string
    enum: ["function", "sx", "api", "param"]
    description: "Filtrar por tipo: função, dicionário SX, API ou parâmetro MV"
    required: false
---

# /advpl-sensei:docs

**IMPORTANT:** Always respond in the same language the user is writing in. If the user writes in Portuguese, respond in Portuguese. If in English, respond in English. Adapt all explanations and suggestions to the user's language.

Look up documentation for Protheus functions, APIs, tables, and parameters.

## Usage

```bash
/advpl-sensei:docs <term> [options]
```

## Options

| Flag | Description | Default |
|------|------------|---------|
| `--source` | Search source: `local`, `tdn`, or `both` | both (local first) |
| `--type` | Filter by type: `function`, `sx`, `api`, `param` | auto-detect |

## Process

1. **Parse query** - Extract search term and options
2. **Auto-detect type** - If not specified:
   - Starts with SX/SI -> sx
   - Starts with MV_ -> param
   - Contains API/REST -> api
   - Otherwise -> function
3. **Search local** - Check protheus-reference skill supporting files
4. **Search TDN** - If not found locally or --source tdn, search online
5. **Present results** - Syntax, parameters, return type, example

## Examples

```bash
# Look up a function
/advpl-sensei:docs FWExecView

# Look up a data dictionary table
/advpl-sensei:docs SX2 --type sx

# Look up a system parameter
/advpl-sensei:docs MV_ESTADO --type param

# Force TDN search
/advpl-sensei:docs MsExecAuto --source tdn

# Look up REST API pattern
/advpl-sensei:docs FWRest --type api
```

## Output

For functions:
- Syntax with parameter types
- Parameter table (name, type, description, required)
- Return type and description
- Code example
- Related functions

For SX tables:
- Table purpose
- Key fields with types and descriptions
- How to access programmatically

For MV parameters:
- Parameter purpose
- Default value
- How to read (GetMV/SuperGetMV)
- Module that uses it

For REST APIs:
- Endpoint pattern
- HTTP methods
- Request/response format
- Authentication requirements
