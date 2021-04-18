import HTTPFactory from "./HTTPFactory";
import config from "../../configuration";
import { TypedApiCall } from "../types/http";
import { mainStore as store } from "../../state/store";
import { GeoJSONFeatureCollection } from "ol/format/GeoJSON";

interface CustomLayerPayload {
  is_public: boolean;
  layer_name: string;
  layer: GeoJSONFeatureCollection;
}

interface CustomLayerResponse {
  id: number;
  status: string;
}

export async function createLayers(
  layer_name: string,
  is_public: boolean,
  layer: GeoJSONFeatureCollection
) {
  const auth = store.getState().auth;
  const client = HTTPFactory.getInstance(config().API["users-layers"]);
  const request: TypedApiCall<CustomLayerPayload> = {
    url: "/",
    method: "POST",
    headers: { [config().Auth.headerName]: auth.jwt.access_token },
    data: {
      is_public,
      layer_name,
      layer,
    },
  };
  const { data, status } = await client.request<CustomLayerResponse>(request);
  if (status === 200) {
    return data.id;
  }
  return false;
}
