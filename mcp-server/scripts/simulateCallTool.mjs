import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (match) {
    try {
      const metadata = yaml.load(match[1]);
      return { metadata, body: match[2] };
    } catch (e) {
      console.error('Erro ao processar frontmatter:', e);
    }
  }
  return { metadata: {}, body: content };
}

async function simulate(commandName = 'generate') {
  const repoRoot = path.resolve(__dirname, '..');
  const commandFilePath = path.join(repoRoot, 'commands', `${commandName}.md`);
  let metadata = {};
  let commandBody = '';

  try {
    const content = await fs.readFile(commandFilePath, 'utf-8');
    const parsed = parseFrontmatter(content);
    metadata = parsed.metadata || {};
    commandBody = parsed.body || '';
  } catch (error) {
    const errMsg = (error && typeof error === 'object' && 'message' in error) ? error.message : String(error);
    console.log(`Erro ao carregar definição da ferramenta: ${errMsg}`);
    return;
  }

  const toolName = `advpl_${commandName}`;
  const toolDescription = metadata.description || `Ferramenta '${toolName}' sem descrição.`;
  const toolParametersSchema = metadata.parameters || {};
  const receivedArguments = {
    type: 'function',
    name: 'TesteSim',
    prompt: 'Gere uma função que retorne current date'
  };

  let responseText = `Chamada da Ferramenta: \`${toolName}\`\n`;
  responseText += `Descrição: ${toolDescription}\n\n`;
  responseText += `Argumentos Recebidos:\n`;

  const allParameterNames = Object.keys(toolParametersSchema);
  const requiredParams = allParameterNames.filter(paramName => toolParametersSchema[paramName].required !== false);
  const optionalParams = allParameterNames.filter(paramName => toolParametersSchema[paramName].required === false);

  if (requiredParams.length > 0) {
    responseText += `  * **Obrigatórios**:\n`;
    requiredParams.forEach(paramName => {
      const paramValue = receivedArguments[paramName] !== undefined ? `\`${receivedArguments[paramName]}\`` : '*(não fornecido)*';
      responseText += `    - \`${paramName}\`: ${paramValue}\n`;
    });
  }

  if (optionalParams.length > 0) {
    responseText += `  * **Opcionais**:\n`;
    optionalParams.forEach(paramName => {
      const paramValue = receivedArguments[paramName] !== undefined ? `\`${receivedArguments[paramName]}\`` : '*(não fornecido)*';
      responseText += `    - \`${paramName}\`: ${paramValue}\n`;
    });
  }

  const receivedArgNames = Object.keys(receivedArguments);
  const unknownParams = receivedArgNames.filter(argName => !allParameterNames.includes(argName));
  if (unknownParams.length > 0) {
      responseText += `  * **Desconhecidos**:\n`;
      unknownParams.forEach(paramName => {
          responseText += `    - \`${paramName}\`: \`${receivedArguments[paramName]}\`\n`;
      });
  }

  responseText += `\n--- SIMULAÇÃO DE EXECUÇÃO ---\nEsta é uma resposta simulada. A lógica real de execução para '${toolName}' não está implementada neste handler.`;

  console.log(responseText);
}

const arg = process.argv[2] || 'generate';
simulate(arg).catch(err => console.error('Simulação falhou:', err));
