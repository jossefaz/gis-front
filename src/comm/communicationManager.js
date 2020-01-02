import channels from '../usefulgarbage/channels'
import tools from '../usefulgarbage/tools'
import  {addLayer,updateFeatureAttributes}  from "../redux/actions/actions";
// import {ADD_LAYER,UPDATE_FEATURE_ATTRIBUTES} from '../actions/actionsTypes';
import {WSkubeMQ} from '../comm/WSkubeMQ.js'; 
import {Base64} from '../convertors/base64';
import store from '../redux/store.js';


export const loadChannels = () => {

    channels.map(function(channel){     

        var ws = new WSkubeMQ('172.17.22.215:9090', 'e1', 'yoni', '',{
            onMessage :  onMessageRecived,
            onError : onErrorRecived,
            decoder: Base64.decode

        });
    });
}

export const onMessageRecived = (message) => {
    
    console.log("my messaage from communication:" + message);
    
    var channelItem =  channels.find(function(item){
        // if(item.Channel === message.Channel){
        //     return item;
        // }
        return item.Channel === message.Channel;
    });

    if(channelItem){

    switch (channelItem.reduxFunction) {
        case "UPDATE_FEATURE_ATTRIBUTES":
            store.dispatch (updateFeatureAttributes([{
                "unit-id": 340,
                "changes": [{
                    "field-name": "Status",
                    "value": "FAIL"
                },
                {
                    "field-name": "Time",
                    "value": "2019222"
                }]
            },
            {
                "unit-id": 580,
                "changes": [{
                    "field-name": "Status",
                    "value": "FAIL"
                },
                {
                    "field-name": "Time",
                    "value": "2019222"
                }]
            }],"units","unit-id","unit-id","changes", "field-name","value"));           
            break;    
        default:
            break;
    }
  }

}



export const onErrorRecived = (error) => {

    console.log(error);
}