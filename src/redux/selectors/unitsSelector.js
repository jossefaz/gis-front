import { createSelector } from 'reselect'


const getUnits = state => state.featureAttributes.units









;

let regex =  new RegExp('[^]*');



//regex.test(str) // true


export const selectUnits = createSelector(
    [getUnits],
    (units) => {
        var f = units.filter(function (unit) {
            console.log("this is a unit:" + unit);         
            //return  unit["unit-id"] === 840
            return  regex.test(unit["unit-id"]);
            //return unit;
        });
        return f;
    }
)