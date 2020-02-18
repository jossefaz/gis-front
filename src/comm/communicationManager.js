import channels from '../usefulgarbage/channels'
import tools from '../usefulgarbage/tools'
import  {addLayer,updateFeatureAttributes,setFilterIds,udpatedInfo}  from "../redux/actions/actions";
// import {ADD_LAYER,UPDATE_FEATURE_ATTRIBUTES} from '../actions/actionsTypes';
import {WSkubeMQ} from '../comm/WSkubeMQ.js'; 
import {Base64} from '../convertors/base64';
import store from '../redux/store.js';
import watch from 'redux-watch' ;





export const loadChannels = () => {
    
    channels.map(function(channel){     

        var ws = new WSkubeMQ('172.17.22.215:9090', 'MTCS.Units.*', 'DataServer', '',{
            onMessage :  onMessageRecived,
            onError : onErrorRecived,
            decoder: Base64.decode

        });
    });
}

export const onMessageRecived = (message) => {
    
      // var channelItem =  channels.find(function(item){ 
    //     var a = item.Channel;
    //     var b = message.Channel;
    //     return item.Channel.indexOf(message.Channel) > -1;
    // });

    var channelItem = channels[0];
    var data = [];

    if(channelItem){
        var newMessage = JSON.parse(message.Body.replace(' - (1)', ''));   
     
        data.push(newMessage);
        switch (channelItem.reduxFunction) {
            case "UPDATE_FEATURE_ATTRIBUTES":
                store.dispatch(setFilterIds("units",null)); 
                store.dispatch(updateFeatureAttributes(
                    data,
                    channelItem.reduxTarget,                    
                    channelItem.idTargetKey,
                    channelItem.idSourceKey   
                    ));
                    store.dispatch(setFilterIds("units",data));                    
                break;    
            default:
                break;
        }
  }

}



export const onErrorRecived = (error) => {

    console.log(error);
}