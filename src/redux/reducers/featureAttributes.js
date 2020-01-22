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
                
                // data.map(function(item){
                //     var f = draft[target].find(function (feature) {
                //         return feature[idTargetKey] === item[idSourceKey];
                //     }); 
                //     // console.log("target:" + f);
                //     // console.log("newMessage:" + item);
                //     // if(f){
                //     //     item[atrributeListKey].map(function(attribute){
                //     //          f[attribute[attributeKey]] = attribute[attributeValue]
                //     //     });                      
                //     // }
                //     return f;    
                return state;
            });         
            // return {
            //     ...state,
            //     units : action.data
            // }  
        

        
          case UPDATE_PUBLISHED_STATUS:
                return produce(state, draft => { 
                    
                    var arrayToUpdate = action.params[0].arrayToUpdate;
                    var target = action.params[0].target;
                    var idTargetKey = action.params[0].idTargetKey;
                    arrayToUpdate.map(function(item){
                        var itemToUpdate = draft[target].find(x => x[action.params[0].idTargetKey] == item[idTargetKey])
                        itemToUpdate["_isPublished"] = false;
                    })
                });
          default:
            return state
        }
  }
  