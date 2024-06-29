// Exception Payload
export type ExceptionPayload = {
  code?: string;
  message: string | object;
};

export type ICommonResponse = ICommonErrorResponse | ICommonSuccessResponse;

// Error Response
export type ICommonErrorResponse = {
  success: true;
  data: any;
};

// Success Response
export type ICommonSuccessResponse = {
  success: false;
  error: ExceptionPayload;
};
