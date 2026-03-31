#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Estrutura: dist/index.js -> mcp-server/
const MCP_ROOT = path.resolve(__dirname, "..");

const server = new Server(
  {
    name: "advpl-sensei",
    version: "1.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

/**
 * Resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const skillsDir = path.join(MCP_ROOT, "skills");
  const resources: any[] = [];

  async function walk(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.name.endsWith(".md")) {
          const relPath = path.relative(skillsDir, fullPath);
          resources.push({
            uri: `mcp://advpl/skills/${relPath}`,
            name: relPath,
            mimeType: "text/markdown",
          });
        }
      }
    } catch (e) {}
  }

  await walk(skillsDir);
  return { resources };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = new URL(request.params.uri);
  const relPath = uri.pathname.replace("/advpl/skills/", "");
  const filePath = path.join(MCP_ROOT, "skills", relPath);
  const text = await fs.readFile(filePath, "utf-8");
  return {
    contents: [{ uri: request.params.uri, mimeType: "text/markdown", text }],
  };
});

/**
 * Tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const commandsDir = path.join(MCP_ROOT, "commands");
  const tools: any[] = [];
  try {
    const files = await fs.readdir(commandsDir);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const name = file.replace(".md", "");
        const content = await fs.readFile(path.join(commandsDir, file), "utf-8");
        const descMatch = content.match(/description: (.*)/);
        tools.push({
          name: `advpl_${name}`,
          description: descMatch ? descMatch[1] : `Command ${name}`,
          inputSchema: {
            type: "object",
            properties: {
              prompt: { type: "string" },
              args: { type: "string" },
            },
            required: ["prompt"],
          },
        });
      }
    }
  } catch (e) {}
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const name = request.params.name.replace("advpl_", "");
  const filePath = path.join(MCP_ROOT, "commands", `${name}.md`);
  const instructions = await fs.readFile(filePath, "utf-8");
  const { prompt, args } = request.params.arguments as any;
  return {
    content: [{
      type: "text",
      text: `Tool: ${name}\nContext: ${instructions}\nInput: ${prompt}\nArgs: ${args || ""}`,
    }],
  };
});

/**
 * Prompts
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  const agentsDir = path.join(MCP_ROOT, "agents");
  const prompts: any[] = [];
  try {
    const files = await fs.readdir(agentsDir);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const name = file.replace(".md", "");
        prompts.push({
          name: `advpl_agent_${name}`,
          description: `Agent ${name}`,
          arguments: [{ name: "context", required: false }],
        });
      }
    }
  } catch (e) {}
  return { prompts };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const name = request.params.name.replace("advpl_agent_", "");
  const filePath = path.join(MCP_ROOT, "agents", `${name}.md`);
  const text = await fs.readFile(filePath, "utf-8");
  return {
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Role: ${name}\nRules: ${text}\nContext: ${request.params.arguments?.context || ""}`,
      },
    }],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(() => {});
