import config from "react-global-configuration";
import { fetchData } from './apiManager'

export async function getMetaData(metaDataType) {
   
    var url;
    var functionName;
    
    var metaDataApi = config.get("metaDataApi")
    
    if(metaDataApi != null)
       functionName = metaDataApi[metaDataType]        
    
    if(functionName)
       url =  metaDataApi["url"];    
    
    fetchData({
        url: url,
        functionName: functionName,
        method: "Get"
    });      
}