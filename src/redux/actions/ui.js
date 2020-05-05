import types from "./actionsTypes";

export const toogleSideNav = () => (dispatch) =>
  dispatch({
    type: types.TOGGLE_SIDENAV,
  });
