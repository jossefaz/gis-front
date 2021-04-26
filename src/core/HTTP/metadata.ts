import { MetaDataType } from "../types";
import HTTPFactory from "./HTTPFactory";
import config from "./../../configuration";
import { ApiCall } from "../types/http";

export async function getMetaData<T>(
  metaDataType: MetaDataType,
  params?: { [key: string]: any }
) {
  console.log("config", config());
  const client = HTTPFactory.getInstance(config().API["metaData"]);
  const request: ApiCall = {
    url: metaDataType,
    method: "GET",
    ...(params && { params }),
  };
  return (await client.request<T>(request)).data;
}
