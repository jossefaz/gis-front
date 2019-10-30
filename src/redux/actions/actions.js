import {ADD_LAYER,UPDATE_LAYER} from '../actions/actionsTypes'

export const addLayer = text => ({
    type: ADD_LAYER,
    layer:text 
    
});
// export const updateLayer = text => ({
//     return {type: UPDATE_LAYER , text}
// }