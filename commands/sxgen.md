---
description: Generate Protheus SX data dictionary configuration scripts - SX3 fields, SIX indexes, SX1 questions, SX5 generic tables
allowed-tools: Read, Write, Glob, Grep, Bash, Agent, Skill
argument-hint: "[--type sx3|six|sx1|sx5] [--output path]"
---

**IMPORTANT:** Always respond in the same language the user is writing in. If the user writes in Portuguese, respond in Portuguese. If in English, respond in English.

# /advpl-specialist:sxgen

Generate Protheus data dictionary configuration scripts for SX tables.

## Usage

```bash
/advpl-specialist:sxgen [options]
```

Describe what you need in natural language after the command. The agent will parse your description and generate the configuration.

## Options

| Flag | Description | Default |
|------|------------|---------|
| `--type` | SX type: `sx3`, `six`, `sx1`, `sx5` | Auto-detect from description |
| `--output` | Save script to file path | Display in chat |

## Configuration Types

| Type | What it generates |
|------|-------------------|
| `sx3` | Field definitions (X3_ARQUIVO, X3_CAMPO, X3_TIPO, etc.) + SX7 triggers |
| `six` | Index definitions (INDICE, ORDEM, CHAVE, NICKNAME) |
| `sx1` | Report question definitions (X1_GRUPO, X1_PERGUNT, X1_TIPO) |
| `sx5` | Generic table entries (X5_TABELA, X5_CHAVE, X5_DESCRI) |

## Auto-Validations

The command automatically:
- Validates field types and sizes
- Generates pictures based on type (currency, date, code)
- Adds NaoVazio() for required fields
- Adds ExistCpo() for fields with F3 lookup
- Adds Pertence() for fields with combo options
- Generates SX7 triggers for F3 lookup fields
- Includes 3-language support (pt-BR, es, en)
- Ensures FILIAL is first in indexes

## Process

1. **Parse input** — Identify type and field specifications from natural language
2. **Load SX configuration skill** — Invoke `sx-configuration` skill
3. **Delegate to sx-configurator agent** — Pass parsed requirements
4. **Validate** — Check types, sizes, pictures, validations
5. **Generate script** — Formatted key-value blocks with all fields
6. **Deliver** — Display or save to output file

## Examples

```bash
# Generate SX3 field definitions from description
/advpl-specialist:sxgen --type sx3
Criar campos para tabela ZA1 - Ordens de Servico:
- ZA1_CODIGO: codigo da OS, char 6, obrigatorio
- ZA1_DESCRI: descricao do servico, char 40, obrigatorio
- ZA1_CLIENT: codigo do cliente, char 6, valida na SA1
- ZA1_STATUS: status, char 1, combo 1=Aberta;2=Em Andamento;3=Concluida;4=Cancelada

# Generate SIX index definitions
/advpl-specialist:sxgen --type six
Indices para ZA1:
- Indice 1: filial + codigo (unico)
- Indice 2: filial + cliente + data abertura

# Generate SX1 report questions
/advpl-specialist:sxgen --type sx1
Perguntas para relatorio de OS (grupo ZA1):
- Data abertura de/ate
- Status de/ate
- Cliente de/ate

# Generate SX5 generic table
/advpl-specialist:sxgen --type sx5
Tabela generica ZZ para tipos de servico:
01=Preventiva, 02=Corretiva, 03=Instalacao

# Save to file
/advpl-specialist:sxgen --type sx3 --output config/ZA1-campos.txt
```

## Output

Formatted configuration script with:
- Header with table name, date, and generator info
- Complete field definitions with all required attributes
- Auto-generated validations and pictures
- SX7 triggers (for SX3 with F3 lookups)
- Ready for manual input in Configurador or reference for APSDU/UPDDISTR import
