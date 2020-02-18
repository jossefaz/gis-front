import {
    SET_UPDATED_IDS,
} from '../actions/actionsTypes';
import produce from 'immer';

  const initialState = {
      updatedIds : []
  };


  export default function (state = initialState, action){
    switch (action.type) {
        case SET_UPDATED_IDS:
          
        // if(action.target){
        //     var ids = [];
        //     if(action.data != null){
        //       //TODO change to dynamic key
        //       ids = action.data.map(item => item["id"]);

        //       return produce(state, draft => {
                
        //          draft[target]["updatedIds"] = ids;
        //       }); 
        //     }
        //   }
        //   else
            return state;
        default:
          return state
      }
}





