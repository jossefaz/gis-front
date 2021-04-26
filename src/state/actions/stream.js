import types from "./types";

export const setFilterIds = (target, data) => {
  return {
    type: types.SET_UPDATED_IDS,
    payload: { data, target },
  };
};

export const updateFeatureAttributes = (
  JSONFeatureList,
  target,
  messageItemIdFieldName,
  symbologyCalculation
) => {
  return {
    type: types.UPDATE_FEATURE_ATTRIBUTES,
    payload: {
      data: JSONFeatureList,
      target: target,
      messageItemIdFieldName: messageItemIdFieldName,
      symbologyCalculation: symbologyCalculation,
    },
  };
};

export const StreamingSystem = (JSONFeatureList, target, geoJoinFieldName) => {
  return {
    type: types.INIT_STREAMING_SYSTEM,
    payload: {
      data: JSONFeatureList,
      target: target,
      geoJoinFieldName: geoJoinFieldName,
    },
  };
};
