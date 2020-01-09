import { createSelector } from 'reselect'


const getUnits = state => state.featureAttributes.units;



const order = ['object1', 'object3'];


const reducer = (accumulator, currentValue) => currentValue;

// 1 + 2 + 3 + 4

//const selector = (...args) => args.reduce((prev, curr) => ({...prev, [curr["unit-id"]]: curr}), {});

export const selectUnits = createSelector(
    [getUnits],
    (units) => {
        var f = units.filter(function (unit) {                
            return  unit["isPublished"] === true
           
        });
        return f;
    })

    









