import {ADD_LAYER,
        UPDATE_FEATURE_ATTRIBUTES,
        UPDATE_PUBLISHED_STATUS} from '../actions/actionsTypes'
import Layer from 'ol/layer/Layer';



export const addLayer = Layer => ({
    type: ADD_LAYER,  
    layer:Layer
});

export  const updateFeatureAttributes = (JSONFeatureList,
    target,
    idTargetKey,
    idSourceKey,
    atrributeListKey,
    attributeKey,
    attributeValue) => {
    return ({
        type: UPDATE_FEATURE_ATTRIBUTES,
        data: JSONFeatureList,
        target: target,
        idTargetKey : idTargetKey,
        idSourceKey : idSourceKey,
        atrributeListKey : atrributeListKey,
        attributeKey : attributeKey,
        attributeValue : attributeValue
    });
};

export const updatePublishedStatus = params =>  ({
    type : UPDATE_PUBLISHED_STATUS,
    params : params
});

