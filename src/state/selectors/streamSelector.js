import { createSelector } from 'reselect'

const getElements = (state,name) => state.streamingSystems[name].elements;
const getupdatedIds = (state,name) => state.streamingSystems[name].updatedIds;


export const streamingSystemSelector = createSelector([getElements, getupdatedIds],
    (elements, updatedIds) => {

        if (updatedIds && updatedIds.length > 0) {
            var arr = [];
            updatedIds.forEach(id => {
                if (elements.hasOwnProperty(id))
                    arr.push(elements[id]);
            });

            if (arr !== undefined && arr.length > 0)
                return arr;
            else
                return null;
        }
        else
            return null;
    });











