import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import { CosmosClient } from "@azure/cosmos";
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";
import { DocumentIntelligenceClient } from "@azure/ai-documentintelligence";
import { AzureOpenAI } from "openai";
import { chunkContent } from "./chunking";
import { AzureLogHandler } from "opencensus-ext-azure";

let APP_INSIGHTS_CONNECTION_STRING = process.env.APP_INSIGHTS_CONNECTION_STRING;
let AZURE_COSMOS_DB_NAME = process.env.AZURE_COSMOS_DB_NAME;
let AZURE_COSMOS_DOCS_CONTAINER_NAME = process.env.AZURE_COSMOS_DOCS_CONTAINER_NAME;
let chunk_size = process.env.CHUNK_SIZE || 4096;

let blobContainer: BlobServiceClient;
let docsCosmosContainer: CosmosClient;
let chatClient: AzureOpenAI;
let embedClient: AzureOpenAI;
let searchClient: SearchClient;
let docReader: DocumentIntelligenceClient;

function initialize() {
    // Azure Application Insights でのログ出力を有効化する
    let logger = AzureLogHandler({connectionString: APP_INSIGHTS_CONNECTION_STRING});

    // Azure Blob Storage にアクセスするためのインスタンスを生成する
    blobContainer = new BlobServiceClient();

    // Azure Cosmos DB にアクセスするためのインスタンスを生成する
    docsCosmosContainer = new CosmosClient({endpoint: AZURE_COSMOS_DB_NAME, key: AZURE_COSMOS_DOCS_CONTAINER_NAME});

    // Azure OpenAI Service にアクセスするためのインスタンスを生成する
    chatClient = new AzureOpenAI();
    embedClient = new AzureOpenAI();

    // Azure AI Search にアクセスするためのインスタンスを生成する
    searchClient = new SearchClient();

    // Azure Document Intelligence でドキュメントを解析するためのインスタンスを生成する
    docReader = new DocumentIntelligenceClient();
}