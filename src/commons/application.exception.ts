import { ErrorModel } from "./error.model";
import { ErrorCode } from "./error.code";

export class ApplicationException extends Error {
  constructor(error: ErrorModel) {
    super(error.errorMessage);
    this.error = error;
  }

  error: ErrorModel;

  public static generalException(message?: string): ApplicationException {
    return new ApplicationException(ErrorModel.generalError(message));
  }

  public static simpleException(code: ErrorCode, message: string): ApplicationException {
    return new ApplicationException(new ErrorModel(code, message));
  }
}
