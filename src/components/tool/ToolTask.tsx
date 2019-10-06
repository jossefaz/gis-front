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
    const onClick = () => {
      //  onChange(tool);
    };

    const test = () =>{
        alert('single tool working!');
    }

    return (
        <div>
            {/* <input onClick={onClick} value={tool.toolTip}></input> */}
            <input type="button" onClick={test} value={tool.name} />
        </div>
    );
 
    // 
    
}

