import {
  ConditionalCheckFailedException,
  DynamoDBServiceException,
  ProvisionedThroughputExceededException,
  ResourceNotFoundException,
} from "@aws-sdk/client-dynamodb";
import { LambdaDynamoDBError } from "@/shared/models/errors";

export abstract class BaseDao {
  protected handleDynamoDBException(
    exception: Error
  ): LambdaDynamoDBError {
    let statusCode;
    let message;

    // Determine the type of error and set appropriate status code and message
    if (exception instanceof ConditionalCheckFailedException) {
      statusCode = exception.$response?.statusCode ?? 400;
      message = exception.message;
    } else if (exception instanceof ProvisionedThroughputExceededException) {
      statusCode = exception.$response?.statusCode ?? 503;
      message = exception.message;
    } else if (exception instanceof ResourceNotFoundException) {
      statusCode = exception.$response?.statusCode ?? 404;
      message = exception.message;
    } else if (exception instanceof DynamoDBServiceException) {
      statusCode = exception.$response?.statusCode ?? 404;
      message = exception.message;
    } else {
      statusCode = 500;
      message = "Internal Server Error";
    }

    return new LambdaDynamoDBError(message, statusCode);
  }
}
