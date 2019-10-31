import {ADD_LAYER} from '../actions/actionsTypes'
import Layer from 'ol/layer/Layer';


export const addLayer = text => ({
    type: ADD_LAYER,
    //layer:Layer     
    layer:text
});
// export const updateLayer = text => ({
//     return {type: UPDATE_LAYER , text}
// }