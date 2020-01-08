import { createSelector } from 'reselect'


const getUnits = state => state.featureAttributes.units









;

//let regex = '[^]*'


//regex.test(str) // true


export const selectUnits = createSelector(
    [getUnits],
    (units) => {
        var f = units.find(function (unit) {
            console.log("this is a unit:" + unit);         
            return  unit["unit-id"] === 840
            //return  regex.test(str) 
            return unit;
        });
        return f;
     
    }
  )