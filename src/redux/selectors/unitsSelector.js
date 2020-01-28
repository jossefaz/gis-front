import { createSelector } from 'reselect'
import  {updatePublishedStatus}  from "../actions/actions";

const getUnits = state => state.featureAttributes.units;
const isInfoUpdated = state => state.filter.isInfoUpdated;
const changedIds =  state => state.filter.ids;


export const selectUnits = createSelector(
    [getUnits,changedIds,isInfoUpdated],
    (units,changedIds,isInfoUpdated) => {
            
        // if(isInfoUpdated){
        if(changedIds &&  changedIds > 0){
            var arr = changedIds.map(id =>  {
                if(units[id] != undefined )   
                   return units[id];
            });
    
            if(arr[0] != undefined)
              return arr;
            else
               return null;      
        }
        else
            return null;
          
        // }
});

     


    









