import {ADD_LAYER,
        UPDATE_FEATURE_ATTRIBUTES,   
        SET_UPDATED_IDS} from '../actions/actionsTypes'
import Layer from 'ol/layer/Layer';




export const addLayer = Layer => ({
    type: ADD_LAYER,  
    layer:Layer
});



export const setFilterIds = Ids => ({
    type : SET_UPDATED_IDS,
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

