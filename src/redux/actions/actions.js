export const setFilterIds = (target, data) => {
  return {
    type: SET_UPDATED_IDS,
    data: data,
    target: target,
  };
};

export const updateFeatureAttributes = (
  JSONFeatureList,
  target,
  idSourceKey
) => {
  return {
    type: UPDATE_FEATURE_ATTRIBUTES,
    data: JSONFeatureList,
    target: target,
    idSourceKey: idSourceKey,
  };
};
