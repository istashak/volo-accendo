import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { ContactsDao } from "./models/dao";
import { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { LambdaDynamoDBError } from "./models/errors";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log("putContact event:", event);

  // Check if the body is a string and parse it
  let body;
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch (err) {
    console.error("Error parsing body:", err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid JSON format.",
      }),
    };
  }

  console.log("putContact received body:", body);

  // Destructure the fields from the body
  let { email, phoneNumber, firstName, lastName, companyName, message } = body;

  // Ensure companyName is set to null if it is undefined
  if (companyName === undefined) {
    companyName = null;
  }

  const contact = new ContactsDao({
    email,
    phoneNumber,
    firstName,
    lastName,
    companyName,
    message,
  });

  let response: PutItemCommandOutput | null = null;
  try {
    response = await contact.putContact();
  } catch (error) {
    console.error(error);
    if (error instanceof LambdaDynamoDBError) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({
          message: error.message,
        }),
      };
    }
  }

  if (response && response.$metadata.httpStatusCode) {
    if (response.$metadata.httpStatusCode == 200)
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Successfully added contact.",
          contact: contact.toJson(),
        }),
      };
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "Unknown error.",
    }),
  };
};
