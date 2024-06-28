export interface IResponseObject {
  statusCode: number;
  message: string;
  status: string;
  data?: any;
}

export interface IPayload {
  email: string;
  user_id: number;
  username: string;
}
