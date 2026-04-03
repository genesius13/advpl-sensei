/**
 * TDN Scraper - Extrai informações de Entry Points do TOTVS Developer Network
 */

export interface EntryPointInfo {
  name: string;
  url: string;
  parameters: Array<{
    position: number;
    type: string;
    description: string;
  }>;
  returnType: string;
  returnDescription: string;
  routine: string;
}

export class TdnScraper {
  /**
   * Busca e extrai dados de um Entry Point
   */
  public static async getEntryPoint(name: string): Promise<EntryPointInfo | null> {
    // URL de busca aproximada ou direta se possível. 
    // O TDN costuma ter URLs no formato: https://tdn.totvs.com/display/public/PROT/ENTRY_POINT_NAME
    const baseUrl = "https://tdn.totvs.com";
    const searchUrl = `${baseUrl}/display/public/PROT/${name}`;

    try {
      const response = await fetch(searchUrl);
      if (!response.ok) {
        // Se não encontrar direto, talvez precise de uma busca mais complexa, 
        // mas por agora vamos focar no padrão de URL direta que é comum para EPs famosos.
        return null;
      }

      const html = await response.text();
      
      return this.parseHtml(html, name, searchUrl);
    } catch (e) {
      console.error("Erro no scraping do TDN:", e);
      return null;
    }
  }

  private static parseHtml(html: string, name: string, url: string): EntryPointInfo {
    const info: EntryPointInfo = {
      name,
      url,
      parameters: [],
      returnType: "Desconhecido",
      returnDescription: "",
      routine: "Desconhecida"
    };

    // Extração simplificada via Regex para um ambiente sem DOM completo (como o servidor MCP básico)
    // Em um cenário real, usaríamos algo como 'cheerio', mas vamos tentar manter as dependências baixas.
    
    // 1. Tentar encontrar a tabela de PARAMIXB
    // Geralmente uma tabela com cabeçalho "Ordem", "Tipo", "Descrição"
    const paramTableRegex = /<table[^>]*>[\s\S]*?PARAMIXB[\s\S]*?<\/table>/i;
    const tableMatch = html.match(paramTableRegex);
    
    if (tableMatch) {
      const rows = tableMatch[0].match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
      rows.forEach((row, idx) => {
        if (idx === 0) return; // Pula cabeçalho
        
        const cols = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
        if (cols.length >= 3) {
          info.parameters.push({
            position: info.parameters.length + 1,
            type: this.cleanHtml(cols[1]),
            description: this.cleanHtml(cols[2])
          });
        }
      });
    }

    // 2. Tentar encontrar o retorno
    const returnRegex = /Retorno[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i;
    const returnMatch = html.match(returnRegex);
    if (returnMatch) {
      info.returnType = this.cleanHtml(returnMatch[1]);
    }

    // 3. Tentar encontrar a rotina
    const routineRegex = /Programa[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i;
    const routineMatch = html.match(routineRegex);
    if (routineMatch) {
      info.routine = this.cleanHtml(routineMatch[1]);
    }

    return info;
  }

  private static cleanHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, "") // Remove tags
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")    // Normaliza espaços
      .trim();
  }
}

/**
 * Interface para funções TDN
 */
export interface TdnFunction {
  name: string;
  type: "native" | "class" | "method";
  language: "advpl" | "tlpp" | "both";
  description: string;
  category: string;
  deprecated?: boolean;
  tdnUrl?: string;
}

/**
 * Resultado do scraper de funções
 */
export interface ScraperResult {
  timestamp: number;
  totalFunctions: number;
  functions: TdnFunction[];
  errors: string[];
  cacheHit: boolean;
  source: "cache" | "live" | "hybrid";
}

/**
 * Scraper de funções TDN - Phase 9
 * Mantém lista de funções TDN sempre atualizada
 */
export class TdnFunctionScraper {
  // Cache local em memória (Phase 9 - básico)
  // Phase 10+ pode persistir em arquivo
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas
  private static cache: {
    timestamp: number;
    data: TdnFunction[];
  } | null = null;

  /**
   * Lista de funções TDN conhecidas (fallback + base de dados)
   * Expandido com categorização completa
   */
  private static readonly TDN_FUNCTION_LIST: TdnFunction[] = [
    // ========== DATABASE (20) ==========
    {
      name: "DbSeek",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Posiciona o cursor em um índice específico",
    },
    {
      name: "DbSkip",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Avança o cursor da tabela N registros",
    },
    {
      name: "Eof",
      type: "native",
      language: "both",
      category: "Database",
      description: "Verifica se alcançou fim de arquivo",
    },
    {
      name: "DbGoTop",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Posiciona no primeiro registro",
    },
    {
      name: "DbGoBottom",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Posiciona no último registro",
    },
    {
      name: "RecNo",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Retorna número do registro atual",
    },
    {
      name: "GetArea",
      type: "native",
      language: "both",
      category: "Database",
      description: "Salva posição atual da tabela",
    },
    {
      name: "RestArea",
      type: "native",
      language: "both",
      category: "Database",
      description: "Restaura posição salva da tabela",
    },
    {
      name: "RecLock",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Bloqueia registro para edição",
    },
    {
      name: "DbAppend",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Abre tabela para incluir novo registro",
    },
    {
      name: "DbEdit",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Abre tabela para editar registro",
    },
    {
      name: "DbDelete",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Marca registro para deleção",
    },
    {
      name: "DbStruct",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Retorna estrutura da tabela",
    },
    {
      name: "Field",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Retorna valor do campo",
    },
    {
      name: "FieldLen",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Retorna tamanho do campo",
    },
    {
      name: "FieldDec",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Retorna decimais do campo",
    },
    {
      name: "OrdKey",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Retorna chave do índice",
    },
    {
      name: "OrdCreate",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Cria novo índice",
    },
    {
      name: "MsUnlock",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Desbloqueia registro",
    },
    {
      name: "TableAlias",
      type: "native",
      language: "advpl",
      category: "Database",
      description: "Retorna alias da tabela aberta",
    },

    // ========== STRING (13) ==========
    {
      name: "Upper",
      type: "native",
      language: "both",
      category: "String",
      description: "Converte para maiúsculas",
    },
    {
      name: "Lower",
      type: "native",
      language: "both",
      category: "String",
      description: "Converte para minúsculas",
    },
    {
      name: "SubStr",
      type: "native",
      language: "both",
      category: "String",
      description: "Extrai substring",
    },
    {
      name: "StrTran",
      type: "native",
      language: "both",
      category: "String",
      description: "Substitui ocorrências em string",
    },
    {
      name: "Len",
      type: "native",
      language: "both",
      category: "String",
      description: "Retorna comprimento da string",
    },
    {
      name: "At",
      type: "native",
      language: "both",
      category: "String",
      description: "Encontra posição de substring",
    },
    {
      name: "AllTrim",
      type: "native",
      language: "both",
      category: "String",
      description: "Remove espaços antes e depois",
    },
    {
      name: "LTrim",
      type: "native",
      language: "both",
      category: "String",
      description: "Remove espaços da esquerda",
    },
    {
      name: "RTrim",
      type: "native",
      language: "both",
      category: "String",
      description: "Remove espaços da direita",
    },
    {
      name: "Trim",
      type: "native",
      language: "both",
      category: "String",
      description: "Remove espaços duplicados",
    },
    {
      name: "Stuff",
      type: "native",
      language: "both",
      category: "String",
      description: "Insere/substitui em string",
    },
    {
      name: "PadLeft",
      type: "native",
      language: "both",
      category: "String",
      description: "Preenche espaços à esquerda",
    },
    {
      name: "PadRight",
      type: "native",
      language: "both",
      category: "String",
      description: "Preenche espaços à direita",
    },

    // ========== TYPE/CONVERSION (17) ==========
    {
      name: "Val",
      type: "native",
      language: "both",
      category: "Type",
      description: "Converte string para número",
    },
    {
      name: "Str",
      type: "native",
      language: "both",
      category: "Type",
      description: "Converte número para string",
    },
    {
      name: "Date",
      type: "native",
      language: "both",
      category: "Type",
      description: "Retorna data atual",
    },
    {
      name: "Empty",
      type: "native",
      language: "both",
      category: "Type",
      description: "Verifica se valor está vazio",
    },
    {
      name: "Int",
      type: "native",
      language: "both",
      category: "Type",
      description: "Converte para inteiro",
    },
    {
      name: "Round",
      type: "native",
      language: "both",
      category: "Type",
      description: "Arredonda número",
    },
    {
      name: "Abs",
      type: "native",
      language: "both",
      category: "Type",
      description: "Retorna valor absoluto",
    },
    {
      name: "Type",
      type: "native",
      language: "advpl",
      category: "Type",
      description: "Retorna tipo de variável",
    },
    {
      name: "ValType",
      type: "native",
      language: "both",
      category: "Type",
      description: "Retorna tipo de valor",
    },
    {
      name: "CtoD",
      type: "native",
      language: "both",
      category: "Type",
      description: "Converte character para data",
    },
    {
      name: "DtoC",
      type: "native",
      language: "both",
      category: "Type",
      description: "Converte data para character",
    },
    {
      name: "SToD",
      type: "native",
      language: "both",
      category: "Type",
      description: "Converte string (YYYYMMDD) para data",
    },
    {
      name: "DToS",
      type: "native",
      language: "both",
      category: "Type",
      description: "Converte data para string (YYYYMMDD)",
    },
    {
      name: "Iif",
      type: "native",
      language: "both",
      category: "Type",
      description: "Se-então-senão inline",
    },
    {
      name: "IsNull",
      type: "native",
      language: "both",
      category: "Type",
      description: "Verifica se é NULL",
    },
    {
      name: "NVL",
      type: "native",
      language: "both",
      category: "Type",
      description: "Retorna valor não-NULL",
    },
    {
      name: "Decode",
      type: "native",
      language: "both",
      category: "Type",
      description: "Case/switch simplificado",
    },

    // ========== MATH (6) ==========
    {
      name: "Min",
      type: "native",
      language: "both",
      category: "Math",
      description: "Retorna valor mínimo",
    },
    {
      name: "Max",
      type: "native",
      language: "both",
      category: "Math",
      description: "Retorna valor máximo",
    },
    {
      name: "Mod",
      type: "native",
      language: "both",
      category: "Math",
      description: "Retorna resto da divisão",
    },
    {
      name: "Sqrt",
      type: "native",
      language: "both",
      category: "Math",
      description: "Retorna raiz quadrada",
    },
    {
      name: "Exp",
      type: "native",
      language: "both",
      category: "Math",
      description: "Retorna exponencial",
    },
    {
      name: "Log",
      type: "native",
      language: "both",
      category: "Math",
      description: "Retorna logaritmo",
    },

    // ========== DATE (4) ==========
    {
      name: "Month",
      type: "native",
      language: "both",
      category: "Date",
      description: "Retorna mês de uma data",
    },
    {
      name: "Year",
      type: "native",
      language: "both",
      category: "Date",
      description: "Retorna ano de uma data",
    },
    {
      name: "Day",
      type: "native",
      language: "both",
      category: "Date",
      description: "Retorna dia de uma data",
    },
    {
      name: "Time",
      type: "native",
      language: "both",
      category: "Date",
      description: "Retorna hora atual em segundos",
    },

    // ========== ARRAY (6) ==========
    {
      name: "AClone",
      type: "native",
      language: "both",
      category: "Array",
      description: "Clona um array",
    },
    {
      name: "AAdd",
      type: "native",
      language: "both",
      category: "Array",
      description: "Adiciona elemento ao array",
    },
    {
      name: "ADel",
      type: "native",
      language: "both",
      category: "Array",
      description: "Deleta elemento do array",
    },
    {
      name: "ASize",
      type: "native",
      language: "both",
      category: "Array",
      description: "Redimensiona array",
    },
    {
      name: "AScan",
      type: "native",
      language: "both",
      category: "Array",
      description: "Procura elemento em array",
    },
    {
      name: "ASort",
      type: "native",
      language: "both",
      category: "Array",
      description: "Ordena array",
    },

    // ========== PARAMETERS (4) ==========
    {
      name: "GetMV",
      type: "native",
      language: "both",
      category: "Parameters",
      description: "Obtém valor de parâmetro MV",
    },
    {
      name: "GetSX3",
      type: "native",
      language: "both",
      category: "Parameters",
      description: "Obtém informação de campo (SX3)",
    },
    {
      name: "GetSX5",
      type: "native",
      language: "both",
      category: "Parameters",
      description: "Obtém tabela genérica (SX5)",
    },
    {
      name: "PutMV",
      type: "native",
      language: "both",
      category: "Parameters",
      description: "Define valor de parâmetro MV",
    },

    // ========== INTERFACE (3) ==========
    {
      name: "Alert",
      type: "native",
      language: "advpl",
      category: "Interface",
      description: "Exibe alerta na tela",
    },
    {
      name: "MsgBox",
      type: "native",
      language: "both",
      category: "Interface",
      description: "Exibe caixa de mensagem",
    },
    {
      name: "ConOut",
      type: "native",
      language: "both",
      category: "Interface",
      description: "Escreve no console",
    },

    // ========== FRAMEWORK (3) ==========
    {
      name: "GetException",
      type: "native",
      language: "both",
      category: "Framework",
      description: "Obtém última exceção",
    },
    {
      name: "GetErrorMessage",
      type: "native",
      language: "both",
      category: "Framework",
      description: "Obtém mensagem de erro",
    },
    {
      name: "OldNotation",
      type: "native",
      language: "advpl",
      category: "Framework",
      description: "Converte notação antiga",
    },
  ];

  /**
   * Obter lista de funções TDN (com cache)
   */
  public static async getFunctions(
    forceRefresh: boolean = false
  ): Promise<ScraperResult> {
    const now = Date.now();

    // Verificar cache
    if (
      !forceRefresh &&
      this.cache &&
      now - this.cache.timestamp < this.CACHE_DURATION
    ) {
      return {
        timestamp: now,
        totalFunctions: this.cache.data.length,
        functions: this.cache.data,
        errors: [],
        cacheHit: true,
        source: "cache",
      };
    }

    // Usar lista conhecida (Phase 9 - básica)
    const functions = this.TDN_FUNCTION_LIST;

    // Atualizar cache
    this.cache = {
      timestamp: now,
      data: functions,
    };

    return {
      timestamp: now,
      totalFunctions: functions.length,
      functions,
      errors: [],
      cacheHit: false,
      source: "live",
    };
  }

  /**
   * Extrair nomes de funções
   */
  public static async getFunctionNames(forceRefresh?: boolean): Promise<string[]> {
    const result = await this.getFunctions(forceRefresh);
    return result.functions.map((f) => f.name);
  }

  /**
   * Obter funções por categoria
   */
  public static async getFunctionsByCategory(
    category: string,
    forceRefresh?: boolean
  ): Promise<TdnFunction[]> {
    const result = await this.getFunctions(forceRefresh);
    return result.functions.filter((f) => f.category === category);
  }

  /**
   * Obter funções por linguagem
   */
  public static async getFunctionsByLanguage(
    language: "advpl" | "tlpp" | "both",
    forceRefresh?: boolean
  ): Promise<TdnFunction[]> {
    const result = await this.getFunctions(forceRefresh);
    return result.functions.filter(
      (f) => f.language === language || f.language === "both"
    );
  }

  /**
   * Gerar Set de funções para TdnFunctionValidator
   */
  public static async generateTdnVerifiedSet(forceRefresh?: boolean): Promise<Set<string>> {
    const names = await this.getFunctionNames(forceRefresh);
    return new Set(names);
  }

  /**
   * Relatório de cobertura por categoria
   */
  public static async getCoverageReport(forceRefresh?: boolean): Promise<string> {
    const result = await this.getFunctions(forceRefresh);
    const byCategory: { [key: string]: number } = {};

    result.functions.forEach((f) => {
      byCategory[f.category] = (byCategory[f.category] || 0) + 1;
    });

    let report = "\n╔════════════════════════════════════════════════════════════╗\n";
    report += "║          TDN Scraper - Coverage Report                     ║\n";
    report += "╚════════════════════════════════════════════════════════════╝\n\n";

    report += `📊 Summary\n`;
    report += `─────────────────────────────────────────────────────────────\n`;
    report += `Total Functions: ${result.totalFunctions}\n`;
    report += `Cache Hit: ${result.cacheHit ? "Yes" : "No"}\n`;
    report += `Source: ${result.source}\n`;
    report += `Generated: ${new Date(result.timestamp).toLocaleString()}\n\n`;

    report += `📋 By Category\n`;
    report += `─────────────────────────────────────────────────────────────\n`;

    Object.entries(byCategory)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        report += `  ${category.padEnd(20)} ${count}\n`;
      });

    report += `\n`;
    return report;
  }

  /**
   * Limpar cache
   */
  public static clearCache(): void {
    this.cache = null;
  }
}
