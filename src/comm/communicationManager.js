import channels from '../usefulgarbage/channels.json'
// import  {addLayer,updateFeatureAttributes}  from "../redux/actions/actions";
// import {ADD_LAYER,UPDATE_FEATURE_ATTRIBUTES} from '../actions/actionsTypes';
import {WSkubeMQ} from '../comm/WSkubeMQ.js'; 
import {Base64} from '../convertors/base64';


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
    
    var channelItem =  channels.map(function(item){
        if(item.Channel === message.Channel){
            return channelItem;
        }
    });

    switch (channelItem.reduxFunction) {
        case value:
            
            break;
    
        default:
            break;
    }

}

export const onErrorRecived = (error) => {

    console.log(error);
}