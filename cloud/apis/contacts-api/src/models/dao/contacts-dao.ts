import { PutItemCommand, PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { getDynamoDBClient } from "../../";
import { Contact, ContactVerificationStatus } from "../";
import { BaseDao } from "./base-dao";
import { LambdaDynamoDBError } from "../errors";

export class ContactsDao extends BaseDao {
  readonly email: string;
  readonly phoneNumber: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly companyName: string | null;
  readonly message: string;
  readonly verificationStatus: ContactVerificationStatus;

  constructor(contact: Contact) {
    super();
    this.email = contact.email;
    this.phoneNumber = contact.phoneNumber;
    this.firstName = contact.firstName;
    this.lastName = contact.lastName;
    this.companyName = contact.companyName ?? null;
    this.message = contact.message;
    this.verificationStatus = contact.verificationStatus;
  }

  public async putContact(): Promise<PutItemCommandOutput> {
    const params = {
      TableName: process.env.CONTACTS_TABLE_NAME,
      Item: {
        email: { S: this.email },
        firstName: { S: this.firstName },
        lastName: { S: this.lastName },
        message: { S: this.message },
        companyName: this.companyName
          ? { S: this.companyName }
          : { NULL: true },
        verificationStatus: { S: this.verificationStatus },
      },
    };

    try {
      console.log("DynamoDB PutItemCommand Params", params);
      const data = await getDynamoDBClient().send(new PutItemCommand(params));
      console.log("Success - item added or updated", data);
      return data;
    } catch (err) {
      console.error("Error adding or updating item", err);
      if (err instanceof Error) {
        throw this.handleDynamoDBException(err);
      } else {
        // Handle non-Error cases or throw a general error
        throw new LambdaDynamoDBError("Unknown error occurred", 500);
      }
    }
  }

  public toJson(): Contact {
    return {
      email: this.email,
      phoneNumber: this.phoneNumber,
      firstName: this.firstName,
      lastName: this.lastName,
      companyName: this.companyName,
      message: this.message,
      verificationStatus: this.verificationStatus,
    };
  }
}
