import { LogIt, logLevel } from "../../utils/logs";
import { GisState } from "../stateTypes";
import { Dispatch } from "redux";
import { ToolLifeCycleRegistry } from "../../core/types/tools";
export const defaultLifeCycle = async (
  dispatch: Dispatch,
  getState: () => GisState,
  ToolName: string,
  IsOpen: boolean
) => {
  let lifeMessage = IsOpen ? "Will be detroyed" : "Will be created";
  LogIt(logLevel.INFO, `${ToolName} : ${lifeMessage}`);
};

const Registry: ToolLifeCycleRegistry = {
  default: defaultLifeCycle,
};
export default Registry;
