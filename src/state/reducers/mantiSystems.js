// import types from "../actions/types";
// import produce from "immer";
// import mantiIntersections from "../../configuration/mockData.json";
// const initialState = {
//   units: {
//     elements: mantiIntersections,
//     updatedIds: [],
//   },
//   falcon: {
//     elements: null,
//     updatedIds: [],
//   },
// };

// export default function (state = initialState, action) {
//   switch (action.type) {
//     case types.UPDATE_FEATURE_ATTRIBUTES:
//       var data = action.data;
//       var target = action.target;
//       var idSourceKey = action.idSourceKey;

//       return produce(state, (draft) => {
//         data.map(function (sourceItem) {
//           var obj = sourceItem;
//           var f = draft[target]["elements"][obj[idSourceKey]];
//           if (f) {
//             for (var prop in obj) {
//               if (!obj.hasOwnProperty(prop)) continue;
//               f[prop] = obj[prop];
//             }
//           }
//         });
//       });
//     case types.SET_UPDATED_IDS:
//       if (action.target) {
//         var ids = [];
//         if (action.data != null) {
//           //TODO change to dynamic key
//           ids = action.data.map((item) => item["id"]);
//           return produce(state, (draft) => {
//             draft[action.target]["updatedIds"] = ids;
//           });
//         }
//       } else return state;
//     default:
//       return state;
//   }
// }

export default function (state = {}, action) {
  return {};
}
