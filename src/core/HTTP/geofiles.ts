import { TokenData, UserCredentials } from "../types";
import HTTPFactory from "./HTTPFactory";
import config from "./../../configuration";
import { ApiCall } from "../types/http";
import { mainStore as store } from "../../state/store";
import ContentDisposition from "content-disposition";
import JSZip from "jszip";
import { GeoJSONFeatureCollection } from "ol/format/GeoJSON";

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

export async function getGeojsonStream(fileUUID: string) {
  const auth = store.getState().auth;
  const client = HTTPFactory.getInstance(config().API["geofiles"]);
  const request: ApiCall = {
    url: `${fileUUID}/stream/geojson`,
    method: "GET",
    headers: {
      [config().Auth.headerName]: auth.jwt.token,
    },
  };
  const { data, status } = await client.request<GeoJSONFeatureCollection>(
    request
  );
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
  var fileName = ContentDisposition.parse(headers["content-disposition"])
    .parameters["filename"];
  switch (headers["content-type"]) {
    case "application/json":
      downloadIt(fileName, blobJsonFile(data));
      break;
    case "application/zip":
      blobZipFile(data).then((blob) => downloadIt(fileName, blob));
      break;
    default:
      downloadIt(fileName, blobOtherFormat(data));
      break;
  }
};

const blobOtherFormat = (data: string) => new Blob([data]);
const blobJsonFile = (data: any) => new Blob([JSON.stringify(data)]);
const blobZipFile = async (content: any) => {
  const zip = new JSZip();

  await zip.loadAsync(content, { base64: true });
  const blob = await zip.generateAsync({ type: "blob" });
  return blob;
};

const downloadIt = (fileName: string, blob: Blob) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName); //or any other extension
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
