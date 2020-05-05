import types from "../actions/actionsTypes";
import produce from "immer";

const initialState = {
  sideNavOpen: false,
  overlays: {
    Catalog: {},
    status: {},
  },
};
const uiReducer = (state = initialState, action) => {
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
