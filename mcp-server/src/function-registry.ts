/**
 * Function Registry - Database de funções TOTVS reais
 * Fase 5 - Function Registry & Validation
 * 
 * Este arquivo contém um registro de funções TOTVS que realmente existem
 * e são documentadas oficialmente. Usado para validar templates e identificar
 * funções fictícias que podem causar problemas de compilação.
 */

export interface FunctionDef {
  name: string;
  type: "native" | "framework" | "class" | "object";
  language: "advpl" | "tlpp" | "both";
  category: string;
  description: string;
  signature?: string;
  deprecated?: boolean;
  introduced?: string;
  module?: string[];
}

export interface FunctionRegistry {
  [key: string]: FunctionDef;
}

/**
 * Registry de funções TOTVS documentadas
 * Fonte: TOTVS Official Documentation + SonarQube Rules
 */
export const FUNCTION_REGISTRY: FunctionRegistry = {
  // ==========================================
  // FUNÇÕES NATIVAS CORE
  // ==========================================

  "User Function": {
    name: "User Function",
    type: "native",
    language: "advpl",
    category: "Declarations",
    description: "Declaração de função de usuário",
    signature: "User Function NomeFuncao(param1, param2, ...)",
    module: ["geral"],
  },

  "Static Function": {
    name: "Static Function",
    type: "native",
    language: "advpl",
    category: "Declarations",
    description: "Declaração de função estática (privada ao arquivo)",
    signature: "Static Function NomeFuncao(param1, param2, ...)",
    module: ["geral"],
  },

  GetArea: {
    name: "GetArea",
    type: "native",
    language: "advpl",
    category: "Database",
    description: "Obter estado atual das áreas de trabalho",
    signature: "Local aArea := GetArea()",
    module: ["geral"],
  },

  RestArea: {
    name: "RestArea",
    type: "native",
    language: "advpl",
    category: "Database",
    description: "Restaurar estado anterior das áreas de trabalho",
    signature: "RestArea(aArea)",
    module: ["geral"],
  },

  DbSelectArea: {
    name: "DbSelectArea",
    type: "native",
    language: "advpl",
    category: "Database",
    description: "Selecionar uma área de trabalho por alias",
    signature: "DbSelectArea('SA1')",
    module: ["geral"],
  },

  DbSetOrder: {
    name: "DbSetOrder",
    type: "native",
    language: "advpl",
    category: "Database",
    description: "Definir índice de ordenação",
    signature: "DbSetOrder(1)",
    module: ["geral"],
  },

  DbGoTop: {
    name: "DbGoTop",
    type: "native",
    language: "advpl",
    category: "Database",
    description: "Posicionar no primeiro registro",
    signature: "DbGoTop()",
    module: ["geral"],
  },

  DbSeek: {
    name: "DbSeek",
    type: "native",
    language: "advpl",
    category: "Database",
    description: "Buscar registro por chave de índice",
    signature: "DbSeek(cKey)",
    module: ["geral"],
  },

  DbSkip: {
    name: "DbSkip",
    type: "native",
    language: "advpl",
    category: "Database",
    description: "Mover para próximo registro",
    signature: "DbSkip(nReg)",
    module: ["geral"],
  },

  Eof: {
    name: "Eof",
    type: "native",
    language: "advpl",
    category: "Database",
    description: "Verificar fim do arquivo",
    signature: "If Eof() ...",
    module: ["geral"],
  },

  RecNo: {
    name: "RecNo",
    type: "native",
    language: "advpl",
    category: "Database",
    description: "Obter número do registro atual",
    signature: "Local nRec := RecNo()",
    module: ["geral"],
  },

  // ==========================================
  // FUNÇÕES DE STRING/TIPO
  // ==========================================

  AllTrim: {
    name: "AllTrim",
    type: "native",
    language: "advpl",
    category: "String",
    description: "Remover espaços à esquerda e direita",
    signature: "AllTrim(cText)",
    module: ["geral"],
  },

  Len: {
    name: "Len",
    type: "native",
    language: "advpl",
    category: "Type",
    description: "Retornar comprimento de string/array",
    signature: "Len(xValue)",
    module: ["geral"],
  },

  SubStr: {
    name: "SubStr",
    type: "native",
    language: "advpl",
    category: "String",
    description: "Extrair substring",
    signature: "SubStr(cText, nStart, nLen)",
    module: ["geral"],
  },

  Empty: {
    name: "Empty",
    type: "native",
    language: "advpl",
    category: "Type",
    description: "Verificar se valor é vazio",
    signature: "If Empty(xValue) ...",
    module: ["geral"],
  },

  ValToChar: {
    name: "ValToChar",
    type: "native",
    language: "advpl",
    category: "Type",
    description: "Converter valor para string",
    signature: "cResult := ValToChar(xValue)",
    module: ["geral"],
  },

  CValToChar: {
    name: "CValToChar",
    type: "native",
    language: "advpl",
    category: "Type",
    description: "Converter genérico para string",
    signature: "cResult := CValToChar(xValue)",
    module: ["geral"],
  },

  // ==========================================
  // FUNÇÕES DE INTERFACE
  // ==========================================

  Alert: {
    name: "Alert",
    type: "native",
    language: "advpl",
    category: "Interface",
    description: "Exibir caixa de alerta",
    signature: "Alert(cMessage)",
    module: ["geral"],
  },

  ConOut: {
    name: "ConOut",
    type: "native",
    language: "advpl",
    category: "Interface",
    description: "Enviar mensagem para console",
    signature: "ConOut(cMessage)",
    module: ["geral"],
  },

  Pergunte: {
    name: "Pergunte",
    type: "native",
    language: "advpl",
    category: "Interface",
    description: "Abrir diálogo de parâmetros via SX1",
    signature: "If Pergunte(cGroup, lContinue) ...",
    module: ["geral"],
  },

  // ==========================================
  // FUNÇÕES DE PARÂMETROS
  // ==========================================

  GetMV: {
    name: "GetMV",
    type: "native",
    language: "advpl",
    category: "Parameters",
    description: "Obter valor de parâmetro MV_*",
    signature: "xValue := GetMV(cParamName)",
    module: ["geral"],
  },

  SuperGetMV: {
    name: "SuperGetMV",
    type: "native",
    language: "advpl",
    category: "Parameters",
    description: "Obter valor de parâmetro com fallback",
    signature: "xValue := SuperGetMV(cParamName, lHelp, xDefault)",
    module: ["geral"],
  },

  GetNewPar: {
    name: "GetNewPar",
    type: "native",
    language: "advpl",
    category: "Parameters",
    description: "Obter parâmetro com valor padrão",
    signature: "xValue := GetNewPar(cParamName, xDefault)",
    module: ["geral"],
  },

  PutMV: {
    name: "PutMV",
    type: "native",
    language: "advpl",
    category: "Parameters",
    description: "Definir valor de parâmetro",
    signature: "PutMV(cParamName, xValue)",
    module: ["geral"],
  },

  // ==========================================
  // FUNÇÕES FRAMEWORK TOTVS (FW*)
  // ==========================================

  "FWMBrowse": {
    name: "FWMBrowse",
    type: "class",
    language: "advpl",
    category: "Framework",
    description: "Classe para criar browse (grid) de dados",
    signature: "Local oBrowse := FWMBrowse():New()",
    module: ["geral"],
  },

  "FWFormStruct": {
    name: "FWFormStruct",
    type: "framework",
    language: "advpl",
    category: "Framework",
    description: "Estrutura de formulário da SX3",
    signature: "Local oStruct := FWFormStruct(nMode, cAlias)",
    module: ["geral"],
  },

  "FWLoadModel": {
    name: "FWLoadModel",
    type: "framework",
    language: "advpl",
    category: "Framework",
    description: "Carregar modelo MVC pelo nome",
    signature: "Local oModel := FWLoadModel(cModelName)",
    module: ["geral"],
  },

  "FWGetSX5": {
    name: "FWGetSX5",
    type: "framework",
    language: "advpl",
    category: "Framework",
    description: "Obter tabelas genéricas SX5",
    signature: "Local aContent := FWGetSX5(cTableCode)",
    module: ["geral"],
  },

  "FwPutSX5": {
    name: "FwPutSX5",
    type: "framework",
    language: "advpl",
    category: "Framework",
    description: "Definir registro em SX5",
    signature: "FwPutSX5(cBranch, cTableCode, cKey, cDesc1, cDesc2, cDesc3)",
    module: ["geral"],
  },

  "FWSX1Util": {
    name: "FWSX1Util",
    type: "class",
    language: "advpl",
    category: "Framework",
    description: "Utilitário para SX1 (perguntas de relatório)",
    signature: "Local oSX1 := FWSX1Util():New()",
    module: ["geral"],
  },

  "FWSX2Util": {
    name: "FWSX2Util",
    type: "class",
    language: "advpl",
    category: "Framework",
    description: "Utilitário para SX2 (definição de tabelas)",
    signature: "Local oSX2 := FWSX2Util():New()",
    module: ["geral"],
  },

  "FWSX3Util": {
    name: "FWSX3Util",
    type: "class",
    language: "advpl",
    category: "Framework",
    description: "Utilitário para SX3 (dicionário de campos)",
    signature: "Local oSX3 := FWSX3Util():New()",
    module: ["geral"],
  },

  "FWSX6Util": {
    name: "FWSX6Util",
    type: "class",
    language: "advpl",
    category: "Framework",
    description: "Utilitário para SX6 (parâmetros)",
    signature: "Local oSX6 := FWSX6Util():New()",
    module: ["geral"],
  },

  // ==========================================
  // CLASSES MVC (ADVPL/TLPP)
  // ==========================================

  "MPFormModel": {
    name: "MPFormModel",
    type: "class",
    language: "advpl",
    category: "MVC",
    description: "Modelo de dados para MVC",
    signature: "Local oModel := MPFormModel():New(cModelName)",
    module: ["geral"],
  },

  "FWFormView": {
    name: "FWFormView",
    type: "class",
    language: "advpl",
    category: "MVC",
    description: "Visualização de formulário MVC",
    signature: "Local oView := FWFormView():New()",
    module: ["geral"],
  },

  // ==========================================
  // CLASSE JsonObject (TLPP ONLY - NAO ADVPL)
  // ==========================================

  "JsonObject": {
    name: "JsonObject",
    type: "class",
    language: "tlpp",
    category: "Framework",
    description: "Objeto JSON para TLPP (NÃO existe em ADVPL puro)",
    signature: "Local oJson := JsonObject():New()",
    module: ["geral"],
    deprecated: false,
  },

  // ==========================================
  // MANIPULAÇAO DE ERROS
  // ==========================================

  "GetException": {
    name: "GetException",
    type: "native",
    language: "advpl",
    category: "ErrorHandling",
    description: "Obter exceção atual em Begin Sequence",
    signature: "Local oError := GetException()",
    module: ["geral"],
  },

  "GetErrorMessage": {
    name: "GetErrorMessage",
    type: "framework",
    language: "advpl",
    category: "ErrorHandling",
    description: "Extrair mensagem de erro",
    signature: "Local cMsg := GetErrorMessage(oError)",
    module: ["geral"],
  },

  OldNotation: {
    name: "OldNotation",
    type: "framework",
    language: "advpl",
    category: "ErrorHandling",
    description: "Converter notação de erro (compatibilidade)",
    signature: "OldNotation(cErrorMsg)",
    module: ["geral"],
  },

  // ==========================================
  // FUNÇÕES ADICIONAIS DE STRING
  // ==========================================

  Upper: {
    name: "Upper",
    type: "native",
    language: "both",
    category: "String",
    description: "Converter string para maiúsculas",
    signature: "Local cResult := Upper('texto')",
    module: ["geral"],
  },

  Lower: {
    name: "Lower",
    type: "native",
    language: "both",
    category: "String",
    description: "Converter string para minúsculas",
    signature: "Local cResult := Lower('TEXTO')",
    module: ["geral"],
  },

  StrTran: {
    name: "StrTran",
    type: "native",
    language: "both",
    category: "String",
    description: "Substituir texto em string (Replace)",
    signature: "Local cResult := StrTran(cText, cFind, cReplace)",
    module: ["geral"],
  },

  // ==========================================
  // FUNÇÕES ADICIONAIS DE TIPO/CONVERSÃO
  // ==========================================

  Val: {
    name: "Val",
    type: "native",
    language: "both",
    category: "Type",
    description: "Converter string para número",
    signature: "Local nResult := Val('123.45')",
    module: ["geral"],
  },

  Str: {
    name: "Str",
    type: "native",
    language: "both",
    category: "Type",
    description: "Converter número para string formatado",
    signature: "Local cResult := Str(nValue, nLen, nDec)",
    module: ["geral"],
  },

  CtoD: {
    name: "CtoD",
    type: "native",
    language: "both",
    category: "Type",
    description: "Converter string para data (CTOD)",
    signature: "Local dData := CtoD('31/12/2025')",
    module: ["geral"],
  },

  DtoC: {
    name: "DtoC",
    type: "native",
    language: "both",
    category: "Type",
    description: "Converter data para string formatada",
    signature: "Local cData := DtoC(Date())",
    module: ["geral"],
  },

  DtoS: {
    name: "DtoS",
    type: "native",
    language: "both",
    category: "Type",
    description: "Converter data para string (YYYYMMDD)",
    signature: "Local cData := DtoS(Date())",
    module: ["geral"],
  },

  // ==========================================
  // FUNÇÕES ADICIONAIS DE BANCO DE DADOS
  // ==========================================

  RecLock: {
    name: "RecLock",
    type: "native",
    language: "advpl",
    category: "Database",
    description: "Bloquear registro para edição",
    signature: "If RecLock(cAlias, .F.) [...] EndIf",
    module: ["geral"],
  },

  MsUnLock: {
    name: "MsUnLock",
    type: "native",
    language: "advpl",
    category: "Database",
    description: "Desbloquear e liberar registro",
    signature: "MsUnLock(cAlias)",
    module: ["geral"],
  },

  // ==========================================
  // FUNÇÕES ADICIONAIS DE INTERFACE/UI
  // ==========================================

  MsgBox: {
    name: "MsgBox",
    type: "native",
    language: "advpl",
    category: "Interface",
    description: "Caixa de mensagem com opções (OK, Cancel, etc)",
    signature: "Local nOpc := MsgBox('Mensagem', 'Título', 'YESNO')",
    module: ["geral"],
  },

  FWMsgBox: {
    name: "FWMsgBox",
    type: "framework",
    language: "advpl",
    category: "Interface",
    description: "Caixa de mensagem framework TOTVS",
    signature: "Local nOpc := FWMsgBox('Título', 'Mensagem', 'YESNO')",
    module: ["geral"],
  },

  // ==========================================
  // FUNÇÕES ADICIONAIS DE PARÂMETROS
  // ==========================================

  GetSX3: {
    name: "GetSX3",
    type: "native",
    language: "advpl",
    category: "Parameters",
    description: "Obter properties de campo da tabela (SX3)",
    signature: "Local aFields := GetSX3()",
    module: ["geral"],
  },

  GetSX5: {
    name: "GetSX5",
    type: "native",
    language: "advpl",
    category: "Parameters",
    description: "Obter tabela genérica SX5",
    signature: "Local aData := GetSX5('XX')",
    module: ["geral"],
  },

  // ==========================================
  // FUNÇÕES ADICIONAIS DE CONTROLE/LÓGICA
  // ==========================================

  Iif: {
    name: "Iif",
    type: "native",
    language: "both",
    category: "Type",
    description: "If Inline (ternário) - retorna valor condicionado",
    signature: "Local xResult := Iif(lCondition, xTrueValue, xFalseValue)",
    module: ["geral"],
  },

  Eval: {
    name: "Eval",
    type: "native",
    language: "advpl",
    category: "Type",
    description: "Avaliar expressão como string",
    signature: "Local xResult := Eval(cExpression)",
    module: ["geral"],
  },

  // ==========================================
  // FUNÇÕES FRAMEWORK ADICIONAIS
  // ==========================================

  FWArrToXml: {
    name: "FWArrToXml",
    type: "framework",
    language: "advpl",
    category: "Framework",
    description: "Converter array para XML",
    signature: "Local cXml := FWArrToXml(aArray)",
    module: ["geral"],
  },

  FWXmlToArr: {
    name: "FWXmlToArr",
    type: "framework",
    language: "advpl",
    category: "Framework",
    description: "Converter XML para array",
    signature: "Local aArray := FWXmlToArr(cXml)",
    module: ["geral"],
  },

  // ==========================================
  // MAIS FUNÇÕES ÚTEIS
  // ==========================================

  Trim: {
    name: "Trim",
    type: "native",
    language: "advpl",
    category: "String",
    description: "Remover espaços à direita de string",
    signature: "Local cResult := Trim(cText)",
    module: ["geral"],
  },

  LTrim: {
    name: "LTrim",
    type: "native",
    language: "advpl",
    category: "String",
    description: "Remover espaços à esquerda de string",
    signature: "Local cResult := LTrim(cText)",
    module: ["geral"],
  },

  RTrim: {
    name: "RTrim",
    type: "native",
    language: "advpl",
    category: "String",
    description: "Remover espaços à direita de string",
    signature: "Local cResult := RTrim(cText)",
    module: ["geral"],
  },

  PadLeft: {
    name: "PadLeft",
    type: "native",
    language: "both",
    category: "String",
    description: "Completar string com caracteres à esquerda",
    signature: "Local cResult := PadLeft(cText, nLen, cChar := ' ')",
    module: ["geral"],
  },

  PadRight: {
    name: "PadRight",
    type: "native",
    language: "both",
    category: "String",
    description: "Completar string com caracteres à direita (padrão)",
    signature: "Local cResult := PadRight(cText, nLen, cChar := ' ')",
    module: ["geral"],
  },

  At: {
    name: "At",
    type: "native",
    language: "advpl",
    category: "String",
    description: "Encontrar posição de substring (case sensitive)",
    signature: "Local nPos := At(cFind, cText)",
    module: ["geral"],
  },

  Int: {
    name: "Int",
    type: "native",
    language: "both",
    category: "Type",
    description: "Converter número para inteiro (trunca decimal)",
    signature: "Local nInt := Int(123.7)",
    module: ["geral"],
  },

  Round: {
    name: "Round",
    type: "native",
    language: "both",
    category: "Type",
    description: "Arredondar número para decimais especificados",
    signature: "Local nRound := Round(123.456, 2)",
    module: ["geral"],
  },

  Abs: {
    name: "Abs",
    type: "native",
    language: "both",
    category: "Type",
    description: "Valor absoluto (remove sinal negativo)",
    signature: "Local nAbs := Abs(-10.5)",
    module: ["geral"],
  },

  // ==========================================
  // FUNÇÕES DE DATA/HORA
  // ==========================================

  Date: {
    name: "Date",
    type: "native",
    language: "advpl",
    category: "Type",
    description: "Obter data atual do sistema",
    signature: "Local dHoje := Date()",
    module: ["geral"],
  },

  Time: {
    name: "Time",
    type: "native",
    language: "advpl",
    category: "Type",
    description: "Obter hora atual em segundos desde meia-noite",
    signature: "Local nHora := Time()",
    module: ["geral"],
  },

  SToD: {
    name: "SToD",
    type: "native",
    language: "advpl",
    category: "Type",
    description: "Converter string YYYYMMDD para data",
    signature: "Local dData := SToD('20251231')",
    module: ["geral"],
  },

  // ==========================================
  // FUNÇÕES DE ARRAY/COLEÇÃO
  // ==========================================

  AClone: {
    name: "AClone",
    type: "native",
    language: "advpl",
    category: "Type",
    description: "Clonar/copiar array",
    signature: "Local aNewArray := AClone(aOldArray)",
    module: ["geral"],
  },

  AAdd: {
    name: "AAdd",
    type: "native",
    language: "advpl",
    category: "Type",
    description: "Adicionar elemento ao final de array",
    signature: "Local nPos := AAdd(aArray, xValue)",
    module: ["geral"],
  },

  ADel: {
    name: "ADel",
    type: "native",
    language: "advpl",
    category: "Type",
    description: "Deletar elemento de array",
    signature: "ADel(aArray, nPos)",
    module: ["geral"],
  },

  ASize: {
    name: "ASize",
    type: "native",
    language: "advpl",
    category: "Type",
    description: "Redimensionar array para novo tamanho",
    signature: "ASize(aArray, nNewLen)",
    module: ["geral"],
  },

  // ==========================================
  // MAIS FUNÇÕES DE BANCO DE DADOS
  // ==========================================

  DbGoBottom: {
    name: "DbGoBottom",
    type: "native",
    language: "advpl",
    category: "Database",
    description: "Posicionar no último registro",
    signature: "DbGoBottom()",
    module: ["geral"],
  },

  DbGoto: {
    name: "DbGoto",
    type: "native",
    language: "advpl",
    category: "Database",
    description: "Ir para posição/registro específico",
    signature: "DbGoto(nRecNo)",
    module: ["geral"],
  },

  OrdSetFocus: {
    name: "OrdSetFocus",
    type: "native",
    language: "advpl",
    category: "Database",
    description: "Definir ordem/índice ativo",
    signature: "OrdSetFocus(nIndex)",
    module: ["geral"],
  },

  DbCloseArea: {
    name: "DbCloseArea",
    type: "native",
    language: "advpl",
    category: "Database",
    description: "Fechar área de trabalho/alias",
    signature: "DbCloseArea()",
    module: ["geral"],
  },

  // ==========================================
  // FUNÇÕES PROBLEMÁTICAS (NÃO REAIS/FICTÍCIAS)
  // ==========================================

  "HttpServer": {
    name: "HttpServer",
    type: "native",
    language: "both",
    category: "REST",
    description: "❌ FICTÍCIA - Não existe em ADVPL/TLPP puro",
    deprecated: true,
    module: [],
  },
};

/**
 * Categorias de funções
 */
export const FUNCTION_CATEGORIES = {
  Declarations: "Declarações de função",
  Database: "Acesso a dados",
  String: "Manipulação de strings",
  Type: "Verificação/conversão de tipos",
  Interface: "Interface com usuário",
  Parameters: "Parâmetros do sistema",
  Framework: "Framework TOTVS (FW*)",
  MVC: "Model-View-Controller",
  REST: "REST APIs",
  ErrorHandling: "Tratamento de erros",
};

/**
 * Validador de funções
 */
export class FunctionValidator {
  /**
   * Verificar se uma função existe no registry
   */
  public static exists(functionName: string): boolean {
    return functionName in FUNCTION_REGISTRY;
  }

  /**
   * Obter definição de uma função
   */
  public static getDefinition(functionName: string): FunctionDef | null {
    return FUNCTION_REGISTRY[functionName] || null;
  }

  /**
   * Verificar se função é fictícia/deprecated
   */
  public static isFictitious(functionName: string): boolean {
    const def = this.getDefinition(functionName);
    if (!def) return false; // Não no registry = erro
    return def.deprecated === true || def.name.includes("❌") || def.name.includes("⚠️");
  }

  /**
   * Verificar compatibilidade com linguagem
   */
  public static isCompatibleWith(
    functionName: string,
    language: "advpl" | "tlpp"
  ): boolean {
    const def = this.getDefinition(functionName);
    if (!def) return false;
    return def.language === language || def.language === "both";
  }

  /**
   * Validar template completo
   */
  public static validateTemplate(code: string, language: "advpl" | "tlpp"): Array<{
    line: number;
    function: string;
    issue: string;
    severity: "error" | "warning";
  }> {
    const issues: any[] = [];
    const lines = code.split("\n");

    // Regex para detectar chamadas de função
    const functionCallRegex = /\b([A-Za-z_]\w*)\s*\(/g;

    lines.forEach((line, index) => {
      if (line.includes("//") || line.includes("/*")) return; // Skip comments

      let match;
      while ((match = functionCallRegex.exec(line)) !== null) {
        const funcName = match[1];

        if (!this.exists(funcName)) {
          // Função não no registry
          issues.push({
            line: index + 1,
            function: funcName,
            issue: `Function '${funcName}' not found in registry`,
            severity: "warning",
          });
        } else if (this.isFictitious(funcName)) {
          issues.push({
            line: index + 1,
            function: funcName,
            issue: `Function '${funcName}' is fictitious or deprecated`,
            severity: "error",
          });
        } else if (!this.isCompatibleWith(funcName, language)) {
          issues.push({
            line: index + 1,
            function: funcName,
            issue: `Function '${funcName}' not compatible with ${language}`,
            severity: "error",
          });
        }
      }
    });

    return issues;
  }

  /**
   * Listar todas as funções por categoria
   */
  public static getByCategory(category: string): FunctionDef[] {
    return Object.values(FUNCTION_REGISTRY).filter(
      (f) => f.category === category
    );
  }

  /**
   * Listar todas as funções para uma linguagem
   */
  public static getByLanguage(language: "advpl" | "tlpp"): FunctionDef[] {
    return Object.values(FUNCTION_REGISTRY).filter(
      (f) => f.language === language || f.language === "both"
    );
  }

  /**
   * Gerar relatório de compatibilidade
   */
  public static generateCompatibilityReport(
    code: string,
    language: "advpl" | "tlpp"
  ): string {
    const issues = this.validateTemplate(code, language);

    if (issues.length === 0) {
      return `✅ Template is compatible with ${language}`;
    }

    let report = `⚠️ Template has ${issues.length} issue(s) with ${language}:\n\n`;

    const errors = issues.filter((i) => i.severity === "error");
    const warnings = issues.filter((i) => i.severity === "warning");

    if (errors.length > 0) {
      report += `🔴 ERRORS (${errors.length}):\n`;
      errors.forEach((e) => {
        report += `  Line ${e.line}: ${e.function} - ${e.issue}\n`;
      });
    }

    if (warnings.length > 0) {
      report += `🟡 WARNINGS (${warnings.length}):\n`;
      warnings.forEach((w) => {
        report += `  Line ${w.line}: ${w.function} - ${w.issue}\n`;
      });
    }

    return report;
  }

  /**
   * Exportar registry como JSON
   */
  public static exportAsJson(): string {
    return JSON.stringify(FUNCTION_REGISTRY, null, 2);
  }
}
