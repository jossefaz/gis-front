import { combineReducers } from "redux";
import mapLayers from "./layers";
import Features from "./features";
import Rasters from "./rasters";
import map from "./map";
import Tools from "./tools";
import mantiSystems from "./mantiSystems";
import ui from "./ui";

export default combineReducers({
  mapLayers,
  Features,
  Rasters,
  mantiSystems,
  map,
  Tools,
  ui,
  // filter
});
