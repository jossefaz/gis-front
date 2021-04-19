import { TokenData, UserCredentials } from "../types";
import HTTPFactory from "./HTTPFactory";
import config from "./../../configuration";
import { ApiCall } from "../types/http";
import { mainStore as store } from "../../state/store";

export interface GeofileItem {
  id: string;
  eol: string;
  type: string;
  file_name: string;
}

export async function uploadFile(formData: FormData) {
  const auth = store.getState().auth;
  const client = HTTPFactory.getInstance(config().API["geofiles"]);
  const request: ApiCall = {
    url: "/",
    method: "POST",
    headers: {
      [config().Auth.headerName]: auth.jwt.access_token,
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  };
  const { data, status } = await client.request<string>(request);
  if (status === 200) {
    return data;
  }
  return false;
}

export async function retrieveAllFiles() {
  const auth = store.getState().auth;
  const client = HTTPFactory.getInstance(config().API["geofiles"]);
  const request: ApiCall = {
    url: "/",
    method: "GET",
    headers: {
      [config().Auth.headerName]: auth.jwt.access_token,
    },
  };
  const { data, status } = await client.request<GeofileItem[]>(request);
  if (status === 200) {
    return data;
  }
  return false;
}
