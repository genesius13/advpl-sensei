# 🎌 Advpl Sensei — The Protheus MCP Server

![Version](https://img.shields.io/badge/version-1.1.5-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-PRODUCTION%20READY-brightgreen?style=for-the-badge)
![Tests](https://img.shields.io/badge/tests-94%2F94%20(100%25)-brightgreen?style=for-the-badge)
![Protocol](https://img.shields.io/badge/protocol-MCP-orange?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-lightgrey?style=for-the-badge)

> **Eleve o desenvolvimento TOTVS Protheus a um novo patamar de excelência técnica.**

O **Advpl Sensei** é um servidor **Model Context Protocol (MCP)** de alto desempenho, projetado para injetar inteligência profunda sobre o ecossistema Protheus em assistentes de IA (GitHub Copilot, Cline, Roo Code). Ele resolve o maior problema das IAs genéricas: a criação de funções inexistentes ("alucinações") e o uso de padrões depreciados.

---

## 💎 Diferenciais Estratégicos

### 🛡️ Validação TDN em 5 Camadas (Anti-Hallucination)
Diferente de outros assistentes, o Sensei não "chuta" código. Ele valida cada chamada de função contra uma base de dados rigorosa:
1.  **SnippetsValidator**: 10 templates estruturais validados.
2.  **TdnFunctionValidator**: Base local de 73 funções essenciais verificadas.
3.  **FunctionRegistry**: Metadados detalhados de 78 funções reais (assinaturas, tipos e categorias).
4.  **TdnFunctionScraper**: Motor de busca em tempo real no portal TDN com cache inteligente de 24h.
5.  **MCP Tool Integration**: Interface direta para validação de blocos de código complexos.

### 🏛️ Arquitetura Orientada a Padrões (Clean Code)
O código gerado pelo Sensei não apenas funciona; ele segue as **24 Regras de Ouro** do Protheus:
- **Nomenclatura**: Notação húngara rigorosa (`cNome`, `nValor`, `oModel`).
- **Segurança**: Detecção proativa de funções restritas e injeção de SQL.
- **Modernização**: Migração assistida de código procedural (ADVPL) para orientado a objetos (TLPP).

---

## 🛠️ Ferramentas Disponíveis (Tools)

| Ferramenta | Função Principal | Destaque Técnico |
|:---|:---|:---|
| `advpl_validate_tdn` | Validação Rigorosa | Detecta funções fictícias (ex: `HttpServer`) e valida compatibilidade. |
| `advpl_generate` | Geração de Código | Cria MVC completo, REST APIs (ADVPL/TLPP), Jobs e Workflows. |
| `advpl_sx` | Consulta de Dicionário | Acesso estruturado às tabelas SX1 a SX9 e parâmetros MV_*. |
| `advpl_lint` | Revisão de Código | Analisa o código sob a ótica de performance e boas práticas. |
| `advpl_migrate` | Modernização | Converte fontes `.prw` para classes `.tlpp` com namespaces. |
| `advpl_snippets` | Produtividade | Gera e injeta snippets validados diretamente no VS Code. |

---

## 📚 Biblioteca de Conhecimento (Resources)

O Sensei expõe uma vasta documentação técnica que a IA consulta em milissegundos:
- **Framework MVC**: Padrões para `ModelDef`, `ViewDef` e `MenuDef`.
- **Rest API**: Implementações usando `WSRESTFUL` ou classes TLPP modernas.
- **Pontos de Entrada**: Guia de implementação para os principais pontos do ERP.
- **Embedded SQL**: Melhores práticas para consultas performáticas em TopConn.

---

## 🚀 Instalação e Uso (Zero Config)

Você não precisa clonar este repositório para usar o Sensei. Adicione-o ao seu cliente MCP (Cline, Roo Code ou Copilot) com um único comando:

### Configuração
No seu `mcp_settings.json`:

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

### Exemplo de Prompt
> "Sensei, gere um cadastro MVC para a tabela customizada 'ZZ1', incluindo validações de campo e um gatilho de busca na SA1, seguindo a notação húngara."

---

## ✅ Maturidade do Projeto

| Fase | Entrega | Status |
|:---:|:---|:---:|
| **1-4** | Core Engine, SX Tool & Boilerplates | ✅ Concluído |
| **5-7** | Registry Analyzer & TDN Coverage | ✅ Concluído |
| **8-9** | Snippets Validation & Auto-Scraper | ✅ Concluído |
| **10** | **MCP Full Integration (Production Ready)** | ✅ Concluído |

---

## 📄 Licença

Este projeto é open-source sob a licença [MIT](LICENSE). Desenvolvido para a comunidade Protheus que busca o estado da arte em tecnologia.

---
**Advpl Sensei** — *Code with honor, build with precision.*
