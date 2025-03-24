export const handleError = (error: any) => {
  return error?.error || error;
};

export function handleContractError(error?: any, req?: any) {
  if (typeof error === "string") return { message: error };
  if (error?.message) return error;
  if (error?.Error) {
    return {
      message: error.Error.Details || error.Error.Message || error.Error,
      code: error.Error.Code,
    };
  }
  return {
    code: req?.error?.message?.Code || req?.error,
    message: req?.errorMessage?.message || req?.error?.message?.Message,
  };
}

export const handleContractErrorMessage = (error?: any) => {
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  if (error?.Error) {
    return error.Error.Details || error.Error.Message || error.Error;
  }
  return `Transaction: ${error?.Status || "error"}`;
};

export const handleErrorMessage = (error: any, errorText?: string) => {
  let _error = error;
  let _errorText = errorText;
  if (error?.status === 500) {
    return errorText || "Failed to fetch data";
  }
  _error = handleError(_error);
  _error = handleContractError(error);
  if (typeof _error.message === "string" && _error.message !== "")
    _errorText = _error.message;
  return _errorText || "";
};
