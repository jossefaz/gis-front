import types from "./actionsTypes";

export const toogleSideNav = () => (dispatch) =>
  dispatch({
    type: types.TOGGLE_SIDENAV,
  });

export const setOverlay = (names, overlays) => (dispatch) => {
  dispatch({
    type: types.SET_OVERLAY,
    payload: { names, overlays },
  });
};

export const addOverlay = (overlays) => (dispatch) => {
  dispatch({
    type: types.ADD_OVERLAYS,
    payload: overlays,
  });
};
