import types from "../actions/types";
import produce from "immer";
import { UiState } from "../types/ui"

const initialState = {
  sideNavOpen: false,
  overlays: {
    Catalog: {},
    status: {},
  },
};
const uiReducer = (state: UiState = initialState, action): UiState => {
  switch (action.type) {
    case types.TOGGLE_SIDENAV:
      return produce(state, (draftState) => {
        const IsOpen = draftState.sideNavOpen;
        draftState.sideNavOpen = !IsOpen;
      });

    default:
      return state;
  }
};

export default uiReducer;
