import { defaultTextAlign } from "ol/render/canvas";
import axios from "axios";

export default async (baseURL, LayerID, FeatureID, cb) => {
  const response = await axios.get(baseURL);
  cb(response.data);
};
