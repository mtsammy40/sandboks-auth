import { ErrorCode } from "./error.code";
import { ApplicationException } from "./application.exception";

export class ErrorResponse {
  constructor(code: ErrorCode, message: string) {
    this.code = code;
    this.message = message;
  }

  code: ErrorCode;
  message: string;

  public static fromException(error: Error | ApplicationException | any): ErrorResponse {
    if (error instanceof Error) {
      return new ErrorResponse(ErrorCode.UNKNOWN, error.message);
    } else if (error instanceof ApplicationException) {
      return new ErrorResponse(error.error.errorCode, error.error.displayMessage);
    } else {
      return new ErrorResponse(ErrorCode.UNKNOWN, JSON.stringify(error));
    }
  }
}
