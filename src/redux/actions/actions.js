import {ADD_LAYER,
        UPDATE_FEATURE_ATTRIBUTES,   
        SET_UPDATED_IDS} from '../actions/actionsTypes'
import Layer from 'ol/layer/Layer';

export const addLayer = Layer => ({
    type: ADD_LAYER,  
    layer:Layer
});



export const setFilterIds =  (
     target,
     data
) => {
     return ({
          type : SET_UPDATED_IDS,
          data : data,
          target :target
    });
};

export  const updateFeatureAttributes = (JSONFeatureList,
    target,   
    idSourceKey   
    ) => {
    return ({
        type: UPDATE_FEATURE_ATTRIBUTES,
        data: JSONFeatureList,
        target: target,        
        idSourceKey : idSourceKey   
    });
};
