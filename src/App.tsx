import React, { Component } from 'react';
import './App.css';
import {Tool} from "./models/tool";
import MapComponent from './components/map/MapComponent';


interface State {
  tools:Tool[];
//  map : Map
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
    ],
 
};

  render() {
   
    return (
        <div>
          <MapComponent></MapComponent>
        </div>
    )
  }
 
}

export default App;
