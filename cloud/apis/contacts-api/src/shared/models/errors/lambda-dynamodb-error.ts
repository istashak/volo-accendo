export class LambdaDynamoDBError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "LambdaDynamoDBError";
  }
}
