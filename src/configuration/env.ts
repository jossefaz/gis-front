import { ConfigObject } from "./types";

import HTTPFactory from "../core/HTTP/HTTPFactory";
import { ApiCall } from "../core/types/http";
interface EnvVariables {
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
export const get_env = async (): Promise<EnvVariables | false> => {
  const APP_CONFIG = () =>
    process.env.REACT_APP_APP_CONFIG
      ? importConfigObject(process.env.REACT_APP_APP_CONFIG)
      : null;
  const CONFIG = await APP_CONFIG();
  if (!APP_CONFIG) {
    return false;
  }
  return { CONFIG };
};
