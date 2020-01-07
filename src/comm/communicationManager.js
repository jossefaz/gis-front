import channels from '../usefulgarbage/channels'
import tools from '../usefulgarbage/tools'
import  {addLayer,updateFeatureAttributes}  from "../redux/actions/actions";
// import {ADD_LAYER,UPDATE_FEATURE_ATTRIBUTES} from '../actions/actionsTypes';
import {WSkubeMQ} from '../comm/WSkubeMQ.js'; 
import {Base64} from '../convertors/base64';
import store from '../redux/store.js';
import watch from 'redux-watch' 



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

    console.log("units from redux watch" + store.getState().featureAttributes.units); 

    //let w = watch(store.getState, 'featureAttributes.units');
    
    // store.subscribe(w( (newVal, oldVal, objectPath) => {
    //     console.log('%s changed from %s to %s', objectPath, oldVal, newVal) 
    // }));
    store.subscribe(handleChange);
    
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
        return item.Channel === message.Channel;
    });

    if(channelItem){
       
        var data = JSON.parse(message.Body.replace(' - (1)', ''));
        // var data = [{
        //     "unit-id": 340,
        //     "changes": [{
        //         "field-name": "Status",
        //         "value": "FAIL"
        //     },
        //     {
        //         "field-name": "Time",
        //         "value": "2019222"
        //     }]
        // },
        // {
        //     "unit-id": 580,
        //     "changes": [{
        //         "field-name": "Status",
        //         "value": "FAIL"
        //     },
        //     {
        //         "field-name": "Time",
        //         "value": "2019222"
        //     }]
        // }]
    

        switch (channelItem.reduxFunction) {
            case "UPDATE_FEATURE_ATTRIBUTES":
                store.dispatch (updateFeatureAttributes(
                    
                    data,
                    channelItem.reduxTarget,                    
                    channelItem.idTargetKey,
                    channelItem.idSourceKey,
                    channelItem.atrributeListKey,
                    channelItem.attributeKey,
                    channelItem.attributeValue
                    ));          
                break;    
            default:
                break;
        }
  }

}



export const onErrorRecived = (error) => {

    console.log(error);
}