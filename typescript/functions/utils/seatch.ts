import { SearchClient, AzureKeyCredential } from "@azure/search-documents";

let AZURE_SEARCH_SERVICE_NAME = process.env.AZURE_SEARCH_SERVICE_NAME;
let AZURE_SEARCH_INDEX_NAME = process.env.AZURE_SEARCH_INDEX_NAME;
let AZURE_SEARCH_KEY = process.env.AZURE_SEARCH_KEY;
let client: SearchClient;

function initialize(
    service_name?: string,
    index_name?: string,
    key?: string,
) {
    service_name = service_name || AZURE_SEARCH_SERVICE_NAME;
    index_name = index_name || AZURE_SEARCH_INDEX_NAME;
    key = key || AZURE_SEARCH_KEY;

    client = new SearchClient(
        `https://${service_name}.search.windows.net/`,
        index_name,
        new AzureKeyCredential(key),
    );
}

// 検索クエリを実行して結果を返す
async function searchDocuments(search_text: string): Promise<any[]> {
    let results = await client.search(search_text);
    return results;
}