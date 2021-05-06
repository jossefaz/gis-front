import axios from "axios";

export default async (baseURL, LayerID, FeatureID, properties, cb) => {
  const { adaptorId } = properties;
  let filter = "";
  let menu_type = "";
  if (properties && adaptorId) {
    menu_type = "MENU_TYPE_BY_LAYERID";
    filter = `{'AdaptorId': '${adaptorId}','LayerID': ${LayerID} }`;
    const response = await axios.get(baseURL, {
      params: { filter, menu_type },
    });
    cb(response.data);
  }
};
