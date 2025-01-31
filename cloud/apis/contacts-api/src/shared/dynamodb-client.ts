import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

let client: DynamoDBClient | null = null;

export const getDynamoDBClient = (): DynamoDBClient => {
  if (client) return client;

  client = new DynamoDBClient({
    region: process.env.REGION,
  });

  return client;
};
