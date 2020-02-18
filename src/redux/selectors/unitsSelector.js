import { createSelector } from 'reselect'
import  {updatePublishedStatus}  from "../actions/actions";

const getUnits = state => state.featureAttributes.units;
const isInfoUpdated = state => state.filter.isInfoUpdated;
const updatedIds =  state => state.filter.ids;


export const selectUnits = createSelector(
    [getUnits,updatedIds,isInfoUpdated],
    (units,updatedIds,isInfoUpdated) => {
        
        if(updatedIds &&  updatedIds.length > 0){
            var arr =[];
            updatedIds.forEach(id => {
                if( units.hasOwnProperty(id))
                    arr.push(units[id]);
            });
        
        if(arr != undefined && arr.length > 0)
            return arr;
        else
            return null;      
        }
        else
            return null;
});

     


    









