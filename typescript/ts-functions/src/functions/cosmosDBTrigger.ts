import { app, InvocationContext } from "@azure/functions";
import * as appinsights from "applicationinsights";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config()

// Get the name of the currently running program
const fullPath = process.argv[1];
const runningProgramName = path.basename(fullPath);

export async function cosmosDBTrigger(documents: any[], context: InvocationContext): Promise<void> {
    context.trace({runningProgramName: runningProgramName,
    message: `cosmosDBTrigger has been executed.`});

    // Enable Application Insights
    const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
    appinsights.setup(connectionString).start();  
    
    context.trace({runningProgramName: runningProgramName,
    message: `The running document is {id: ${documents[0].id}, type: ${documents[0].doc_type}, status: ${documents[0].doc_status}}.`});
}

app.cosmosDB('cosmosDBTrigger', {
    connectionStringSetting: '',
    databaseName: '',
    collectionName: '',
    createLeaseCollectionIfNotExists: true,
    handler: cosmosDBTrigger
});
