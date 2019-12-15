import React, { FunctionComponent } from "react";
import {ToolTask} from "./ToolTask"
import { Tool } from "../../models/tool";

export interface Props {  
  // onChange: (tool: Tool) => void;
  tools: Tool[];
}

export const ToolList: FunctionComponent<Props> = ({ 
  // onChange,
  tools,
}) => (
  
    <ul>
      {tools.map(tool=> (
        <ToolTask tool={tool}></ToolTask>
      ))}
    </ul>
);


