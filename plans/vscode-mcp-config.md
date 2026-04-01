# Configuração do Servidor MCP para VS Code

Para utilizar a inteligência ADVPL/TLPP no seu VS Code, adicione a seguinte configuração ao seu cliente MCP (Cline, Roo Code, etc.):

```json
{
  "mcpServers": {
    "advpl-sensei": {
      "command": "node",
      "args": ["/home/neto/Projetos_Dev/advpl-sensei/mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

## O que este servidor oferece:

### 🛠 Tools (Ferramentas)
- `advpl_generate`: Geração de código MVC, REST, Classes, etc.
- `advpl_review`: Revisão baseada em 24 regras de boas práticas.
- `advpl_diagnose`: Diagnóstico de erros Protheus.
- `advpl_docs`: Consulta de funções nativas e dicionário SX.
- `advpl_migrate`: Migração de ADVPL para TLPP.
- E mais...

### 📚 Resources (Conhecimento)
- Acesso completo às skills em `/skills/`.
- Referência de funções nativas.
- Dicionário de tabelas Protheus (SX1-SX9).

### 🎭 Prompts (Personas)
- Agentes especializados (Code Generator, Debugger, Migrator, etc.).
