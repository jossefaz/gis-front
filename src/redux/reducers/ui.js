import types from "../actions/actionsTypes";
import produce from "immer";

const uiReducer = (state = {}, action) => {
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
