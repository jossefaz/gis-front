import types from "../actions/types";
import produce from "immer";
import { RasterState } from "../types/raster";

const initialState: RasterState = {
  Catalog: {},
  Focused: null
}
const reducer = (state: RasterState = initialState, action): RasterState => {
  switch (action.type) {
    case types.SET_RASTER:
      return produce(state, (draftState) => {
        draftState.Focused = action.payload;
      });

    case types.INIT_RASTER:
      return {
        Catalog: action.payload.Rasters,
        Focused: action.payload.Focused,
      };
    default:
      return state;
  }
}
export default reducer;