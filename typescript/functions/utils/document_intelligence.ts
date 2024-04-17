import { DefaultAzureCredential, TokenCredential, AzureKeyCredential } from "@azure/identity";
import { DocumentIntelligenceClient } from "@azure/ai-documentintelligence";

let AZURE_DOC_INTELLIGENCE_NAME = process.env.AZURE_DOC_INTELLIGENCE_NAME;
let AZURE_DOC_INTELLIGENCE_KEY = process.env.AZURE_DOC_INTELLIGENCE_KEY;
let client: DocumentIntelligenceClient;

function initialize(
    account_name?: string,
    credential: TokenCredential = new DefaultAzureCredential(),
    key?: string,
) {
    account_name = account_name || AZURE_DOC_INTELLIGENCE_NAME;
    key = key || AZURE_DOC_INTELLIGENCE_KEY;
    if (key) {
        credential = new AzureKeyCredential(key);
    }
    client = new DocumentIntelligenceClient(
        `https://${account_name}.cognitiveservices.azure.com/`,
        credential,
    );
}

// ファイルを読み込んで Document Intelligence で解析してHTMLに変換して返す
async function readDocument(
    file_path: string,
    model: string = "prebuilt-layout",
    locale: string = "ja-JP",
    high_resolution: boolean = true,
    markdown: boolean = false,
    pages: string = null,
): Promise<string> {
    let result = await getOcrResult(file_path, model, locale, high_resolution, markdown, pages);
    return getContentFromOcrResult(result);
}