import { Method } from "axios";

export interface ApiCall {
  url: string;
  method: Method;
  params?: Object;
  data?: Object;
  headers?: Object;
}

export interface TypedApiCall<T> {
  url: string;
  method: Method;
  params?: Object;
  data?: T;
  headers?: Object;
}
