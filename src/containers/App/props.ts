import { Dispatch } from "redux";
import { GisState } from "../../state/stateTypes";
import { ToolConfig } from "../../core/types";
import { MapState } from "../../state/stateTypes";

export default interface OwlWebUiProps {
  InitRasters: () => (dispatch: Dispatch) => void;
  InitMap: () => (dispatch: Dispatch, getState: () => GisState) => void;
  InitTools: (ToolConfig: ToolConfig) => (dispatch: Dispatch) => void;
  InitLayers: () => (dispatch: Dispatch) => Promise<void>;
  mapState: MapState;
}
