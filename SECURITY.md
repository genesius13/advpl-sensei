# Politica de Seguranca

## Escopo

Este plugin e composto exclusivamente por arquivos Markdown (`.md`), JSON (`.json`) e um script Bash (`session-start`). Ele nao executa codigo em servidores, nao armazena dados e nao faz conexoes de rede por conta propria. Toda a execucao acontece dentro do ambiente local do Claude Code.

## Reportando Vulnerabilidades

Se voce encontrar um problema de seguranca, por favor **nao abra uma issue publica**. Em vez disso:

1. Envie um email para o mantenedor do projeto descrevendo a vulnerabilidade
2. Inclua passos para reproduzir o problema
3. Aguarde confirmacao antes de divulgar publicamente

## O que reportar

- Scripts no hook `session-start` que possam executar comandos inesperados
- Instrucoes em skills/commands/agents que possam induzir comportamento inseguro
- Caminhos de arquivo ou comandos que possam expor dados sensiveis
- Qualquer conteudo que possa ser explorado via prompt injection

## Resposta

Nos comprometemos a:

- Confirmar o recebimento do report em ate 48 horas
- Avaliar e corrigir vulnerabilidades confirmadas com prioridade
- Creditar o reporter na correcao (se desejado)

## Versoes Suportadas

| Versao | Suportada |
|--------|-----------|
| 1.0.x  | Sim       |
