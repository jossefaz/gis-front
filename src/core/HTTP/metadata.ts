import { MetaDataType } from "../types";
import HTTPFactory from "./HTTPFactory";
import config from "./../../configuration";
import { ApiCall } from "../types/http";

export async function getMetaData<T>(
  metaDataType: MetaDataType,
  params?: { [key: string]: any }
) {
  const client = HTTPFactory.getInstance(config().MD_server);
  const request: ApiCall = {
    url: metaDataType,
    method: "GET",
    ...(params && { params }),
  };
  return (await client.request<T>(request)).data;
}
