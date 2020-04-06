import {
  ADD_LAYER,   
} from '../actions/actionsTypes'

const initialState = {
  layers: []
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


