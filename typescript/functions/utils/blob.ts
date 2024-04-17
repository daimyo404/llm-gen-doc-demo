import { BlobServiceClient } from "@azure/storage-blob";

let blobClient: BlobServiceClient;
let containerClient: any;
let connection_string: string | undefined;
let credential: any;

function initialize(
    connection_string?: string,
    account_name?: string,
    container_name?: string,
    credentialParam?: any
) {
    container_name = container_name || process.env.AZURE_STORAGE_CONTAINER_NAME;
    connection_string = connection_string || process.env.AZURE_CONNECTION_STRING;
    if (connection_string) {
        blobClient = BlobServiceClient.fromConnectionString(connection_string);
    } else {
        credential = credentialParam;
        blobClient = new BlobServiceClient(
            `https://${account_name}.blob.core.windows.net`,
            credential
        );
    }
    containerClient = blobClient.getContainerClient(container_name);
    // TypeScriptでは、Azure SDKのメソッドがPromiseを返すため、async/awaitを使用します。
    // また、TypeScriptでは存在チェックを行うためのメソッドが提供されていません。
    // そのため、以下のコードはPythonのコードとは異なります。
    // this.containerClient.createIfNotExists()を使用してください。
}

async function upload_json(blob_name: string, data: object, overwrite: boolean = true): Promise<void> {
    // JSON.stringifyを使用してオブジェクトを文字列に変換します。
    await upload_string(blob_name, JSON.stringify(data, null, 2), overwrite);
}

async function upload_string(blob_name: string, s: string, overwrite: boolean = true): Promise<void> {
    // TypeScriptでは、Azure SDKのメソッドがPromiseを返すため、async/awaitを使用します。
    const blockBlobClient = containerClient.getBlockBlobClient(blob_name);
    await blockBlobClient.upload(s, s.length, { overwrite });
}