import { createSelector } from 'reselect'
import  {updatePublishedStatus}  from "../actions/actions";

const getUnits = state => state.featureAttributes.units;




const order = ['object1', 'object3'];


const reducer = (accumulator, currentValue) => currentValue;

export const selectUnits = createSelector(
    [getUnits],
    (units) => {
        var f = units.filter(function (unit) {
            if (unit["_isPublished"] === true){
                updatePublishedStatus({
                    "arrayToUpdate" : [unit] ,"target" : "units" , idTargetKey : "unit-id"
                })

                return true;
            }                
            return false;
           
        });
        return f;
})

    









