import {
  combineReducers
} from "redux";
import Layers from "./layers";
import Interactions from "./interactions"
import Overlays from "./overlay"
import Features from "./features";
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