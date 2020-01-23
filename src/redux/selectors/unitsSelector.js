import { createSelector } from 'reselect'
import  {updatePublishedStatus}  from "../actions/actions";

const getUnits = state => state.featureAttributes.units;
const isInfoUpdated = state => state.filter.isInfoUpdated;
const changedIds =  state => state.filter.ids;


export const selectUnits = createSelector(
    [getUnits,changedIds,isInfoUpdated],
    (units,changedIds,isInfoUpdated) => {
            
        if(isInfoUpdated){
            return changedIds.map(id =>  {
                return units[id]
        });
        }
});

     


    









