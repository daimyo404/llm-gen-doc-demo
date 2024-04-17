import { DefaultAzureCredential, TokenCredential, AzureKeyCredential } from "@azure/identity";
// TypeScriptでは、openaiライブラリが存在しないため、適切なライブラリや手段を用いてOpenAIとの接続を行う必要があります。
import { AzureOpenAI } from "openai";

let AZURE_OPENAI_ACCOUNT_NAME = process.env.AZURE_OPENAI_ACCOUNT_NAME;
let AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY;
let AZURE_OPENAI_CHAT_MODEL = process.env.AZURE_OPENAI_CHAT_MODEL;
let AZURE_OPENAI_EMBED_MODEL = process.env.AZURE_OPENAI_EMBED_MODEL;
let client: AzureOpenAI;

function initialize(
    account_name?: string,
    model_name?: string,
    key?: string,
    max_tokens: number = 4096,
    api_version: string = "2024-02-15-preview",
) {
    account_name = account_name || AZURE_OPENAI_ACCOUNT_NAME;
    model_name = model_name || AZURE_OPENAI_CHAT_MODEL;
    key = key || AZURE_OPENAI_KEY;

    if (key) {
        client = new AzureOpenAI(
            `https://${account_name}.openai.azure.com/`,
            key,
            api_version,
        );
    } else {
        let credential = new DefaultAzureCredential();
        // TypeScriptでは、get_bearer_token_provider関数が存在しないため、適切な手段を用いてトークンプロバイダを取得する必要があります。
        let token_provider = get_bearer_token_provider(credential, "https://cognitiveservices.azure.com/.default");
        client = new AzureOpenAI(
            `https://${account_name}.openai.azure.com/`,
            token_provider,
            api_version,
        );
    }
}