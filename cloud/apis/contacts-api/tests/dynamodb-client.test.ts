import { getDynamoDBClient } from "../src";

describe("getDynamoDBClient", () => {
  test("Creates valid DynamoDB Client", () => {
    const dynamoDBClient = getDynamoDBClient();
    expect(dynamoDBClient).not.toBeNull();
  });
});
