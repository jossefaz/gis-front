import types from "../actions/actionsTypes";
import produce from "immer";
import _ from "lodash";

const interactionsReducer = (state = {}, action) => {
  switch (action.type) {
    case types.SET_INTERACTION:
      return produce(state, (draftState) => {
        const { config, focusedmap } = action.payload;
        if (!(config.widgetName in draftState)) {
          draftState[config.widgetName] = {};
        }
        if (!(focusedmap in draftState[config.widgetName])) {
          draftState[config.widgetName][focusedmap] = {};
        }
        draftState[config.widgetName][focusedmap][config.Type] = config;
        draftState[config.widgetName][focusedmap][config.Type].status = 1;
      });

    case types.SET_INTERACTIONS:
      return produce(state, (draftState) => {
        const { newArray, focusedmap } = action.payload;
        newArray.map((config) => {
          if (!(config.widgetName in draftState)) {
            draftState[config.widgetName] = {};
          }
          if (!(focusedmap in draftState[config.widgetName])) {
            draftState[config.widgetName][focusedmap] = {};
          }
          draftState[config.widgetName][focusedmap][config.Type] = config;
          draftState[config.widgetName][focusedmap][config.Type].status = 1;
        });
      });
    case types.UNSET_INTERACTION:
      return produce(state, (draftState) => {
        const { uuid, widgetName, Type } = action.payload;
        Object.keys(draftState[widgetName]).map((mapId) => {
          if (draftState[widgetName][mapId][Type].uuid == uuid) {
            draftState[widgetName][mapId][Type].status = 0;
          }
        });
      });
    case types.UNSET_INTERACTIONS:
      return produce(state, (draftState) => {
        action.payload.map(({ uuid, widgetName, Type }) => {
          Object.keys(draftState[widgetName]).map((mapId) => {
            if (draftState[widgetName][mapId][Type].uuid == uuid) {
              draftState[widgetName][mapId][Type].status = 0;
            }
          });
        });
      });

    default:
      return state;
  }
};

export default interactionsReducer;

export const selectCurrentInteractions = (state) => {
  const { Interactions, map } = state;
  const result = {};
  if (Interactions) {
    Object.keys(Interactions).map((Widget_Owner) => {
      Object.keys(Interactions[Widget_Owner]).map((map_id) => {
        if (map_id == map.focused) {
          const filtered = _.pickBy(Interactions[Widget_Owner], (value, key) =>
            key.startsWith(map_id)
          );
          debugger;
          const filtered_active = _.pickBy(
            filtered[map_id],
            (value, key) => value.status == 1
          );

          console.log("filtered active", filtered_active);
          if (Object.keys(filtered_active).length > 0) {
            result[Widget_Owner] = filtered_active;
          }
        }
      });
    });
  }
  return result;
};
