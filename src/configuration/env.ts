import { ConfigObject } from "./types";

import HTTPFactory from "../core/HTTP/HTTPFactory";
import { ApiCall } from "../core/types/http";
interface EnvVariables {
  GEOSERVER_ENDPOINT: string;
  MD_SERVER_ENDPOINT: string;
  CONFIG: ConfigObject | null;
}
const importConfigObject = async (url: string) => {
  const client = HTTPFactory.getInstance(url);
  const request: ApiCall = {
    url: "/configuration",
    method: "GET",
  };
  return (await client.request<ConfigObject>(request)).data;
};
export const get_env = async (): Promise<EnvVariables | boolean> => {
  const GEOSERVER_ENDPOINT = process.env.REACT_APP_GEOSERVER_ENDPOINT;
  const MD_SERVER_ENDPOINT = process.env.REACT_APP_MD_SERVER_ENDPOINT;
  const APP_CONFIG = () =>
    process.env.REACT_APP_APP_CONFIG
      ? importConfigObject(process.env.REACT_APP_APP_CONFIG)
      : null;
  const CONFIG = await APP_CONFIG();
  if (!GEOSERVER_ENDPOINT || !MD_SERVER_ENDPOINT || !APP_CONFIG) {
    return false;
  }
  return {
    GEOSERVER_ENDPOINT,
    MD_SERVER_ENDPOINT,
    CONFIG,
  };
};
