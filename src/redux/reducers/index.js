import { combineReducers } from "redux";
import mapLayers from "./layers";
import Tools from "./tools";
import mantiSystems from "./mantiSystems";
import ui from "./ui";

export default combineReducers({
  mapLayers,
  mantiSystems,
  Tools,
  ui,
  // filter
});
