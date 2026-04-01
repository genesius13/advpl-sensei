# Plano de Implementação: Servidor MCP para ADVPL/TLPP (Protheus)

## Objetivo
Transformar a inteligência do projeto `advpl-sensei` em um servidor **Model Context Protocol (MCP)** para o VS Code, permitindo que IAs (Cline, Roo Code, etc.) utilizem as ferramentas, conhecimentos e personas especializadas em Protheus.

## Arquitetura Proposta

### 1. Ferramentas (Tools)
Mapear os arquivos em `/commands` para funções executáveis no servidor MCP:
- `advpl_generate`: Gerar código (funções, classes, MVC, REST, etc.).
- `advpl_migrate`: Converter ADVPL procedural para TLPP OO.
- `advpl_diagnose`: Analisar erros de compilação e runtime.
- `advpl_docs`: Consultar funções nativas e dicionário SX.
- `advpl_review`: Revisar código com base nas 24 regras de ouro.
- `advpl_sxgen`: Gerar scripts de dicionário SX.

### 2. Recursos (Resources)
Disponibilizar o conteúdo de `/skills` como recursos estáticos ou dinâmicos:
- `mcp://advpl/reference/functions`: Funções nativas Protheus.
- `mcp://advpl/reference/sx`: Dicionário de tabelas SX (SX1-SX9).
- `mcp://advpl/reference/restricted`: Lista de funções restritas da TOTVS.
- `mcp://advpl/patterns/mvc`: Padrões de implementação MVC.

### 3. Prompts (Persona Agents)
Converter os arquivos em `/agents` em prompts pré-configurados:
- `code-generator`: Especialista em geração de código limpo.
- `debugger`: Especialista em análise de logs e erros.
- `process-consultant`: Especialista funcional em módulos ERP.

## Passos de Implementação

### Fase 1: Setup do Servidor (TypeScript/Node.js)
1. Inicializar o projeto Node.js com TypeScript em um novo diretório `/mcp-server`.
2. Instalar `@modelcontextprotocol/sdk`.
3. Configurar `tsconfig.json` e scripts no `package.json`.

### Fase 2: Mapeamento de Conhecimento (Resources)
1. Criar um leitor de Markdown que processe os arquivos em `/skills` e os sirva via MCP.
2. Garantir que as tabelas SX e referências nativas sejam facilmente indexáveis pela IA.

### Fase 3: Mapeamento de Tools (Ações)
1. Criar handlers para cada comando atual.
2. Implementar lógica de busca local (nas skills) e busca remota (TDN via Playwright).
3. Integrar a regra de "Planning Mode" obrigatório dentro das tools de geração.

### Fase 4: Integração e Testes
1. Criar um arquivo de configuração para o VS Code (`cline_mcp_settings.json` ou similar).
2. Testar a ativação do servidor e a execução de comandos complexos (ex: gerar um MVC completo).

## Verificação & Testes
- **Tool Check:** Verificar se `advpl_generate` respeita a regra de declarar variáveis `Local` no topo.
- **Resource Check:** Verificar se a IA consegue citar funções de `restricted-functions.md` como "proibidas".
- **Integration Check:** Validar o funcionamento dentro do **Cline** ou **Roo Code** no VS Code.

## Estrutura de Pastas Final
```text
advpl-sensei/
├── agents/             # Mantido (fonte de verdade para Prompts)
├── commands/           # Mantido (fonte de verdade para Tools)
├── skills/             # Mantido (fonte de verdade para Resources)
├── mcp-server/         # NOVO: Implementação do servidor
│   ├── src/
│   │   ├── index.ts    # Registro de tools/resources
│   │   ├── tools/      # Lógica das ferramentas
│   │   └── resources/  # Adaptadores para as skills
│   ├── package.json
│   └── tsconfig.json
└── documentation/      # Documentação do projeto
```
