# Advpl Sensei - MCP Server

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![MCP](https://img.shields.io/badge/protocol-MCP-orange)
![TOTVS](https://img.shields.io/badge/TOTVS-Protheus-orange)
![ADVPL](https://img.shields.io/badge/lang-ADVPL%20%7C%20TLPP-yellow)

Servidor **Model Context Protocol (MCP)** especializado no ecossistema **TOTVS Protheus**. Adicione inteligência avançada em **ADVPL** e **TLPP** ao seu VS Code através de assistentes como GitHub Copilot, Cline ou Roo Code.

## 🚀 Funcionalidades

### 🛠 Ferramentas (Tools)
- **Geração de Código**: Funções, Classes TLPP, MVC, REST APIs, Pontos de Entrada, TReport, Jobs e Workflow.
- **Revisão de Código**: Analise seu código com base em 24 regras de ouro (performance, segurança e boas práticas).
- **Diagnóstico**: Identifique causas de erros de compilação, runtime e locks.
- **Migração**: Converta código ADVPL procedural para TLPP orientado a objetos.
- **Scripts SX**: Gere scripts de dicionário (SX3, SIX, SX1, etc.) a partir de linguagem natural.

### 📚 Conhecimento (Resources)
- **Referência Nativa**: Documentação de 190+ funções nativas Protheus.
- **Dicionário SX**: Estrutura completa das tabelas de sistema (SX1 a SX9).
- **Funções Restritas**: Alertas em tempo real sobre o uso de funções proibidas pela TOTVS.
- **Padrões de Projeto**: Templates prontos para MVC, REST e integrações.

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
