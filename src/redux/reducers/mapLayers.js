import {
  ADD_LAYER,   
} from '../actions/actionsTypes'
import {Tile as TileLayer} from 'ol/layer.js';
import {OSM} from 'ol/source.js';


var a  = new TileLayer({
  source: new OSM()
})

const initialState = {
  layers: [a]
};

export default function (state = initialState, action){
    switch (action.type) {
        case ADD_LAYER:
          return {
            ...state,
            layers: [...state.layers,action.layer]            
        };
        default:
          return state
      }
}


