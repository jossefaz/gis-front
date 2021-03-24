import {
  SetInteractionAction,
  SetInteractionsAction,
  UnsetInteractionAction,
  UnsetInteractionsAction,
} from "./actions";
export type InteractionActions =
  | SetInteractionAction
  | SetInteractionsAction
  | UnsetInteractionAction
  | UnsetInteractionsAction;

export * from "./actionsTypes";
