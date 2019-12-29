import React, { Component } from "react";
import ToolTask from "./ToolTask.jsx";

class  ToolList extends Component {
  
  render() {
  const  {
      tools
  } = this.props

  return (  
    <ul>
    {tools.map(tool=> (
      <li key = {tool.Id}>          
          <ToolTask tool={tool}></ToolTask>
      </li>
    ))}
  </ul>
  );
  }
}
export default ToolList;

