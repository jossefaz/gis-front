import persistentGeometryService, { baseURL } from "./client";
import { getWKTFromOlGeom } from "../../utils/geometryToWkt";
import { saveRestOperation } from "../saveRestOperations/api";

export const createNewGeometry = async (feature) => {
  const url = `/${feature.getGeometry().getType()}`;
  try {
    const newId = await persistentGeometryService.post(url, {
      geometry: getWKTFromOlGeom(feature),
    });
    console.log(newId.data);
    return newId.data["id"];
  } catch (error) {
    console.log("service unavailable");
    saveRestOperation(`${baseURL}${url}`, "POST", {
      geometry: getWKTFromOlGeom(feature),
    });
    return null;
  }
};

export const updateGeometry = async (feature) => {
  try {
    await persistentGeometryService.put(`/${feature.getGeometry().getType()}`, {
      id: feature.getId(),
      geometry: getWKTFromOlGeom(feature),
    });
  } catch (error) {
    console.log("service unavailable");
  }
};

export const deleteGeometry = (feature) => {
  persistentGeometryService.delete(
    `/${feature.getGeometry().getType()}/${feature.getId()}`
  );
};
