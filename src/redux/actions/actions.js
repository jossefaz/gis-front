import {ADD_LAYER} from '../actions/actionsTypes'
import Layer from 'ol/layer/Layer';


export const addLayer = Layer => ({
    type: ADD_LAYER,  
    layer:Layer
});
// export const updateLayer = text => ({
//     return {type: UPDATE_LAYER , text}
// }