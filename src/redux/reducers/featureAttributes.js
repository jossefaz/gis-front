import {
    UPDATE_FEATURE_ATTRIBUTES,
    UPDATE_PUBLISHED_STATUS   
  } from '../actions/actionsTypes';
  import produce from 'immer';
  import mantiIntersections from '../../usefulgarbage/mantiIntersections.json';
 
  

  const initialState = {
    units: mantiIntersections
  };
  
  export default function (state = initialState, action){
      
      switch (action.type) {
          case UPDATE_FEATURE_ATTRIBUTES:
            var data = action.data;
            var target = action.target;       
            var idTargetKey = action.idTargetKey;
            var idSourceKey = action.idSourceKey;
            
            return produce(state, draft => {
                  data.map(function(sourceItem){
                    var obj = sourceItem;
                    var f = draft[target][obj[idSourceKey]];
                    if(f){
                      for (var prop in obj) {                 
                        if (!obj.hasOwnProperty(prop)) continue;
                        f[prop] =  obj[prop]
                    }  
                  }               
            }); 
          }); 
          default:
            return state
        }
  }
  