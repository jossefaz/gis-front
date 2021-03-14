import types from "../actions/types";
import produce from "immer";
import { UiState } from "../stateTypes";
import { Actions } from "../actions/types";

const initialState = {
  sideNavOpen: false,
};
const uiReducer = (state: UiState = initialState, action: Actions): UiState => {
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
