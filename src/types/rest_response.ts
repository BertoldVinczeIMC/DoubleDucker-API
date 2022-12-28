/**
 * RestResponse interface
 */
export interface IRestResponse {
  status: number;
}

/**
 * RestDefaultResponse interface extends IRestResponse
 * used for default response
 */
export interface IRestDefaultResponse extends IRestResponse {
  message: string;
  data?: any;
}
