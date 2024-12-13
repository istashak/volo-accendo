import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { ContactsDao } from "../../shared/models/dao";
import { LambdaDynamoDBError } from "../../shared/models/errors";
import {
  SESClient,
  SendBounceCommandOutput,
  SendEmailCommand,
} from "@aws-sdk/client-ses";

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
  let {
    email,
    phoneNumber,
    firstName,
    lastName,
    companyName,
    message,
    verificationStatus,
  } = body;

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
    verificationStatus,
  });

  let databaseResponse: PutItemCommandOutput | null = null;
  let emailResponse: SendBounceCommandOutput | null = null;
  try {
    databaseResponse = await contact.putContact();
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

  if (databaseResponse?.$metadata.httpStatusCode == 200) {
    // Send an email via SES
    try {
      const sesClient = new SESClient({ region: process.env.AWS_REGION });
      const verificationLink = `https://${
        process.env.ENVIRONMENT_AND_DOMAIN
      }/contacts/verify?email=${encodeURIComponent(
        email
      )}&firstName=${firstName}`;
      const emailParams = {
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Body: {
            Text: {
              Data: `Hi ${firstName},\n\nThank you for submitting your contact information.\nPlease verify your email address by clicking the link below:\n${verificationLink}\n\nBest Regards,\nVolo Accendo Inc.`,
            },
          },
          Subject: {
            Data: "Please Verify Your Email Address",
          },
        },
        Source: process.env.SES_EMAIL_SOURCE,
      };

      const sendEmailCommand = new SendEmailCommand(emailParams);
      // const sendEmailCommand = new CloneReceiptRuleSetCommand(emailParams); ?
      emailResponse = await sesClient.send(sendEmailCommand);
      console.log("Verification email sent", emailResponse);
      if (emailResponse?.$metadata.httpStatusCode == 200) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: "Successfully added contact.",
            contact: contact.toJson(),
          }),
        };
      }
    } catch (sesError) {
      console.error("Error sending email:", sesError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error sending verification email.",
        }),
      };
    }
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "Unknown error.",
      databaseResponse: databaseResponse?.$metadata.httpStatusCode,
      emailResponse: emailResponse?.$metadata.httpStatusCode,
    }),
  };
};
