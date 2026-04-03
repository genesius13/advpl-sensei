# Advpl Sensei - MCP Server

![Version](https://img.shields.io/badge/version-1.1.5-blue)
![Status](https://img.shields.io/badge/status-PRODUCTION%20READY-brightgreen)
![Tests](https://img.shields.io/badge/tests-94%2F94-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)
![MCP](https://img.shields.io/badge/protocol-MCP-orange)
![TOTVS](https://img.shields.io/badge/TOTVS-Protheus-orange)
![ADVPL](https://img.shields.io/badge/lang-ADVPL%20%7C%20TLPP-yellow)

Servidor **Model Context Protocol (MCP)** especializado no ecossistema **TOTVS Protheus** com validação completa de funções e geração inteligente de código. Adicione inteligência avançada em **ADVPL** e **TLPP** ao seu VS Code através de assistentes como GitHub Copilot, Cline ou Roo Code.

## 🚀 Funcionalidades

### 🛠 Ferramentas (Tools)
- **Geração de Código**: Funções, Classes TLPP, MVC, REST APIs, Pontos de Entrada, TReport, Jobs e Workflow.
- **Validação Inteligente** (NEW - Phase 10):
  - Valida código ADVPL/TLPP contra TDN (TOTVS Developer Network)
  - Detecta funções fictícias (ex: HttpServer)
  - Verifica compatibilidade ADVPL/TLPP
  - Suporta validação de funções individuais ou blocos de código
  - Cache inteligente de 24h (forceRefresh disponível)
  - **Tool:** `advpl_validate_tdn` com suporte multimodal

- **Revisão de Código**: Analise seu código com base em 24 regras de ouro (performance, segurança e boas práticas).
- **Diagnóstico**: Identifique causas de erros de compilação, runtime e locks.
- **Migração**: Converta código ADVPL procedural para TLPP orientado a objetos.
- **Scripts SX**: Gere scripts de dicionário (SX3, SIX, SX1, etc.) a partir de linguagem natural.
- **Consulta de Dicionário**: Acesso estruturado às tabelas SX (SA1, SF2, SB1, SE1, etc.).
- **Snippets de Código**: 10 templates VS Code prontos, validados contra TDN.

### 📊 Validação em 5 Camadas (NEW - Phases 5-10)
```
User Input → SnippetsValidator → TdnFunctionValidator → FunctionRegistry → TdnFunctionScraper → MCP API
```
- **Layer 1:** SnippetsValidator (10 templates VS Code, 100% TDN coverage)
- **Layer 2:** TdnFunctionValidator (73 funções TDN-verificadas)
- **Layer 3:** FunctionRegistry (78 funções reais TOTVS)
- **Layer 4:** TdnFunctionScraper (76 funções com cache 24h)
- **Layer 5:** MCP Command API (advpl_validate_tdn - full feature exposure)

### 📚 Conhecimento (Resources)
- **Referência Nativa**: Documentação de 190+ funções nativas Protheus.
- **Database TDN Verificado**: 76 funções catalogadas em 9 categorias (Database, Type, String, Math, Array, Date, Parameters, Interface, Framework).
- **Dicionário SX**: Estrutura completa das tabelas de sistema (SX1 a SX9) com queries estruturadas.
- **Funções Restritas**: Alertas em tempo real sobre o uso de funções proibidas pela TOTVS.
- **Padrões de Projeto**: Templates prontos para MVC, REST e integrações.
- **Validação de Snippet**: 10 templates VS Code validados contra TDN em tempo real.

### 🎭 Personas (Prompts)
- **Code Generator**: Especialista em criar código limpo e performático.
- **Debugger**: Mestre em encontrar problemas complexos em logs do AppServer.
- **Process Consultant**: Consultor funcional para os principais módulos ERP.

## 📦 Instalação em Qualquer Máquina (NPM/NPX)

Para usar o **Advpl Sensei** no VS Code de qualquer máquina, você não precisa clonar este repositório. Basta configurar seu cliente MCP (GitHub Copilot, Cline ou Roo Code) com:

### Configuração (Caminho Único)
Adicione esta configuração ao seu cliente MCP:

```json
{
  "mcpServers": {
    "advpl-sensei": {
      "command": "npx",
      "args": ["-y", "@netoalmanca/advpl-sensei"]
    }
  }
}
```

### Por que usar via NPX?
- **Sempre Atualizado**: O `npx` sempre busca a versão mais recente do Sensei.
- **Sem Dependências**: Não precisa baixar o código manualmente ou rodar `npm install`.
- **Fácil**: Funciona instantaneamente no Windows, Linux ou Mac (apenas requer o Node.js instalado).

## ✅ Status & Fases

**Projeto 100% Funcional** - Todas as 10 fases de implementação completas

| Fase | Recurso | Status | Testes |
|------|---------|--------|--------|
| 1 | Sensei Linter | ✅ Complete | 5/5 |
| 2 | Boilerplate Generator | ✅ Complete | 8/8 |
| 3 | TDN Entry Point Scraper | ✅ Complete | 6/6 |
| 4 | SX Tool & Snippets | ✅ Complete | 13/13 |
| 5 | Function Registry & Validation | ✅ Complete | 15/15 |
| 6 | TDN Function Validator | ✅ Complete | 15/15 |
| 7 | Coverage Expansion (73 functions) | ✅ Complete | — |
| 8 | Snippets Validation vs TDN | ✅ Complete | 18/18 |
| 9 | Automatic Scraper (76 functions, 24h cache) | ✅ Complete | 18/18 |
| 10 | MCP Command Integration | ✅ Complete | 43/43 |
| **TOTAL** | **94/94 Tests** | **✅ PRODUCTION READY** | **100% ✅** |

Para mais detalhes, veja [IMPLEMENTATION-PHASES-COMPLETE.md](IMPLEMENTATION-PHASES-COMPLETE.md)

## 💡 Exemplos de Uso

Agora que o **Advpl Sensei** está configurado no seu VS Code, você pode usá-lo com comandos simples no chat:

### Gerar Código
> "Crie uma User Function de faturamento para realizar o cálculo de impostos customizado, seguindo as melhores práticas do Sensei."

### Revisão de Código
> "Revise este arquivo `.prw` aberto e verifique se estou usando funções restritas da TOTVS ou se há problemas de performance."

### Dicionário e Referência
> "Consulte os recursos do Sensei e me diga quais são os campos da tabela SX3 e como configurar um gatilho na SX7."

### Migração ADVPL -> TLPP
> "Migre este código procedural ADVPL para uma classe TLPP organizada, usando namespaces e tipos de dados modernos."

## 🛠 Desenvolvimento

Para rodar em modo de desenvolvimento com hot-reload:
```bash
cd mcp-server
npm run dev
```

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
