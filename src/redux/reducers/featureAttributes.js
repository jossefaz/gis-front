import {
    UPDATE_FEATURE_ATTRIBUTES   
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
            var atrributeListKey = action.atrributeListKey;
            var attributeKey = action.attributeKey;
            var attributeValue = action.attributeValue;
            
            return produce(state, draft => {
                
                data.map(function(item){
                    var f = draft[target].find(function (feature) {
                        return feature[idTargetKey] === item[idSourceKey];
                    }); 
                    console.log("target:" + f);
                    console.log("newMessage:" + item);
                    if(f){
                        item[atrributeListKey].map(function(attribute){
                             f[attribute[attributeKey]] = attribute[attributeValue]
                        });
                    }
                });             
      });
          default:
            return state
        }
  }
  