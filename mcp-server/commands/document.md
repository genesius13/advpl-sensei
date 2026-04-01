---
description: Generate technical documentation from ADVPL/TLPP source code - Protheus.doc headers, routine docs, API docs
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent, Skill, WebSearch, WebFetch
parameters:
  target:
    type: string
    description: "Caminho do arquivo ou diretório para gerar documentação"
  type:
    type: string
    enum: ["header", "full", "api"]
    description: "Tipo de documentação: cabeçalho Protheus.doc, completo ou API"
    required: false
  output:
    type: string
    description: "Caminho do arquivo para salvar a documentação"
    required: false
---

**IMPORTANT:** Always respond in the same language the user is writing in. If the user writes in Portuguese, respond in Portuguese. If in English, respond in English.

# /advpl-sensei:document

Generate technical documentation from existing ADVPL/TLPP source code.

## Usage

```bash
/advpl-sensei:document <target> [options]
```

## Options

| Flag | Description | Default |
|------|------------|---------|
| `--type` | Documentation type: `header`, `full`, `api` | `full` |
| `--output` | Output file path for the documentation | Display in chat |

## Documentation Types

| Type | What it generates |
|------|-------------------|
| `header` | Protheus.doc comment block (can be inserted into source) |
| `full` | Complete routine doc: objective, tables, MV_*, entry points, flow, dependencies |
| `api` | REST API doc: endpoint, parameters, request/response, auth |

## Process

1. **Parse arguments** — Identify target file and options
2. **Load documentation skill** — Invoke `documentation-patterns` skill
3. **Delegate to doc-generator agent** — Pass target and type
4. **Analyze code** — Read source, detect tables, parameters, functions, dependencies
5. **Enrich** — Cross-reference with protheus-reference and protheus-business skills
6. **Generate** — Apply the correct template with extracted data
7. **Deliver** — Display or save to output file

## Examples

```bash
# Generate complete routine documentation
/advpl-sensei:document src/MATA461.prw

# Generate just the Protheus.doc header
/advpl-sensei:document src/MATA461.prw --type header

# Document a REST API endpoint
/advpl-sensei:document src/ApiClientes.tlpp --type api

# Save documentation to a file
/advpl-sensei:document src/MATA461.prw --output docs/MATA461.md

# Document all files in a directory
/advpl-sensei:document src/
```

## Output

- **header:** Protheus.doc comment block ready to insert
- **full:** Markdown document with objective, tables, MV_*, entry points, flow, dependencies, history
- **api:** Markdown document with endpoint, HTTP method, parameters, request/response examples, auth
