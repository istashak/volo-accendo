import { getDynamoDBClient } from "@/shared";

describe("getDynamoDBClient", () => {
  test("Creates valid DynamoDB Client", () => {
    const dynamoDBClient = getDynamoDBClient();
    expect(dynamoDBClient).not.toBeNull();
  });
});
