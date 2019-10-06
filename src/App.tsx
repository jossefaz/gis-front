import React, { Component } from 'react';
import './App.css';
import {Tool} from "./models/tool";
import { ToolList } from './components/tool/ToolList';


interface State {
  tools:Tool[];
}



class App extends Component<{}, State> {
  state = {    
    tools: [
      {
        id: 1,
        name: "my first test",
        toolTip: "yes first test"
      },
      {
        id: 2,
        name: "my second test",
        toolTip : "second!"
      }
    ]
  };

  render() {
    // const handleTaskChange = (tool:Tool) => {
    //   alert(tool.id);
    // }
    
    return (
      <div>
        <h2>Hello React TS!</h2>
        <ToolList tools={this.state.tools}></ToolList>
      </div>
    );
  }
}

export default App;
