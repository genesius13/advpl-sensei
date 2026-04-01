# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-04-01

### Added
- **Core MCP Server Implementation**: Refined `mcp-server/src/index.ts` to improve the `CallToolRequestSchema` handler, making it more informative about tool arguments and error handling during simulation.
- **Structured Command Definitions**: All command `.md` files in `mcp-server/commands/` now include structured `parameters` in their frontmatter, defining clear input schemas for each tool.

### Changed
- **Project Renamed**: The project is now officially named **Advpl Sensei**.
- **MCP Server Transition**: Shifted focus to implementing a **Model Context Protocol (MCP) Server** in `mcp-server/`, enabling broader integration with VS Code extensions (Cline, Roo Code, Continue).
- **Updated Tool Documentation**: Command definition files (`.md`) now feature detailed `parameters` in their frontmatter, improving schema definition for the MCP server.

## [1.0.7] - 2026-03-30
### Added
- Initial release as a Claude Code plugin specializing in ADVPL and TLPP.
- Support for 10 specialized agents and 12 custom commands.
- Built-in reference for 190+ native functions and Protheus SX dictionary.
