import { createSelector } from 'reselect'


const getUnits = state => state.featureAttributes.units;



const order = ['object1', 'object3'];


const reducer = (accumulator, currentValue) => currentValue;

export const selectUnits = createSelector(
    [getUnits],
    (units) => {
        var f = units.filter(function (unit) {
            if (unit["isPublished"] === true){
                unit["isPublished"] = false;
                return true;
            }                
            return false;
           
        });
        return f;
})

    









