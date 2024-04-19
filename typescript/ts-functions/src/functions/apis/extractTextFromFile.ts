import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions } from "@azure/storage-blob";

export const extractTextFromFile = async (filePath: string): Promise<string> => {
    // Obtain the URL with SAS of a document (Blob) uploaded to Azure Blob Storage
    const blobServiceClient = BlobServiceClient.fromConnectionString("<connection-string>");
    const containerName = "<container-name>";
    const blobName = "<blob-name>";

    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobClient = containerClient.getBlobClient(blobName);

    const sasToken = generateBlobSASQueryParameters({
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("r"),
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 86400) // SAS token valid for 24 hours
    }, blobServiceClient.credential).toString();

    const blobUrlWithSas = blobClient.url + "?" + sasToken;

    // Use the Azure SDK to access the Blob Storage account
    const response = await fetch(blobUrlWithSas);
    const blobData = await response.blob();
    const text = await blobData.text();

    // Analyze documents with Azure AI Document Intelligence (text extraction)
    const endpoint = "<document-intelligence-endpoint>";
    const apiKey = "<document-intelligence-api-key>";

    const requestBody = {
        source: blobUrlWithSas,
        tasks: [
            {
                task: "textExtraction",
                parameters: {}
            }
        ]
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": apiKey
        },
        body: JSON.stringify(requestBody)
    });

    const result = await response.json();

    // Extract the extracted text from the result
    const extractedText = result?.analyzeResult?.documentResults?.[0]?.pages?.[0]?.lines?.map(line => line.text).join(" ");

    // Return the extracted text
    return extractedText;
}