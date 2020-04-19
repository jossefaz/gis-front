import types from "./actionsTypes";

export const setSelectedFeatures = (features) => (dispatch) =>
  dispatch({
    type: types.SET_SELECTED_FEATURES,
    payload: features,
  });
