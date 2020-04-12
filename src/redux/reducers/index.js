import { combineReducers } from "redux";
import mapLayers from "./layers";
import Tools from "./tools";
import mantiSystems from "./mantiSystems";

export default combineReducers({
  mapLayers,
  mantiSystems,
  Tools,
  // filter
});
