# 📱 PUBLICAÇÃO COM OTP 2FA - INSTRUÇÕES

Você tem autenticação 2FA habilitada no npm. Para publicar com sucesso, execute:

## Opção 1: Publicar com OTP na Linha de Comando

```bash
cd /home/neto/Projetos_Dev/advpl-sensei/mcp-server

# Pegue seu código OTP do seu autenticador (Google Authenticator, Authy, etc)
# Substitua XXXXXX pelo código de 6 dígitos

npm publish --access public --otp=XXXXXX
```

**Exemplo:**
```bash
npm publish --access public --otp=123456
```

## Opção 2: Usar o Script (Manual)

```bash
cd /home/neto/Projetos_Dev/advpl-sensei/mcp-server
bash publish-to-npm.sh

# Quando pedir, forneça seu código OTP (6 dígitos)
```

---

## ❓ Precisa de Ajuda?

### "npm ERR! code EOTP"
Este erro significa que:
1. O OTP é inválido ou expirou (códigos 2FA duram 30 segundos)
2. Você digitou errado
3. Seu relógio do dispositivo não está sincronizado

**Solução:**
- Obtenha um novo código OTP do seu autenticador
- Tente novamente dentro de 30 segundos

### "You do not have permission"
Isso significa que você não é proprietário do package scope `@netoalmanca`

---

## ✅ Após Publicar com Sucesso

Você verá algo como:

```
npm notice Publishing to https://registry.npmjs.org/ with tag latest and public access
npm notice 📦  @netoalmanca/advpl-sensei@1.1.5
+ @netoalmanca/advpl-sensei@1.1.5
```

Depois:

1. Verifique no npm:
   ```bash
   npm view @netoalmanca/advpl-sensei@1.1.5
   ```

2. Crie GitHub Release:
   ```bash
   cd /home/neto/Projetos_Dev/advpl-sensei
   git tag -a v1.1.5 -m "Release v1.1.5 - 10 Phases Complete"
   git push origin v1.1.5
   ```

---

## 🔗 Links

- 📦 NPM Package: https://www.npmjs.com/package/@netoalmanca/advpl-sensei
- 📋 Documentação: [QUICK-PUBLISH.md](../QUICK-PUBLISH.md)

