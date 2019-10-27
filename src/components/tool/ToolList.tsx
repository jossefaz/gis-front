import React, { FunctionComponent } from "react";
import {ToolTask} from "./ToolTask"
import { Tool } from "../../models/tool";

export interface Props {  
  // onChange: (tool: Tool) => void;
  tools: Tool[];
}

// const handleTaskChange = (tool:Tool) => {
//   alert('test!');
// }

export const ToolList: FunctionComponent<Props> = ({
  use
  // onChange,
  tools
}) => (
  
    <ul>
      {tools.map(tool=> (
        <ToolTask tool={tool}></ToolTask>
      ))}
    </ul>
);


