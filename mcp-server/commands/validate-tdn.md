---
name: validate-tdn
description: Valida código ADVPL/TLPP ou funções individuais contra TDN (TOTVS Developer Network). Detecta funções fictícias, incompatibilidades de linguagem e cobertura TDN.
parameters:
  code:
    type: string
    required: false
    description: "Código ADVPL/TLPP a validar. Análise de funções usadas. Exemplo: 'Local x := Upper(\"test\")'"
  function:
    type: string
    required: false
    description: "Nome de função individual a validar. Exemplo: 'DbSeek'"
  language:
    type: string
    required: false
    description: "Linguagem do código. Valores: 'advpl', 'tlpp', 'both'. Padrão: 'advpl'"
    enum: ["advpl", "tlpp", "both"]
  filename:
    type: string
    required: false
    description: "Nome do arquivo para contexto. Exemplo: 'meu-programa.prw'. Padrão: 'code.prw'"
  detailed:
    type: boolean
    required: false
    description: "Se true, retorna detalhes completos incluindo sugestões. Padrão: false"
  forceRefresh:
    type: boolean
    required: false
    description: "Se true, busca dados TDN atualizados (ignora cache de 24h). Padrão: false"
---

# Validação TDN - Comando ADVPL Sensei

## Descrição

Valida código ADVPL/TLPP ou funções individuais contra o banco de dados de funções TDN (TOTVS Developer Network).

**Funcionalidades:**
- ✅ Validação de funções contra TDN
- ✅ Detecção automática de funções fictícias
- ✅ Verificação de compatibilidade ADVPL/TLPP
- ✅ Relatórios formatados com severity
- ✅ Cache inteligente de 24 horas
- ✅ Sugestões de correção

## Uso

### Validar Função Individual

```
advpl_validate_tdn function="DbSeek" language="advpl"
```

**Resultado:**
```
✅ Status: VALID
📝 Message: Function 'DbSeek' verified in TDN ✅
⚠️  Severity: info
```

### Validar Bloco de Código

```
advpl_validate_tdn code="Local x := Upper('hello')" language="advpl"
```

**Resultado:**
```
✅ No issues found - Code is valid!

🎯 TDN Coverage: 100%
📊 Functions Found: 0 (none to validate)
```

### Validar com Detalhes

```
advpl_validate_tdn code="Local y := FakeFunc()" language="advpl" detailed=true
```

**Resultado mostrará:**
- Informações completas sobre funções
- Sugestões de correção
- Links para documentação TDN

## Fases

- **Phase 6:** TdnFunctionValidator criado (base)
- **Phase 8:** Integração com snippets (validação de código)
- **Phase 9:** TdnFunctionScraper (76 funções catalogadas)
- **Phase 10:**  `advpl_validate_tdn` command (NEW)

## TDN Coverage

**76 funções verificadas em 9 categorias:**

| Categoria | Funções | Exemplos |
|-----------|---------|----------|
| Database | 20 | DbSeek, DbSkip, Eof, GetArea, RestArea |
| Type | 17 | Val, Str, Date, Empty, Int, Round |
| String | 13 | Upper, Lower, SubStr, StrTran, Len |
| Math | 6 | Min, Max, Mod, Sqrt, Exp, Log |
| Array | 6 | AClone, AAdd, ADel, ASize, AScan, ASort |
| Date | 4 | Month, Year, Day, Time |
| Parameters | 4 | GetMV, GetSX3, GetSX5, PutMV |
| Interface | 3 | Alert, MsgBox, ConOut |
| Framework | 3 | GetException, GetErrorMessage, OldNotation |

## Exemplos

### Exemplo 1: Detectar Ficção

```
advpl_validate_tdn code="oServer := HttpServer():New()"
```

Resultado: **❌ HttpServer is fictitious** (não existe em TDN)

### Exemplo 2: Compatibilidade ADVPL/TLPP

```
advpl_validate_tdn code="DbSeek(...)" language="tlpp"
```

Resultado: **⚠️ Incompatibility** (DbSeek é ADVPL-only)

### Exemplo 3: Validação Completa

```
advpl_validate_tdn code="
Local aArea := GetArea()
DbSeek(cCodigo)
If !Eof()
  RecLock()
  ...
  RestArea(aArea)
EndIf
" language="advpl" detailed=true
```

Resultado: **✅ All functions verified**

## Fluxo de Validação

```
1. Code Input
   ↓
2. Parse Functions
   ↓
3. Check against TdnFunctionValidator
   ↓
4. Verify with TdnFunctionScraper (76 functions)
   ↓
5. Check Registry (78 functions)
   ↓
6. Generate Report with Severity
```

## Relatórios

### Formato: Problema Encontrado

```
⚠️  Issues Found: 2

🔴 TDN Validation Issues:

  ERRORS (1):
    • HttpServer: Function 'HttpServer' is fictitious or deprecated

  WARNINGS (0):

🟡 Structure Validation Issues:
  • [ERROR] Missing return statement
```

### Formato: Sem Problemas

```
✅ No issues found - Code is valid!

🎯 TDN Coverage: 100%
📊 Functions Found: 0 (none to validate)
```

## Cache

- **Duração:** 24 horas
- **Bypass:** Use `forceRefresh=true`
- **Rastreamento:** Campo `"Cache Hit"` no relatório

## Próximas Melhorias

- [ ] Web scraper real de TDN
- [ ] Persistência de cache em arquivo
- [ ] Integração com IDE real
- [ ] Análise de padrões de uso

---

**Versão:** Phase 10 - MCP Integration  
**Status:** ✅ Production Ready
