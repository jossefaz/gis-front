import { combineReducers } from "redux";
import mapLayers from "./layers";
import Rasters from "./rasters";
import Tools from "./tools";
import mantiSystems from "./mantiSystems";
import ui from "./ui";

export default combineReducers({
  mapLayers,
  Rasters,
  mantiSystems,
  Tools,
  ui,
  // filter
});
