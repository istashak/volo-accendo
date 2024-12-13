import { getDynamoDBClient } from "../src/shared";

describe("getDynamoDBClient", () => {
  test("Creates valid DynamoDB Client", () => {
    const dynamoDBClient = getDynamoDBClient();
    expect(dynamoDBClient).not.toBeNull();
  });
});
