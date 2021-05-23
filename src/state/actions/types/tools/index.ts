import {
  ToogleToolAction,
  ToogleToolByNameAction,
  ToggleGroupToolAction,
  InitToolsAction,
  ResetToolAction,
  SetToolFocusedAction,
  ToolResetedAction,
  UnsetUnfocusedAction,
  DragToolAction,
  CloseDragToolAction,
  SetToolPosition,
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
  | UnsetUnfocusedAction
  | DragToolAction
  | CloseDragToolAction
  | SetToolPosition;
