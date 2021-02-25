import { ActionTypes } from "./actionsTypes";
import { InteractionConfigStore } from "../../../types/interactions";

interface SetInteractionActionPayload {
  config: InteractionConfigStore;
  focusedmap: string;
}

interface SetInteractionsActionPayload {
  interactionsPayloadArray: InteractionConfigStore[];
  focusedmap: string;
}

// ACTION DISPATCH

export interface SetInteractionAction {
  type: ActionTypes.SET_INTERACTION;
  payload: SetInteractionActionPayload;
}

export interface SetInteractionsAction {
  type: ActionTypes.SET_INTERACTIONS;
  payload: SetInteractionsActionPayload;
}

export interface UnsetInteractionAction {
  type: ActionTypes.UNSET_INTERACTION;
  payload: InteractionConfigStore;
}

export interface UnsetInteractionsAction {
  type: ActionTypes.UNSET_INTERACTIONS;
  payload: InteractionConfigStore[];
}
