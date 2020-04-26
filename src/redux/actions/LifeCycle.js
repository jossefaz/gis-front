import { closeDrawSessionAsync } from "./features";
import { LogIt, logLevel } from "../../utils/logs";
export const defaultLifeCycle = (dispatch, ToolName, IsOpen) => {
  let lifeMessage = IsOpen ? "Will be detroyed" : "Will be created";
  LogIt(logLevel.INFO, `${ToolName} : ${lifeMessage}`);
};
export default {
  CloseDrawSession: closeDrawSessionAsync,
  default: defaultLifeCycle,
};
