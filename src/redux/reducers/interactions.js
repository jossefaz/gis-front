import types from "../actions/actionsTypes";
import produce from "immer";

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
