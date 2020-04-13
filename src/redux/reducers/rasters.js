import types from "../actions/actionsTypes";
import produce from "immer";

export default function (state = {}, action) {
  switch (action.type) {
    case types.SET_RASTER:
      return produce(state, (draftState) => {
        draftState.Focused = action.payload;
      });

    case types.INIT_RASTER:
      return {
        Rasters: action.payload.Rasters,
        Focused: action.payload.Focused,
      };
    default:
      return state;
  }
}
