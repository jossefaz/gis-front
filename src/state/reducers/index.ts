import { combineReducers } from "redux";
import Layers, * as fromLayers from "./layers";
import Interactions, * as fromInteractions from "./interactions";
import Overlays from "./overlay";
import Features, * as fromFeatures from "./features";
import Rasters from "./rasters";
import map from "./map";
import Tools, * as fromTool from "./tools";
import mantiSystems from "./mantiSystems";
import ui from "./ui";
import { GisState } from "../stateTypes";

export default combineReducers<GisState>({
  Layers,
  Features,
  Rasters,
  mantiSystems,
  map,
  Tools,
  Interactions,
  Overlays,
  ui,
  // filter
});

export const selectCurrentLayerUUID = (state: GisState) =>
  fromFeatures.selectCurrentLayerUUID(state);

export const selectVisibleLayers = (state: GisState) =>
  fromLayers.selectVisibleLayers(state);

export const selectSelectedFeatures = (state: GisState) =>
  fromFeatures.selectSelectedFeatures(state);

export const selectCurrentLayer = (state: GisState) =>
  fromFeatures.selectCurrentLayer(state);

export const selectSelectedFeatureInCurrentLayer = (state: GisState) =>
  fromFeatures.selectSelectedFeatureInCurrentLayer(state);

export const selectCurrentFeature = (state: GisState) =>
  fromFeatures.selectCurrentFeature(state);

export const selectCurrentMapLayers = (state: GisState) =>
  fromLayers.selectCurrentMapLayers(state);

export const selectSelectionLayers = (state: GisState) =>
  fromFeatures.selectSelectionLayers(state);

export const selectContextMenus = (state: GisState) =>
  fromFeatures.selectContextMenus(state);

export const selectCurrentInteractions = (state: GisState) =>
  fromInteractions.selectCurrentInteractions(state);

export const selectStickyTool = (state: GisState) =>
  fromTool.selectStickyTool(state);
export const selectDynamicTool = (state: GisState) =>
  fromTool.selectDynamicTool(state);

export const selectFocusedMapTools = (state: GisState) =>
  fromTool.selectFocusedMapTools(state);
