import types from "./actionsTypes";
export const setFilterIds = (target, data) => {
    return {
        type: types.SET_UPDATED_IDS,
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
        type: types.UPDATE_FEATURE_ATTRIBUTES,
        data: JSONFeatureList,
        target: target,
        idSourceKey: idSourceKey,
    };
};