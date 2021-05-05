import types from "./types";

export const setFilterIds = (target, data,system) => {
  return {
    type: types.SET_UPDATED_IDS,
    payload: { data, target ,system},
  };
};

export const updateFeatureAttributes = (
  JSONFeatureList,
  target,
  messageItemIdFieldName,
  symbologyCalculation,
  system
) => {
  return {
    type: types.UPDATE_FEATURE_ATTRIBUTES,
    payload: {
      data: JSONFeatureList,
      target: target,
      messageItemIdFieldName: messageItemIdFieldName,
      symbologyCalculation: symbologyCalculation,
      system : system 
    },
  };
};

export const StreamingSystem = (
  JSONFeatureList,
  target,
  geoJoinFieldName,
  adaptorId
) => {
  return {
    type: types.INIT_STREAMING_SYSTEM,
    payload: {
      data: JSONFeatureList,
      target: target,
      geoJoinFieldName: geoJoinFieldName,
    },
  };
};
