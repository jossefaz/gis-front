import types from "./actionsTypes";
import { getEmptyVectorLayer, getDrawObject } from "../../utils/func";
export const setSelectedFeatures = (features) => (dispatch) =>
  dispatch({
    type: types.SET_SELECTED_FEATURES,
    payload: features,
  });

export const openDrawSession = (drawType) => (dispatch, getState) => {
  //First close the current session
  closeDrawSessionAsync(dispatch, getState).then((state) => {
    const { source, vector: Layer } = getEmptyVectorLayer();
    let Session = true;
    let DrawObject = getDrawObject(source, drawType);
    dispatch({
      type: types.OPEN_DRAW_SESSION,
      payload: { Session, Layer, DrawObject },
    });
  });
};

export const closeDrawSession = () => (dispatch, getState) => {
  _safelyAbortDrawing(getState);
  dispatch({
    type: types.CLOSE_DRAW_SESSION,
  });
};

export const closeDrawSessionAsync = (dispatch, getState) => {
  _safelyAbortDrawing(getState);
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.CLOSE_DRAW_SESSION,
    });
    resolve();
  });

}

const _safelyAbortDrawing = (getState) => {
  let DrawObject = getState().Features.Draw.DrawObject
  if (DrawObject) {
    DrawObject.abortDrawing();
  }
}



export const setCurrentFeature = (featureId) => (dispatch, getState) => {
  const Features = getState().Features.selectedFeatures;
  const currentFeature = Features.filter((feature) => feature.id == featureId);
  dispatch({
    type: types.SET_CURRENT_FEATURE,
    payload: currentFeature[0],
  });
};
