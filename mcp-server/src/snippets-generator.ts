/**
 * Snippets Generator - Gera snippets VS Code baseado nas regras de ouro do Sensei
 * Fase 4 - SX Tool & Snippets
 * Phase 8 - Integração com TDN Validator para validar snippets
 */

import { SnippetsValidator, SnippetValidationReport } from "./snippets-validator.js";

export interface CodeSnippet {
  prefix: string;
  body: string[];
  description: string;
}

export interface SnippetsFile {
  [key: string]: CodeSnippet;
}

export class SnippetsGenerator {
  /**
   * Template para uma função ADVPL padrão
   */
  private static getAdvplFunctionSnippet(): CodeSnippet {
    return {
      prefix: "advpl_func",
      description: "Template de função ADVPL com estrutura de ouro",
      body: [
        "#Include \"TOTVS.CH\"",
        "#Include \"PROTHEUS.CH\"",
        "",
        "/*/{Protheus.doc} ${1:NomeFuncao}",
        "Descrição breve da função",
        "@type function",
        "@author ${2:Seu Nome}",
        "@since ${3:Data}",
        "@version 1.0",
        "/*/",
        "User Function ${1:NomeFuncao}()",
        "\t// Declarações de variáveis locais",
        "\tLocal nRetorno\t\t:= 0",
        "\tLocal cMsg\t\t\t:= \"\"",
        "\tLocal aArea\t\t\t:= GetArea()",
        "",
        "\tBegin Sequence",
        "\t\t// Lógica da função aqui",
        "\t\t",
        "\tExcept",
        "\t\tcMsg := \"Erro em NomeFuncao: \" + AllTrim(OldNotation(GetErrorMessage(GetException())))",
        "\t\tConOut(cMsg)",
        "\t\tnRetorno := 0",
        "",
        "\tEnd Sequence",
        "",
        "\tRestArea(aArea)",
        "Return nRetorno"
      ]
    };
  }

  /**
   * Template para função retornando array
   */
  private static getAdvplArrayFunctionSnippet(): CodeSnippet {
    return {
      prefix: "advpl_func_array",
      description: "Template de função que retorna array",
      body: [
        "#Include \"TOTVS.CH\"",
        "",
        "/*/{Protheus.doc} ${1:NomeFuncao}",
        "Retorna array com ${2:descrição}",
        "@type function",
        "@author ${3:Seu Nome}",
        "/*/",
        "User Function ${1:NomeFuncao}()",
        "\tLocal aRetorno\t:= {}",
        "\tLocal cMsg\t\t:= \"\"",
        "",
        "\tBegin Sequence",
        "\t\taRetorno := {",
        "\t\t\t{ \"col1\", \"col2\" }",
        "\t\t}",
        "\t\t",
        "\tExcept",
        "\t\tcMsg := \"Erro em ${1:NomeFuncao}: \" + AllTrim(OldNotation(GetErrorMessage(GetException())))",
        "\t\tConOut(cMsg)",
        "",
        "\tEnd Sequence",
        "",
        "Return aRetorno"
      ]
    };
  }

  /**
   * Template para classe TLPP
   */
  private static getTlppClassSnippet(): CodeSnippet {
    return {
      prefix: "tlpp_class",
      description: "Template de classe TLPP com estrutura de ouro",
      body: [
        "#Include \"TOTVS.CH\"",
        "#Include \"PROTHEUS.CH\"",
        "",
        "Namespace ${1:NomeNamespace}",
        "",
        "/*/{Protheus.doc} ${2:NomeClasse}",
        "Descrição da classe",
        "@type class",
        "@author ${3:Seu Nome}",
        "@since ${4:Data}",
        "@version 1.0",
        "/*/",
        "Class ${2:NomeClasse}",
        "\tData cPropriedade\t:= \"\"",
        "\tData nValor\t\t:= 0",
        "",
        "\t/*/{Protheus.doc} New",
        "\tConstrutor da classe",
        "\t@type method",
        "\t/*/",
        "\tMethod New() Constructor",
        "\t\t::cPropriedade := \"\"",
        "\t\t::nValor := 0",
        "\tReturn Self",
        "",
        "\t/*/{Protheus.doc} Execute",
        "\tExecuta a lógica principal",
        "\t@type method",
        "\t/*/",
        "\tMethod Execute() As Logical",
        "\t\tLocal lRetorno\t:= .T.",
        "\t\tLocal cMsg\t\t:= \"\"",
        "",
        "\t\tBegin Sequence",
        "\t\t\t// Implementação aqui",
        "\t\t\t",
        "\t\tExcept",
        "\t\t\tcMsg := \"Erro em Execute: \" + AllTrim(OldNotation(GetErrorMessage(GetException())))",
        "\t\t\tConOut(cMsg)",
        "\t\t\tlRetorno := .F.",
        "\t\t",
        "\t\tEnd Sequence",
        "",
        "\tReturn lRetorno",
        "",
        "EndClass",
        "",
        "End Namespace"
      ]
    };
  }

  /**
   * Template para Report com Pergunte()
   */
  private static getReportSnippet(): CodeSnippet {
    return {
      prefix: "advpl_report",
      description: "Template de report com parâmetros via Pergunte()",
      body: [
        "#Include \"TOTVS.CH\"",
        "",
        "/*/{Protheus.doc} ${1:NomeRelatorio}",
        "Relatório de ${2:descrição}",
        "@type function",
        "@author ${3:Seu Nome}",
        "/*/",
        "User Function ${1:NomeRelatorio}()",
        "\tLocal aArea\t\t:= GetArea()",
        "\tLocal cMsg\t\t:= \"\"",
        "",
        "\tBegin Sequence",
        "\t\t// Abre a pergunta para o usuário",
        "\t\tIf !Pergunte(\"${4:GRUPO}\", .T.)",
        "\t\t\tReturn",
        "\t\tEndIf",
        "",
        "\t\t// Após Pergunte(), os valores estão em mv_par01, mv_par02, etc.",
        "\t\tLocal cCodDe\t:= mv_par01",
        "\t\tLocal cCodAte\t:= mv_par02",
        "",
        "\t\t// Lógica do relatório aqui",
        "\t\tConOut(\"Processando de \" + cCodDe + \" até \" + cCodAte)",
        "\t\t",
        "\tExcept",
        "\t\tcMsg := \"Erro em ${1:NomeRelatorio}: \" + AllTrim(OldNotation(GetErrorMessage(GetException())))",
        "\t\tConOut(cMsg)",
        "",
        "\tEnd Sequence",
        "",
        "\tRestArea(aArea)",
        "Return"
      ]
    };
  }

  /**
   * Template para REST API
   */
  private static getRestApiSnippet(): CodeSnippet {
    return {
      prefix: "advpl_rest",
      description: "Template de REST API com estrutura de ouro",
      body: [
        "#Include \"TOTVS.CH\"",
        "#Include \"FWMVCDEF.CH\"",
        "",
        "/*/{Protheus.doc} ${1:NomeApi}",
        "API REST para ${2:descrição}",
        "@type function",
        "@author ${3:Seu Nome}",
        "@path /api/${4:endpoint}",
        "/*/",
        "User Function ${1:NomeApi}()",
        "\tLocal oApi\t\t:= JsonObject():New()",
        "\tLocal cMsg\t\t:= \"\"",
        "\tLocal nStatus\t:= 200",
        "",
        "\tBegin Sequence",
        "\t\t// Lógica da API",
        "\t\toApi[\"status\"]\t\t:= \"success\"",
        "\t\toApi[\"mensagem\"]\t:= \"Operação realizada com sucesso\"",
        "\t\toApi[\"dados\"]\t\t:= {}",
        "\t\t",
        "\tExcept",
        "\t\tcMsg := \"Erro em ${1:NomeApi}: \" + AllTrim(OldNotation(GetErrorMessage(GetException())))",
        "\t\toApi[\"status\"]\t\t:= \"error\"",
        "\t\toApi[\"mensagem\"]\t:= cMsg",
        "\t\tnStatus := 500",
        "",
        "\tEnd Sequence",
        "",
        "Return oApi"
      ]
    };
  }

  /**
   * Template para validação de campo
   */
  private static getValidationSnippet(): CodeSnippet {
    return {
      prefix: "advpl_validation",
      description: "Template de função de validação",
      body: [
        "/*/{Protheus.doc} ${1:ValCampo}",
        "Validação do campo ${2:nomeCampo}",
        "@type function",
        "@author ${3:Seu Nome}",
        "/*/",
        "User Function ${1:ValCampo}(${2:nomeCampo})",
        "\tLocal lRetorno\t:= .T.",
        "\tLocal cMsg\t\t:= \"\"",
        "",
        "\tBegin Sequence",
        "\t\t// Validar se o campo não está vazio",
        "\t\tIf Empty(${2:nomeCampo})",
        "\t\t\tlRetorno := .F.",
        "\t\t\tcMsg := \"${2:nomeCampo} não pode estar vazio\"",
        "\t\tElseIf Len(AllTrim(${2:nomeCampo})) < ${4:tamanhoMin}",
        "\t\t\tlRetorno := .F.",
        "\t\t\tcMsg := \"${2:nomeCampo} deve ter no mínimo ${4:tamanhoMin} caracteres\"",
        "\t\tEndIf",
        "",
        "\t\tIf !lRetorno",
        "\t\t\tAlert(cMsg)",
        "\t\tEndIf",
        "\t\t",
        "\tExcept",
        "\t\tcMsg := \"Erro em ${1:ValCampo}: \" + AllTrim(OldNotation(GetErrorMessage(GetException())))",
        "\t\tConOut(cMsg)",
        "\t\tlRetorno := .F.",
        "",
        "\tEnd Sequence",
        "",
        "Return lRetorno"
      ]
    };
  }

  /**
   * Template para MVC (Model-View-Controller)
   */
  private static getMvcSnippet(): CodeSnippet {
    return {
      prefix: "advpl_mvc",
      description: "Template de estrutura MVC",
      body: [
        "#Include \"TOTVS.CH\"",
        "#Include \"FWMVCDEF.CH\"",
        "",
        "/*/{Protheus.doc} ${1:NomeMvc}",
        "Manutenção de ${2:descrição}",
        "@type function",
        "@author ${3:Seu Nome}",
        "/*/",
        "User Function ${1:NomeMvc}()",
        "\tLocal oBrowse",
        "",
        "\toBrowse := FWMBrowse():New()",
        "\toBrowse:SetAlias(\"${4:ALIAS}\")",
        "\toBrowse:SetDescription(\"${2:descrição}\")",
        "\toBrowse:AddButton(\"Incluir\", oBrowse:bAdd)",
        "\toBrowse:AddButton(\"Alterar\", oBrowse:bEdit)",
        "\toBrowse:AddButton(\"Excluir\", oBrowse:bDel)",
        "\toBrowse:Activate()",
        "",
        "Return"
      ]
    };
  }

  /**
   * Template para Job
   */
  private static getJobSnippet(): CodeSnippet {
    return {
      prefix: "advpl_job",
      description: "Template de Job/Processamento",
      body: [
        "#Include \"TOTVS.CH\"",
        "",
        "/*/{Protheus.doc} ${1:NomeJob}",
        "Job para ${2:descrição}",
        "@type function",
        "@author ${3:Seu Nome}",
        "/*/",
        "User Function ${1:NomeJob}()",
        "\tLocal nRecno\t\t:= 0",
        "\tLocal cMsg\t\t:= \"\"",
        "\tLocal nProcessados\t:= 0",
        "",
        "\tBegin Sequence",
        "\t\tDbSelectArea(\"${4:ALIAS}\")",
        "\t\tDbSetOrder(1)",
        "\t\tDbGoTop()",
        "",
        "\t\tWhile !Eof()",
        "\t\t\tnRecno := RecNo()",
        "\t\t\t",
        "\t\t\t// Processar registro",
        "\t\t\tnProcessados++",
        "\t\t\t",
        "\t\t\tDbSkip()",
        "\t\tEndDo",
        "",
        "\t\tcMsg := \"Job concluído: \" + cValToChar(nProcessados) + \" registros processados\"",
        "\t\tConOut(cMsg)",
        "\t\t",
        "\tExcept",
        "\t\tcMsg := \"Erro em ${1:NomeJob}: \" + AllTrim(OldNotation(GetErrorMessage(GetException())))",
        "\t\tConOut(cMsg)",
        "",
        "\tEnd Sequence",
        "",
        "Return"
      ]
    };
  }

  /**
   * Template para Try-Catch modern
   */
  private static getTryCatchSnippet(): CodeSnippet {
    return {
      prefix: "advpl_try",
      description: "Template de Try-Catch/Begin Sequence",
      body: [
        "Begin Sequence",
        "\t// Código aqui",
        "\t${1:// sua implementação}",
        "",
        "Except",
        "\tLocal cMsg := \"Erro: \" + AllTrim(OldNotation(GetErrorMessage(GetException())))",
        "\tConOut(cMsg)",
        "",
        "End Sequence"
      ]
    };
  }

  /**
   * Template para DbSelectArea com segurança
   */
  private static getDbSelectSnippet(): CodeSnippet {
    return {
      prefix: "advpl_dbselect",
      description: "Template de acesso seguro a área de dados",
      body: [
        "Local aArea := GetArea()",
        "",
        "DbSelectArea(\"${1:ALIAS}\")",
        "DbSetOrder(${2:1})",
        "DbGoTop()",
        "",
        "While !Eof()",
        "\t// Processar registro",
        "\t${3:// sua implementação}",
        "\t",
        "\tDbSkip()",
        "EndDo",
        "",
        "RestArea(aArea)"
      ]
    };
  }

  /**
   * Gera o arquivo completo de snippets
   */
  public static generateSnippets(): SnippetsFile {
    return {
      advpl_function: this.getAdvplFunctionSnippet(),
      advpl_function_array: this.getAdvplArrayFunctionSnippet(),
      tlpp_class: this.getTlppClassSnippet(),
      advpl_report: this.getReportSnippet(),
      advpl_rest_api: this.getRestApiSnippet(),
      advpl_validation: this.getValidationSnippet(),
      advpl_mvc: this.getMvcSnippet(),
      advpl_job: this.getJobSnippet(),
      advpl_try_catch: this.getTryCatchSnippet(),
      advpl_db_select: this.getDbSelectSnippet()
    };
  }

  /**
   * Exporta snippets em formato JSON para VS Code
   */
  public static exportAsJson(): string {
    const snippets = this.generateSnippets();
    return JSON.stringify(snippets, null, 2);
  }

  /**
   * Gera arquivo de configuração para snippets do VS Code
   * Retorna conteúdo pronto para salvar em .vscode/advpl-sensei.code-snippets
   */
  public static generateVscodeSnippetsFile(): string {
    const snippets = this.generateSnippets();
    const fileContent: any = {};

    Object.entries(snippets).forEach(([key, snippet]) => {
      fileContent[snippet.prefix] = {
        prefix: snippet.prefix,
        body: snippet.body,
        description: snippet.description
      };
    });

    return JSON.stringify(fileContent, null, 2);
  }

  /**
   * Retorna resumo em Markdown dos snippets disponíveis
   */
  public static generateMarkdownReference(): string {
    const snippets = this.generateSnippets();
    let markdown = "# Snippets ADVPL/TLPP - Sensei\n\n";
    markdown += "Snippets VSCode para seguir as regras de ouro do Sensei.\n\n";

    Object.values(snippets).forEach((snippet) => {
      markdown += `## \`${snippet.prefix}\`\n`;
      markdown += `${snippet.description}\n\n`;
      markdown += "```advpl\n";
      markdown += snippet.body.join("\n") + "\n";
      markdown += "```\n\n";
    });

    return markdown;
  }

  /**
   * Valida todos os snippets contra TDN
   * Phase 8 - Garante que snippets usam apenas funções verificadas em TDN
   */
  public static validateAllSnippets(langFilter?: "advpl" | "tlpp"): SnippetValidationReport {
    const snippets = this.generateSnippets();
    const snippetMap = new Map<string, { body: string[]; language: "advpl" | "tlpp" }>();

    // Mapear snippets com linguagem
    Object.entries(snippets).forEach(([key, snippet]) => {
      // Detectar linguagem automaticamente
      const language =
        key.includes("tlpp") || snippet.prefix.includes("tlpp") ? "tlpp" : "advpl";

      // Filtrar por linguagem se solicitado
      if (langFilter && language !== langFilter) return;

      snippetMap.set(key, { body: snippet.body, language });
    });

    // Validar
    return SnippetsValidator.validateSnippets(snippetMap);
  }

  /**
   * Gera relatório de validação formatado
   */
  public static generateValidationReport(langFilter?: "advpl" | "tlpp"): string {
    const report = this.validateAllSnippets(langFilter);
    return SnippetsValidator.generateReport(report);
  }
}
