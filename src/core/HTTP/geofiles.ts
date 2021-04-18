import { TokenData, UserCredentials } from "../types";
import HTTPFactory from "./HTTPFactory";
import config from "./../../configuration";
import { ApiCall } from "../types/http";
import { mainStore as store } from "../../state/store";

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
  const { data, status } = await client.request<TokenData>(request);
  if (status === 200 && "access_token" in data) {
    return data;
  }
  return false;
}
