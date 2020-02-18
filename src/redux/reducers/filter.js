import {
    SET_UPDATED_IDS,
} from '../actions/actionsTypes';

  const initialState = {
      ids : []
  };


  export default function (state = initialState, action){
    switch (action.type) {
        case SET_UPDATED_IDS:
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





