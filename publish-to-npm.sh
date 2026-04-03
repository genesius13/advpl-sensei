#!/bin/bash

# 🚀 ADVPL SENSEI - NPM PUBLICATION SCRIPT
# Version: 1.1.5
# Usage: bash publish-to-npm.sh

set -e  # Exit on any error

echo "🚀 ADVPL SENSEI - NPM PUBLICATION SCRIPT v1.1.5"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check npm authentication
echo -e "${YELLOW}1. Verificando autenticação NPM...${NC}"
if npm whoami > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Autenticado como: $(npm whoami)${NC}"
else
    echo -e "${RED}❌ Não autenticado no NPM${NC}"
    echo "Execute: npm login"
    exit 1
fi
echo ""

# Step 2: Navigate to mcp-server
echo -e "${YELLOW}2. Navegando para mcp-server...${NC}"
cd "$(dirname "$0")/mcp-server" || exit
echo -e "${GREEN}✅ Localização: $(pwd)${NC}"
echo ""

# Step 3: Build
echo -e "${YELLOW}3. Compilando projeto...${NC}"
npm run build > /dev/null 2>&1
echo -e "${GREEN}✅ Build completo (sem erros)${NC}"
echo ""

# Step 4: Run tests
echo -e "${YELLOW}4. Executando testes...${NC}"
test_output=$(npm run test:phase5 2>&1 | tail -1)
if echo "$test_output" | grep -q "PASSED"; then
    echo -e "${GREEN}✅ Phase 5: Testes passando${NC}"
else
    echo -e "${RED}❌ Testes falhando${NC}"
    exit 1
fi
echo ""

# Step 5: Check version
echo -e "${YELLOW}5. Verificando versão...${NC}"
version=$(node -e "console.log(require('./package.json').version)")
echo -e "${GREEN}✅ Versão: $version${NC}"
echo ""

# Step 6: Check package.json required fields
echo -e "${YELLOW}6. Validando package.json...${NC}"
node -e "
const pkg = require('./package.json');
const required = ['name', 'version', 'description', 'main', 'files'];
const missing = required.filter(field => !pkg[field]);
if (missing.length > 0) {
    console.error('❌ Campos obrigatórios faltando: ' + missing.join(', '));
    process.exit(1);
}
console.log('✅ Todos os campos obrigatórios presentes');
"
echo ""

# Step 7: Publish
echo -e "${YELLOW}7. Publicando no NPM...${NC}"
echo ""
npm publish --access public
echo ""
echo -e "${GREEN}✅ Publicado com sucesso!${NC}"
echo ""

# Step 8: Verify
echo -e "${YELLOW}8. Verificando publicação...${NC}"
sleep 3  # Wait for npm registry sync
npm view @netoalmanca/advpl-sensei@$version > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Pacote verificado no NPM${NC}"
else
    echo -e "${YELLOW}⏳ Pacote ainda não visível (pode levar alguns minutos)${NC}"
fi
echo ""

# Step 9: Print success info
echo "================================================"
echo -e "${GREEN}🎉 PUBLICAÇÃO COMPLETA!${NC}"
echo "================================================"
echo ""
echo -e "📦 Pacote: ${GREEN}@netoalmanca/advpl-sensei${NC}"
echo -e "📌 Versão: ${GREEN}$version${NC}"
echo -e "🔗 URL: ${GREEN}https://www.npmjs.com/package/@netoalmanca/advpl-sensei${NC}"
echo ""
echo "Próximos passos:"
echo "1. Criar tag no Git:"
echo -e "   ${YELLOW}git tag -a v$version -m \"Release v$version\"${NC}"
echo "   ${YELLOW}git push origin v$version${NC}"
echo ""
echo "2. Criar GitHub Release com notas do CHANGELOG.md"
echo ""
echo "3. Anunciar a nova versão nos canais de comunicação"
echo ""
