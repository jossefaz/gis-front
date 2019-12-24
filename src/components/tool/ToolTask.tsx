import React, { FunctionComponent } from "react";
import {Tool} from "../../models/tool";

interface Props{
    //onChange: (tool: Tool) => void;
    tool: Tool
}

export const ToolTask: FunctionComponent<Props> = ({
  //  onChange,
    tool
}) => {
   

    const test = () => {
        alert('single tool working!');
    }

    return (
        <div>            
            <input type="button" onClick={test} value={tool.ToolName} />
        </div>
    );
}

