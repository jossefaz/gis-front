import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ApiCall } from "../types";
import config from "../../configuration";

class HTTPFactory {
  private static instance: HTTPFactory;
  private _clients: { [uuid: string]: AxiosInstance } = {};
  private _current: string;

  private constructor(endpoint: string) {
    if (HTTPFactory.instance && endpoint in this._clients) {
      this._current = endpoint;
      return HTTPFactory.instance;
    }
    this._clients[endpoint] = axios.create({
      baseURL: endpoint,
    });
    this._current = endpoint;
    return HTTPFactory.instance;
  }

  public static getInstance(endpoint: string): HTTPFactory {
    if (!HTTPFactory.instance) {
      HTTPFactory.instance = new HTTPFactory(endpoint);
    }
    return HTTPFactory.instance;
  }

  public async request<T>(options: ApiCall): Promise<AxiosResponse<T>> {
    return await this._clients[this._current].request<T>(options);
  }
}

export default HTTPFactory;
