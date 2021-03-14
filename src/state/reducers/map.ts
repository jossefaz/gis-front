import types from "../actions/types";
import produce from "immer";
import { MapState } from "../stateTypes";
import { Actions } from "../actions/types";

const initialLayersState = {
  uuids: [],
  focused: "",
};

const reducer = (
  state: MapState = initialLayersState,
  action: Actions
): MapState => {
  switch (action.type) {
    case types.INIT_MAP:
      return produce(state, (draftState) => {
        draftState.uuids.push(action.payload);
        draftState.focused = action.payload;
      });
    case types.SET_MAP_FOCUSED:
      return produce(state, (draftState) => {
        draftState.focused = action.payload;
      });
    default:
      return state;
  }
};
export default reducer;
