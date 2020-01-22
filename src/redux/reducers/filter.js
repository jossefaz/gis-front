import {
    SET_FILTER_IDS,
    UPDATED_INFO   
} from '../actions/actionsTypes';
import produce from 'immer';
import mantiIntersections from '../../usefulgarbage/mantiIntersections.json';
 
  

  const initialState = {
    isInfoUpdated :false,
    ids : []
  };


  export default function (state = initialState, action){
    switch (action.type) {
        case UPDATED_INFO:
          return {
            ...state,
            isInfoUpdated: action.isInfoUpdated          
        };
        case SET_FILTER_IDS:
            return 1; 
        default:
          return state
      }
}





