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
          var ids = [];
          if(action.ids != null){
            //TODO change to dynamic key
            ids = action.ids.map(item => item["id"]);
          }
          return {
            ...state,
            ids : ids        
        }; 
        default:
          return state
      }
}





