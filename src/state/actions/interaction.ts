import { ActionTypes as types } from "./types/interactions";
import API from "../../core/api";
import { InteractionOptions } from "../../core/types/interaction";
import {
  SetInteractionAction,
  SetInteractionsAction,
  UnsetInteractionAction,
  UnsetInteractionsAction,
} from "./types/interactions/actions";
import { InteractionConfigStore } from "../../core/types";
import { Dispatch } from "redux";
import NessKeys from "../../core/keys";

export const setInteraction = (config: InteractionOptions) => (
  dispatch: Dispatch
) => {
  const uuid = API.interactions.addInteraction(config);
  if (uuid) config.uuid = uuid;
  if ("sourceLayer" in config && uuid) {
    if (config.sourceLayer) {
      config.sourceLayer = config.sourceLayer.get("ol_uid");
    } else {
      const proxy = API.interactions.getInteractionProxy(uuid);
      if (proxy && proxy.OLInteraction) {
        const sourceLayer = proxy.OLInteraction.get(NessKeys.VECTOR_SOURCE);
        config.sourceLayer = sourceLayer;
      }
    }
  }
  if ("interactionConfig" in config) {
    delete config.interactionConfig;
  }
  if ("Layer" in config) {
    delete config.Layer;
  }
  const focusedmap = API.map.getFocusedMapProxy().uuid.value;
  dispatch<SetInteractionAction>({
    type: types.SET_INTERACTION,
    payload: {
      config,
      focusedmap,
    },
  });
};

export const setInteractions = (interactionsArray: InteractionOptions[]) => (
  dispatch: Dispatch
) => {
  const interactionsPayloadArray: InteractionConfigStore[] = [];
  interactionsArray.map((config) => {
    const uuid = API.interactions.addInteraction(config);
    if ("sourceLayer" in config && uuid) {
      if (config.sourceLayer) {
        // Replace source layer by its id
        config.sourceLayer = config.sourceLayer.get("ol_uid");
      } else {
        const proxy = API.interactions.getInteractionProxy(uuid);
        if (proxy && proxy.OLInteraction) {
          const sourceLayer = proxy.OLInteraction.get(NessKeys.VECTOR_SOURCE);
          config.sourceLayer = sourceLayer;
        }
      }
    }
    if ("interactionConfig" in config) {
      delete config.interactionConfig;
    }
    if (uuid) {
      config.uuid = uuid;
    }
    interactionsPayloadArray.push(config);
  });
  const focusedmap = API.map.getFocusedMapProxy().uuid.value;
  dispatch<SetInteractionsAction>({
    type: types.SET_INTERACTIONS,
    payload: {
      interactionsPayloadArray,
      focusedmap,
    },
  });
};

export const unsetInteraction = (config: InteractionOptions) => (
  dispatch: Dispatch
) => {
  config.uuid && API.interactions.removeInteraction(config.uuid);
  dispatch<UnsetInteractionAction>({
    type: types.UNSET_INTERACTION,
    payload: config,
  });
};

export const unsetInteractions = (interactionsArray: InteractionOptions[]) => (
  dispatch: Dispatch
) => {
  const interactionsPayloadArray: InteractionConfigStore[] = [];
  interactionsArray.map((config) => {
    if (config.uuid) {
      API.interactions.removeInteraction(config.uuid);
      interactionsPayloadArray.push(config);
    }
  });
  dispatch<UnsetInteractionsAction>({
    type: types.UNSET_INTERACTIONS,
    payload: interactionsPayloadArray,
  });
};
