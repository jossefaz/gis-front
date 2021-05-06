import types from "../actions/types";
import produce from "immer";
const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_FEATURE_ATTRIBUTES:
      const {
        data,
        target,
        messageItemIdFieldName,
        symbologyCalculation,
        system
      } = action.payload;

      return produce(state, (draft) => {
        data.map(function (sourceItem) {
          var obj = sourceItem;
          var f = draft[target]["elements"][system + "." + obj[messageItemIdFieldName]];
          if (f) {
            for (var prop in obj) {
              if (!obj.hasOwnProperty(prop)) continue;
              f[prop] = obj[prop];
            }

            f["symbol_calculation_result"] = eval(symbologyCalculation);
          }
        });
      });
      break;
    case types.SET_UPDATED_IDS:
      if (action.payload.target) {
        var ids = [];
        if (action.payload.data != null) {
          ids = action.payload.data.map((item) =>  action.payload.system + "." + item["id"]);
          return produce(state, (draft) => {
            draft[action.payload.target]["updatedIds"] = ids;
          });
        } else return state;
      } else return state;
      break;

    case types.INIT_STREAMING_SYSTEM:
      if (action.payload.target) {
        const { data, target, geoJoinFieldName, adaptorId } = action.payload;
        //system dosent exists create one
        if (!state[target])
          state = { ...state, [target]: { elements: null, updatedIds: [] } };

        var streamingSystemObject = {};
        if (data) {
          data.forEach((element) => {
            streamingSystemObject[
          element["adaptorId"] + "." +   element[geoJoinFieldName]
            ] = element;
          });
          return produce(state, (draft) => {
            draft[target]["elements"] = streamingSystemObject;
          });
        }
      }
      break;
    default:
      return state;
  }
}
