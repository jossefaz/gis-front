import channels from './usefulgarbage/channels.json'
import  {addLayer,updateFeatureAttributes}  from "../redux/actions/actions";
import {ADD_LAYER,UPDATE_FEATURE_ATTRIBUTES} from '../actions/actionsTypes'


export const loadChannels = () => {

    channels.map(function(channel){

        //channel

    });
}

export const onMessageRecived = () => {
    
    switch (type) {
        case "":
            updateFeatureAttributes();
            break;
        case "":
            addLayer();            
            break;
        default:
            break;
    } 
}