// Exception Payload
export type ExceptionPayload = {
  code?: string;
  message: string | object;
};

// Common Response
export interface ICommonResponse {
  success: boolean;
  data: any;
  error: ExceptionPayload;
}
