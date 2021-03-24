import axios from "axios";

export default async (baseURL, LayerID, FeatureID, properties, cb) => {
  console.log("properties", properties);
  const response = await axios.get(baseURL);
  cb(response.data);
};
