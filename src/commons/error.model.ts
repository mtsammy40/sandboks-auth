import { ErrorCode } from "./error.code";

export class ErrorModel {

  constructor(code: ErrorCode, message?: string, data?: object, displayMessage?: string) {
    this.errorCode = code;
    this.errorMessage = message;
    this.data = data;
    this.displayMessage = displayMessage ? displayMessage : message;
  }

  errorCode: ErrorCode;
  data: any;
  errorMessage?: string;
  displayMessage?: string;

  public static generalError(message: string): ErrorModel {
    return new ErrorModel(ErrorCode.GENERAL, message || 'General Exception' );
  }

}
