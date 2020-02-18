import { createSelector } from 'reselect'

const getUnits = state => state.mantiSystems.units.elements;
const updatedIds =  state => state.mantiSystems.units.updatedIds;


export const selectUnits = createSelector(
    [getUnits,updatedIds],
    (units,updatedIds) => {
        
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

     


    









