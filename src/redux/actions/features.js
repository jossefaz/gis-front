import types from "./actionsTypes";
import { getEmptyVectorLayer, getDrawObject } from "../../utils/func";
export const setSelectedFeatures = (features) => (dispatch) =>
  dispatch({
    type: types.SET_SELECTED_FEATURES,
    payload: features,
  });


export const setCurrentFeature = (featureId) => (dispatch, getState) => {
  const Features = getState().Features.selectedFeatures;
  const currentFeature = Features.filter((feature) => feature.id == featureId);
  dispatch({
    type: types.SET_CURRENT_FEATURE,
    payload: currentFeature[0],
  });
};
