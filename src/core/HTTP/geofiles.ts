import { TokenData, UserCredentials } from "../types";
import HTTPFactory from "./HTTPFactory";
import config from "./../../configuration";
import { ApiCall } from "../types/http";
import { mainStore as store } from "../../state/store";
import ContentDisposition from "content-disposition";

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
    url: "/upload/",
    method: "POST",
    headers: {
      [config().Auth.headerName]: auth.jwt.token,
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  };
  const { data, status } = await client.request<string>(request);
  if (status === 201) {
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
      [config().Auth.headerName]: auth.jwt.token,
    },
  };
  const { data, status } = await client.request<GeofileItem[]>(request);
  if (status === 200) {
    return data;
  }
  return false;
}

export async function retrieveFormat(fileUUID: string) {
  const auth = store.getState().auth;
  const client = HTTPFactory.getInstance(config().API["geofiles"]);
  const request: ApiCall = {
    url: `${fileUUID}/format`,
    method: "GET",
    headers: {
      [config().Auth.headerName]: auth.jwt.token,
    },
  };
  const { data, status } = await client.request<string[]>(request);
  if (status === 200) {
    return data;
  }
  return false;
}

export async function downloadFile(fileUUID: string) {
  const auth = store.getState().auth;
  const client = HTTPFactory.getInstance(config().API["geofiles"]);
  const request: ApiCall = {
    url: `${fileUUID}/`,
    method: "GET",
    headers: {
      [config().Auth.headerName]: auth.jwt.token,
    },
  };
  const { data, status, headers } = await client.request<string[]>(request);
  if (status === 200) {
    _downloadFile(data, headers);
  }
  return false;
}

export async function downloadFormat(url: string) {
  const auth = store.getState().auth;
  const client = HTTPFactory.getInstance(config().API["geofiles"]);
  const request: ApiCall = {
    url,
    method: "GET",
    headers: {
      [config().Auth.headerName]: auth.jwt.token,
    },
  };
  const { data, status, headers } = await client.request<any>(request);
  if (status === 200) {
    _downloadFile(data, headers);
  }
  return false;
}

const _downloadFile = (data: any, headers: { [key: string]: string }) => {
  if (headers["content-type"] == "application/json") {
    const blob = new Blob([JSON.stringify(data)], { type: "text/json" });
    const link = document.createElement("a");
    link.download = "tojson.json";
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(
      ":"
    );

    const evt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });

    link.dispatchEvent(evt);
    link.remove();
  } else {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    const fileName = ContentDisposition.parse(headers["content-disposition"])
      .parameters["filename"];
    link.href = url;
    link.setAttribute("download", fileName); //or any other extension
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
