import { Dispatch } from "redux";
import { GisState } from "../../state/stateTypes";

export interface ToolMetadata {
  Id: string;
  ToolName: string;
  ToolTip: string;
  ToolImage: string;
  ToolIcon: string;
  ToolActionInvoker: string;
  ToolInvokerType: number;
  ToolTypeID: number;
  OnCreate: string;
  OnDestroy: string;
  ToolParams: string;
  ToolLocation: string;
  Order: number;
  IsAGroup: number;
  ToolGroupId: number;
  ToolContainer: string;
  IsOpen: boolean;
}

export interface GroupMetadata {
  Id: string;
  GroupContainer: string;
  GroupName: string;
  GroupImage: string;
  IsOpen: boolean;
  tools?: string[];
}

export interface ToolConfig {
  tools: ToolMetadata[];
  groups: GroupMetadata[];
}

export interface ToolLifeCycleRegistry {
  [lifeCycleFunctionName: string]: (
    dispatch: Dispatch,
    getState: () => GisState,
    ToolName: string,
    IsOpen: boolean
  ) => void;
}
