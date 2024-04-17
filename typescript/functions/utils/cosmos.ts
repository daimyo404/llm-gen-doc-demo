// Cosmos DBの初期化
// TypeScriptでは、azure.cosmosライブラリが存在しないため、適切なライブラリや手段を用いてCosmos DBとの接続を行う必要があります。
let cosmos_endpoint = process.env.COSMOS_ENDPOINT;
let cosmos_key = process.env.COSMOS_KEY;
let cosmos_database = process.env.COSMOS_DATABASE;
let cosmos_container = process.env.COSMOS_CONTAINER;

// Cosmos DBからデータを取得する
async function getDataFromCosmosDB(query: string): Promise<any[]> {
    let client = __getCosmosClient(cosmos_endpoint, cosmos_key);
    let database = __getDatabase(client, cosmos_database);
    let container = __getContainer(database, cosmos_container);
    let queryIterator = __getItemQueryIterator(container, query);
    let items = await __getItems(queryIterator);
    return items;
}