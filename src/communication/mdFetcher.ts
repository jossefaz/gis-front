import config from "../configuration";
import { fetchData } from "./apiManager";
import { MetaDataType } from "../core/types";

//options for metaDataType paramter according to api
//layers/tools/subjects/layerlist/layerListRelations

export async function getMetaData(metaDataType: MetaDataType) {
  var url;
  var functionName;

  var metaDataApi = config().metaDataApi;

  if (metaDataApi != null) functionName = metaDataType;

  if (functionName) url = metaDataApi;

  return fetchData({
    url: url,
    functionName: functionName,
    method: "Get",
  });
}
