import { combineReducers } from "redux";
import Layers, * as fromLayers from "./layers";
import Interactions from "./interactions";
import Overlays from "./overlay";
import Features, * as fromFeatures from "./features";
import Rasters from "./rasters";
import map from "./map";
import Tools from "./tools";
import mantiSystems from "./mantiSystems";
import ui from "./ui";

export default combineReducers({
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

export const selectCurrentLayerUUID = (state) =>
  fromFeatures.selectCurrentLayerUUID(state);

export const selectVisibleLayers = (state) =>
  fromLayers.selectVisibleLayers(state);

export const selectSelectedFeatures = (state) =>
  fromFeatures.selectSelectedFeatures(state);

export const selectCurrentLayer = (state) =>
  fromFeatures.selectCurrentLayer(state);

export const selectSelectedFeatureInCurrentLayer = (state) =>
  fromFeatures.selectSelectedFeatureInCurrentLayer(state);

export const selectCurrentFeature = (state) =>
  fromFeatures.selectCurrentFeature(state);
