import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { ContactsDao } from "@/shared/models/dao";
import { UpdateItemCommandOutput } from "@aws-sdk/client-dynamodb";
import {
  SESClient,
  SendBounceCommandOutput,
  SendEmailCommand,
} from "@aws-sdk/client-ses";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const email = decodeURIComponent(event.queryStringParameters?.email ?? "");
  const firstName = event.queryStringParameters?.firstName ?? "";
  console.log("received params", { email, firstName });

  const base64Data = Buffer.from(`${email}|${firstName}`).toString("base64");

  console.log(`base64 encoding of "email|firstName" = ${base64Data}`);

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
      await sendNewVerifiedContactAlertEmail(email, firstName);
      const verificationUrl = `https://${process.env.DOMAIN}/contact/verification/${base64Data}`;
      console.log("Verification URL = " + verificationUrl);
      return {
        statusCode: 302,
        headers: {
          Location: verificationUrl,
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

const sendNewVerifiedContactAlertEmail = async (
  emailAddress: string,
  firstName: string
) => {
  try {
    let emailResponse: SendBounceCommandOutput | null = null;
    const sesClient = new SESClient({ region: process.env.AWS_REGION });
    const toAddress: string = process.env.ALERT_EMAIL_ADDRESS ?? "istashak+error@gmail.com";

    const emailParams = {
      Destination: {
        ToAddresses: [toAddress],
      },
      Message: {
        Body: {
          Text: {
            Data: `A new verified contact from ${firstName} has arrived.\n\n${emailAddress}`,
          },
        },
        Subject: {
          Data: "New Verified Contact Received",
        },
      },
      Source: process.env.SES_EMAIL_SOURCE,
    };

    const sendEmailCommand = new SendEmailCommand(emailParams);
    emailResponse = await sesClient.send(sendEmailCommand);
    console.log("Verification alert email sent", emailResponse);
  } catch (error) {
    console.error("Failed to send verification alert email: " + error);
  }
};
