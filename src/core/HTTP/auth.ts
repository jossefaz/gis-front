import { TokenData, UserCredentials } from "../types";
import HTTPFactory from "./HTTPFactory";
import config from "./../../configuration";
import { ApiCall } from "../types/http";

export async function getCredentials(credentials: UserCredentials) {
  const client = HTTPFactory.getInstance(config().API["auth"]);
  const request: ApiCall = {
    url: "/",
    method: "POST",
    ...(credentials && { data: credentials }),
  };
  const { data, status } = await client.request<TokenData>(request);
  if (status === 200 && "access_token" in data) {
    return data;
  }
  return false;
}
