import config from "react-global-configuration";
import { fetchData } from "./apiManager";

//options for metaDataType paramter according to api
//layers/tools/subjects/layerlist/layerListRelations

export async function getMetaData(metaDataType) {
  var url;
  var functionName;

  var metaDataApi = config.get("MD_server");

  if (metaDataApi != null) functionName = metaDataType;

  if (functionName) url = metaDataApi;

  return fetchData({
    url: url,
    functionName: functionName,
    method: "Get",
  });
}
