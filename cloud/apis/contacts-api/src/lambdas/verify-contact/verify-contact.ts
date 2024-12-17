import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { ContactsDao } from "../../shared/models/dao";
import { UpdateItemCommandOutput } from "@aws-sdk/client-dynamodb";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const email = decodeURIComponent(event.queryStringParameters?.email ?? "");
  const firstName = event.queryStringParameters?.firstName;

  console.log("received params", { email, firstName });

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Email is required." }),
    };
  }

  const contact = new ContactsDao({
    email,
    phoneNumber: "",
    firstName: "",
    lastName: "",
    companyName: "",
    message: "",
    verificationStatus: "verified",
  });

  let response: UpdateItemCommandOutput | null = null;
  try {
    // Update the verification status in the DynamoDB table

    response = await contact.verifyContact();

    console.log("verification response", response);

    if (response?.$metadata.httpStatusCode == 200) {
      return {
        statusCode: 302,
        headers: {
          Location: `https://${process.env.ENVIRONMENT_AND_DOMAIN}/contact/verification?email=${email}&${firstName}`,
        },
        body: JSON.stringify({}),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to verify email.", error }),
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "Unknown verification error.",
      response: response?.$metadata.httpStatusCode,
    }),
  };
};
