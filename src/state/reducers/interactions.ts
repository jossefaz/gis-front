import types from "../actions/types";
import { InteractionState } from "../stateTypes";
import { InteractionConfigStore } from "../../core/types";
import { Actions } from "../actions/types";
import { GisState } from "../stateTypes";
import produce from "immer";
import _, { Dictionary } from "lodash";
import { WritableDraft } from "immer/dist/internal";

const interactionsReducer = (
  state: InteractionState = {},
  action: Actions
): InteractionState => {
  switch (action.type) {
    case types.SET_INTERACTION:
      return produce(state, (draftState) => {
        const { config, focusedmap } = action.payload;
        const widgetName = config.widgetName;
        if (widgetName) {
          if (!(widgetName in draftState)) {
            draftState[widgetName] = {};
          }
          if (!(focusedmap in draftState[widgetName])) {
            draftState[widgetName][focusedmap] = {};
          }
          draftState[widgetName][focusedmap][config.Type] = config;
          const interactionConfig = <WritableDraft<InteractionConfigStore>>(
            draftState[widgetName][focusedmap][config.Type]
          );
          interactionConfig.status = 1;
        }
      });

    case types.SET_INTERACTIONS:
      return produce(state, (draftState) => {
        const { interactionsPayloadArray, focusedmap } = action.payload;
        interactionsPayloadArray.map((config) => {
          const widgetName = config.widgetName;
          if (widgetName) {
            if (!(widgetName in draftState)) {
              draftState[widgetName] = {};
            }
            if (!(focusedmap in draftState[widgetName])) {
              draftState[widgetName][focusedmap] = {};
            }
            draftState[widgetName][focusedmap][config.Type] = config;
            const interactionConfig = <WritableDraft<InteractionConfigStore>>(
              draftState[widgetName][focusedmap][config.Type]
            );
            interactionConfig.status = 1;
          }
        });
      });
    case types.UNSET_INTERACTION:
      return produce(state, (draftState) => {
        const { uuid, widgetName, Type } = action.payload;
        if (widgetName) {
          Object.keys(draftState[widgetName]).map((mapId) => {
            const interactionConfig = <WritableDraft<InteractionConfigStore>>(
              draftState[widgetName][mapId][Type]
            );
            if (interactionConfig.uuid == uuid) {
              interactionConfig.status = 0;
            }
          });
        }
      });
    case types.UNSET_INTERACTIONS:
      return produce(state, (draftState) => {
        action.payload.map(({ uuid, widgetName, Type }) => {
          if (widgetName) {
            Object.keys(draftState[widgetName]).map((mapId) => {
              const interactionConfig = <WritableDraft<InteractionConfigStore>>(
                draftState[widgetName][mapId][Type]
              );
              if (interactionConfig.uuid == uuid) {
                interactionConfig.status = 0;
              }
            });
          }
        });
      });

    default:
      return state;
  }
};

export default interactionsReducer;

export const selectCurrentInteractions = (state: GisState) => {
  const { Interactions, map } = state;
  let result: {
    [widgetOwner: string]: Dictionary<InteractionConfigStore>;
  } = {};
  if (Interactions) {
    Object.keys(Interactions).map((Widget_Owner) => {
      Object.keys(Interactions[Widget_Owner]).map((map_id) => {
        if (map_id == map.focused) {
          const filtered = _.pickBy(Interactions[Widget_Owner], (value, key) =>
            key.startsWith(map_id)
          );
          const filtered_active = _.pickBy(
            filtered[map_id],
            (value, key) => value.status == 1
          );

          if (Object.keys(filtered_active).length > 0) {
            result[Widget_Owner] = filtered_active;
          }
        }
      });
    });
  }
  return result;
};
