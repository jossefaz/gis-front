import {ADD_LAYER,
        UPDATE_FEATURE_ATTRIBUTES,
        UPDATE_PUBLISHED_STATUS,
        SET_FILTER_IDS,
        UPDATED_INFO} from '../actions/actionsTypes'
import Layer from 'ol/layer/Layer';




export const addLayer = Layer => ({
    type: ADD_LAYER,  
    layer:Layer
});

export const udpatedInfo = IsInfoUpdated => ({
    type : UPDATED_INFO,
    isInfoUpdated : IsInfoUpdated
});

export const setFilterIds = Ids => ({
    type : SET_FILTER_IDS,
    ids : Ids
});

export  const updateFeatureAttributes = (JSONFeatureList,
    target,
    idTargetKey,
    idSourceKey,    
    attributeKey,
    attributeValue) => {
    return ({
        type: UPDATE_FEATURE_ATTRIBUTES,
        data: JSONFeatureList,
        target: target,
        idTargetKey : idTargetKey,
        idSourceKey : idSourceKey   
    });
};

export const updatePublishedStatus = (params) => {
    return {
      type: UPDATE_PUBLISHED_STATUS,
      params : params
    }
}

// export const updatePublishedStatus = params =>  (
//     type : UPDATE_PUBLISHED_STATUS,
//     params : params
// );

