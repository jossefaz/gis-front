import {
    UPDATE_FEATURE_ATTRIBUTES,
    SET_UPDATED_IDS   
  } from '../actions/actionsTypes';
  import produce from 'immer';
  const initialState = {
    units: {
      elements : {},
      updatedIds : []
    },
    falcon : {
      elements : null,
      updatedIds : []
    }
  };
  
  export default function (state = initialState, action){
      
      switch (action.type) {
          case UPDATE_FEATURE_ATTRIBUTES:
            var data = action.data;
            var target = action.target;             
            var idSourceKey = action.idSourceKey;
            
            return produce(state, draft => {
                  data.map(function(sourceItem){
                    var obj = sourceItem;
                    var f = draft[target]["elements"][obj[idSourceKey]];
                    if(f){
                      for (var prop in obj) {                 
                        if (!obj.hasOwnProperty(prop)) continue;
                        f[prop] =  obj[prop]
                    }  
                  }               
            }); 
          });
          case SET_UPDATED_IDS:
            if(action.target){
                var ids = [];
                if(action.data != null){
                  
                  //TODO change to dynamic key
                  ids = action.data.map(item => item["id"]);
                  return produce(state, draft => {
                     draft[action.target]["updatedIds"] = ids;
                  }); 
                }
              }
              else
                return state; 
          default:
            return state
        }
  }
  