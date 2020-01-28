import channels from '../usefulgarbage/channels'
import tools from '../usefulgarbage/tools'
import  {addLayer,updateFeatureAttributes,setFilterIds,udpatedInfo}  from "../redux/actions/actions";
// import {ADD_LAYER,UPDATE_FEATURE_ATTRIBUTES} from '../actions/actionsTypes';
import {WSkubeMQ} from '../comm/WSkubeMQ.js'; 
import {Base64} from '../convertors/base64';
import store from '../redux/store.js';
import watch from 'redux-watch' ;



function select(state, filter) {
    return state.featureAttributes.units;
  }
  let currentValue
  function handleChange() {
    let previousValue = currentValue;
    currentValue = select(store.getState());
    if (previousValue !== currentValue) {
      console.log(
        'Some deep nested property changed from',
        previousValue,
        'to',
        currentValue
      )
    }
  }

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
    
    console.log("my messaage from communication:" + message);
    
    // var channelItem =  channels.find(function(item){ 
    //     var a = item.Channel;
    //     var b = message.Channel;
    //     return item.Channel.indexOf(message.Channel) > -1;
    // });

    var channelItem = channels[0];
    var data = [];

    if(channelItem){
       
<<<<<<< HEAD
        var data = JSON.parse(message.Body.replace(' - (1)', ''));       

        // var data = message;
=======
        var newMessage = JSON.parse(message.Body.replace(' - (1)', ''));   
        console.log('received: ' + JSON.stringify(newMessage));
        data.push(newMessage);

        //var data = message;
>>>>>>> cd96df317cf57a480927cb8743edcc12c3438d37

        switch (channelItem.reduxFunction) {
            case "UPDATE_FEATURE_ATTRIBUTES":
                store.dispatch(setFilterIds(null)); 
                store.dispatch(updateFeatureAttributes(
                    data,
                    channelItem.reduxTarget,                    
                    channelItem.idTargetKey,
                    channelItem.idSourceKey   
                    ));
                    console.log("we just updated redux object");
                    store.dispatch(setFilterIds(data)); 
                    // store.dispatch(udpatedInfo(true));        
                break;    
            default:
                break;
        }
  }

}



export const onErrorRecived = (error) => {

    console.log(error);
}