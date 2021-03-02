import types from "../actions/types";
import produce from "immer";
import { RasterState } from "../stateTypes";
import { Actions } from "../actions/types";

const initialState: RasterState = {
  Catalog: {},
  Focused: null,
};
const reducer = (
  state: RasterState = initialState,
  action: Actions
): RasterState => {
  switch (action.type) {
    case types.SET_RASTER:
      return produce(state, (draftState) => {
        draftState.Focused = action.payload;
      });

    case types.INIT_RASTER:
      return action.payload;
    default:
      return state;
  }
};
export default reducer;
