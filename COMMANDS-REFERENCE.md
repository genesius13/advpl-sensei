# 🔧 Comandos Úteis - Advpl Sensei v1.1.5

## Compilação & Build

```bash
# Build TypeScript
npm run build

# Build com watch (desenvolvimento)
npm run dev

# Iniciar servidor MCP (produção)
npm start
```

## Testes

```bash
# Executar testes de uma fase específica
npm run test:phase5    # Phase 5: Registry
npm run test:phase6    # Phase 6: TDN Validator
npm run test:phase8    # Phase 8: Snippets Validation
npm run test:phase9    # Phase 9: Automatic Scraper
npm run test:phase10   # Phase 10: MCP Command

# Executar todos os testes
npm run test:phase5 && npm run test:phase6 && npm run test:phase8 && npm run test:phase9 && npm run test:phase10

# Verificar qualidade do registry
npm run check:registry
```

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Limpar cache
rm -rf dist node_modules
npm install
npm run build
```

## Publicação NPM

```bash
# Verificar autenticação
npm whoami

# Fazer login
npm login

# OPÇÃO 1 - Script automático (recomendado)
bash publish-to-npm.sh

# OPÇÃO 2 - Manual
cd mcp-server
npm publish --access public

# Verificar publicação
npm view @netoalmanca/advpl-sensei
npm info @netoalmanca/advpl-sensei@1.1.5
```

## Git & Releases

```bash
# Criar tag para release
git tag -a v1.1.5 -m "Release v1.1.5 - 10 Phases Complete"
git push origin v1.1.5

# Ver tags
git tag -l
```

## Documentação

```bash
# Ver estrutura de fases
cat IMPLEMENTATION-PHASES-COMPLETE.md

# Ver changelog
cat CHANGELOG.md

# Ver instruções de publicação
cat QUICK-PUBLISH.md
cat NPM-PUBLICATION-GUIDE.md
```

## Navegação

```bash
# Navegar para source
cd mcp-server/src

# Ver testes
cd mcp-server/src/__tests__

# Ver skills
ls mcp-server/skills/*/

# Ver agents
ls mcp-server/agents/

# Ver commands
ls mcp-server/commands/
```

## Informações

```bash
# Verificar versão
node -e "console.log(require('./mcp-server/package.json').version)"

# Listar dependências
npm ls

# Verificar tamanho do dist
du -sh mcp-server/dist

# Contar linhas de código
find mcp-server/src -name "*.ts" | xargs wc -l | tail -1
```

## Troubleshooting

```bash
# Limpar cache npm
npm cache clean --force

# Reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar erros TypeScript
cd mcp-server
npm run build

# Ver histórico de build
npm run build 2>&1 | tail -20
```

## Checklist Para Publicação

```bash
# 1. Verificar autenticação
npm whoami

# 2. Build completo
cd mcp-server && npm run build

# 3. Testar tudo
npm run test:phase5 && npm run test:phase6 && npm run test:phase8 && npm run test:phase9 && npm run test:phase10

# 4. Verificar package.json
node -e "require('./package.json'); console.log('✅ Valid')"

# 5. Publicar
npm publish --access public

# 6. Verificar
npm view @netoalmanca/advpl-sensei@1.1.5
```

---

**Última atualização:** 3 Abril 2026

