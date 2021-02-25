import { ActionTypes } from "./actionsTypes";
import { InteractionConfigStore } from "../../../types/interactions";

interface SetInteractionActionPayload {
  config: InteractionConfigStore;
  focusedmap: string;
}

// ACTION DISPATCH

export interface SetInteractionAction {
  type: ActionTypes.SET_INTERACTION;
  payload: SetInteractionActionPayload;
}
