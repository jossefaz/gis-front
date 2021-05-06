import { createCachedSelector } from "re-reselect";
import { createSelector } from "reselect";

// const getStreamingSystems = (state) => state.streamingSystems;

// export const streamingSystemSelector = new createCachedSelector(
//   [getStreamingSystems, (_state, system) => system],
//   (StreamingSystems, system) => {
//     let updatedIds = StreamingSystems[system].updatedIds;
//     let elements = StreamingSystems[system].elements;
//     if (updatedIds && updatedIds.length > 0) {
//       var arr = [];
//       updatedIds.forEach((id) => {
//         if (elements.hasOwnProperty(id)) arr.push(elements[id]);
//       });

//       if (arr !== undefined && arr.length > 0) return arr;
//       else return null;
//     } else return null;
//   }
// )((_state, system) => system);

const getElements = (state, name) => state.streamingSystems[name].elements;
const getupdatedIds = (state, name) => state.streamingSystems[name].updatedIds;

export const streamingSystemSelector = () => {
  return createSelector(
    [getElements, getupdatedIds],
    (elements, updatedIds) => {
      // console.log("elements in selector:" + updatedIds);

      if (updatedIds && updatedIds.length > 0) {
        var arr = [];
        updatedIds.forEach((id) => {
          if (elements.hasOwnProperty(id)) arr.push(   elements[id]);
        });

        if (arr !== undefined && arr.length > 0) return arr;
        else return null;
      } else return null;
    }
  );
};
