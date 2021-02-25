import types from "./actionsTypes";
import API from "../../core/api";

export const setInteraction = (config) => (dispatch) => {
  const uuid = addInteraction(config);
  if ("sourceLayer" in config) {
    if (config.sourceLayer) {
      config.sourceLayer = config.sourceLayer.get("ol_uid");
    } else {
      const sourceLayer = getInteractionProxy(uuid).OLInteraction.get(
        "__VECTOR_SOURCE__"
      );
      config.sourceLayer = sourceLayer;
    }
  }
  if ("interactionConfig" in config) {
    delete config.interactionConfig;
  }
  if ("Layer" in config) {
    delete config.Layer;
  }
  config.uuid = uuid;

  const focusedmap = API.getFocusedMapProxy().uuid.value;
  dispatch({
    type: types.SET_INTERACTION,
    payload: {
      config,
      focusedmap,
    },
  });
};

export const setInteractions = (interactionsArray) => (dispatch) => {
  const newArray = [];
  interactionsArray.map((config) => {
    const uuid = addInteraction(config);
    if ("sourceLayer" in config) {
      if (config.sourceLayer) {
        config.sourceLayer = config.sourceLayer.get("ol_uid");
      } else {
        const sourceLayer = getInteractionProxy(uuid).OLInteraction.get(
          "__VECTOR_SOURCE__"
        );
        config.sourceLayer = sourceLayer;
      }
    }

    if ("interactionConfig" in config) {
      delete config.interactionConfig;
    }
    config.uuid = uuid;
    newArray.push(config);
  });

  const focusedmap = getFocusedMapProxy().uuid.value;
  dispatch({
    type: types.SET_INTERACTIONS,
    payload: {
      newArray,
      focusedmap,
    },
  });
};

export const unsetInteraction = (config) => (dispatch) => {
  removeInteraction(config.uuid);
  dispatch({
    type: types.UNSET_INTERACTION,
    payload: config,
  });
};

export const unsetInteractions = (interactionsArray) => (dispatch) => {
  const newArray = [];
  interactionsArray.map((config) => {
    removeInteraction(config.uuid);
    newArray.push(config);
  });
  dispatch({
    type: types.UNSET_INTERACTIONS,
    payload: newArray,
  });
};
