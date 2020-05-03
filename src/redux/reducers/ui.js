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
    case types.SET_OVERLAY:
      return produce(state, (draftState) => {
        draftState.overlays.Catalog = Object.assign(
          draftState.overlays,
          action.payload.overlays
        );
        action.payload.names.map(
          (overlay) => (draftState.overlays.status[overlay] = 0)
        );
      });

    case types.ADD_OVERLAYS:
      return produce(state, (draftState) => {
        action.payload.map(
          (overlay) => (draftState.overlays.status[overlay] = 1)
        );
      });

    default:
      return state;
  }
};

export default uiReducer;
