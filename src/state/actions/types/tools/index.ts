import {
  ToogleToolAction,
  ToogleToolByNameAction,
  ToggleGroupToolAction,
  InitToolsAction,
  ResetToolAction,
  SetToolFocusedAction,
  ToolResetedAction,
  UnsetUnfocusedAction,
} from "./actions";
export * from "./actionsTypes";

export type ToolsActions =
  | ToogleToolAction
  | ToogleToolByNameAction
  | ToggleGroupToolAction
  | InitToolsAction
  | ResetToolAction
  | SetToolFocusedAction
  | ToolResetedAction
  | UnsetUnfocusedAction;
