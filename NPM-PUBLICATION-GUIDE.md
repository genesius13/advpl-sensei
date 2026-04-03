# 📦 NPM Publication Guide - Advpl Sensei v1.1.5

## Pre-Publication Checklist

- ✅ All tests passing (94/94)
- ✅ Build successful (0 errors)
- ✅ Documentation complete (IMPLEMENTATION-PHASES-COMPLETE.md)
- ✅ CHANGELOG.md updated
- ✅ README.md updated with Phase 10 features
- ✅ .npmignore configured
- ✅ package.json fields verified

## Publication Steps

### 1. Verify NPM Authentication

```bash
npm whoami
```

If not authenticated, login:
```bash
npm login
# You'll be prompted for username, password, and OTP (if 2FA enabled)
```

### 2. Update Version in package.json (if needed)

Current version: **1.1.5** (already set)

To increment version:
```bash
npm version patch    # 1.1.5 → 1.1.6
npm version minor    # 1.1.5 → 1.2.0
npm version major    # 1.1.5 → 2.0.0
```

### 3. Final Build & Test

```bash
cd mcp-server
npm run build
npm run test:phase5 && npm run test:phase6 && npm run test:phase8 && npm run test:phase9 && npm run test:phase10
```

### 4. Publish to NPM

**Standard publication:**
```bash
npm publish
```

**Publication with access level (if scoped package):**
```bash
npm publish --access public
```

### 5. Verify Publication

```bash
# Check package on npm registry
npm view @netoalmanca/advpl-sensei

# Install locally to test
npm install @netoalmanca/advpl-sensei@latest
```

---

## 📋 Package Contents

What gets published:
- ✅ `dist/` - Compiled JavaScript and type definitions
- ✅ `agents/` - Agent documentation
- ✅ `commands/` - Command specifications
- ✅ `skills/` - Skill documentation
- ✅ `package.json` - Package metadata
- ✅ `README.md` - Main documentation

Excluded (via .npmignore):
- ❌ `src/` - TypeScript source (not needed)
- ❌ `.github/` - GitHub-specific
- ❌ `__tests__/` - Test files
- ❌ `node_modules/` - Dependencies

---

## 🔍 Package Metadata

**Name:** `@netoalmanca/advpl-sensei`  
**Version:** 1.1.5  
**Main Entry:** `dist/index.js`  
**Binary:** `advpl-sensei` (CLI command)  
**Repository:** https://github.com/genesius13/advpl-sensei.git  
**Type:** ES Module (ESM)

---

## 📊 Release Information

**Date:** April 3, 2026  
**Status:** Production Ready  
**Tests:** 94/94 passing  
**Build:** 0 errors, 0 warnings  

**Phases Included:**
- Phase 1: Linter (5 tests)
- Phase 2: Boilerplate Generator (8 tests)
- Phase 3: TDN Entry Point Scraper (6 tests)
- Phase 4: SX Tool & Snippets (13 tests)
- Phase 5: Registry & Validation (15 tests)
- Phase 6: TDN Validator (15 tests)
- Phase 8: Snippets Validation (18 tests)
- Phase 9: Automatic Scraper (18 tests)
- Phase 10: MCP Command Integration (43 tests)

---

## ⚠️ Important Notes

1. **Scoped Package:** This is a scoped package (`@netoalmanca/`). Ensure you own this scope.
2. **2FA:** If 2FA is enabled, npm will prompt for OTP during login.
3. **Access Level:** Remember to use `--access public` for scoped packages to be publicly accessible.
4. **Build Required:** Always rebuild before publishing: `npm run build`

---

## Post-Publication

### Create a GitHub Release

```bash
git tag v1.1.5
git push origin v1.1.5
```

Then create release on GitHub with:
- Release notes from CHANGELOG.md
- Link to npm package
- Link to documentation

### Update Downstream Projects

If there are projects depending on this package, update their installations:
```bash
npm update @netoalmanca/advpl-sensei
```

---

## Troubleshooting

**Error: "You do not have permission to publish"**
- Check npm login: `npm whoami`
- Verify scope access
- Check npm config: `npm config list`

**Error: "Package already exists"**
- This is expected (already published)
- Update version and retry

**Error: "Invalid OTP code"**
- Get new OTP from 2FA device
- Run `npm publish` again

---

## Next Steps After Publication

- [ ] Create GitHub Release with v1.1.5 tag
- [ ] Update GitHub releases page with CHANGELOG notes
- [ ] Create VS Code Extension (Phase 11)
- [ ] Add CI/CD GitHub Actions workflows
- [ ] Create performance dashboard
- [ ] Document contribution process

