import channels from '../usefulgarbage/channels.json'
// import  {addLayer,updateFeatureAttributes}  from "../redux/actions/actions";
// import {ADD_LAYER,UPDATE_FEATURE_ATTRIBUTES} from '../actions/actionsTypes';
import {WSkubeMQ} from '../comm/WSkubeMQ.js'; 


export const loadChannels = () => {

    channels.map(function(channel){     

        var ws = new WSkubeMQ('172.17.22.215:9090', 'e1', 'yoni', '',{
            onMessage :  onMessageRecived //function(message){ console.log(message)}
        });
    });
}

export const onMessageRecived = (message) => {
    
    console.log("my messaage from communication:" + message);
    
    var channelItem =  channels.map(function(channel){
        if(channel.Channel === message.Channel){
           
        }
    });
    
    // switch (type) {
    //     case "":
    //         updateFeatureAttributes();
    //         break;
    //     case "":
    //         addLayer();            
    //         break;
    //     default:
    //         break;
    // } 
}