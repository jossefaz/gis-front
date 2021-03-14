import { MapsToolState } from "../../../stateTypes";
import { ToolMetadata, GroupMetadata } from "../../../../core/types";
import { ActionTypes } from "./actionsTypes";

interface ToogleToolActionPayload {
  ToolId: string;
  forceOpen: boolean;
  forceClose: boolean;
  mapId: string;
}
interface ToggleGroupToolPayload {
  GroupToolId: string;
  mapId: string;
}

interface SetToolFocusedPayload {
  ToolId: string;
  mapId: string;
}

interface UnsetUnfocusedPayload {
  ToolId: string;
  mapId: string;
}

interface DragToolPayload {
  ToolId: string;
  mapId: string;
}

interface ResetToolPayload {
  tools: string[];
  mapId: string;
}

interface InitToolsActionPayload {
  gTools: MapsToolState;
  mapId: string;
  blueprint: {
    tools: { [toolId: string]: ToolMetadata };
    Groups: { [groupId: string]: GroupMetadata };
  };
}

export interface ToogleToolAction {
  type: ActionTypes.TOGGLE_STICKY_TOOLS;
  payload: ToogleToolActionPayload;
}

export interface CloseDragToolAction {
  type: ActionTypes.CLOSE_DRAG_TOOLS;
  payload: ToogleToolActionPayload;
}

export interface ToogleToolByNameAction {
  type: ActionTypes.TOGGLE_STICKY_TOOLS;
  payload: ToogleToolActionPayload;
}

export interface ToggleGroupToolAction {
  type: ActionTypes.TOGGLE_GROUP_TOOLS;
  payload: ToggleGroupToolPayload;
}

export interface SetToolFocusedAction {
  type: ActionTypes.SET_TOOL_FOCUSED;
  payload: SetToolFocusedPayload;
}

export interface UnsetUnfocusedAction {
  type: ActionTypes.UNSET_UNFOCUSED_TOOL;
  payload: UnsetUnfocusedPayload;
}

export interface ResetToolAction {
  type: ActionTypes.RESET_TOOLS;
  payload: ResetToolPayload;
}

export interface ToolResetedAction {
  type: ActionTypes.TOOL_RESETED;
  payload: string;
}

export interface DragToolAction {
  type: ActionTypes.DRAG_TOOL;
  payload: DragToolPayload;
}

export interface InitToolsAction {
  type: ActionTypes.INIT_TOOLS;
  payload: InitToolsActionPayload;
}
