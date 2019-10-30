import React, { Component } from 'react';
import './App.css';
import {Tool} from "./models/tool";
import MapComponent from './components/map/MapComponent';
import AddTodo from './components/test/testComponent';

// Open Layers Imports
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM,} from 'ol/source.js';
import View from 'ol/View.js';
import Map from 'ol/Map.js';
import 'ol/ol.css';



interface State {
  tools:Tool[];
  map : Map
}




class App extends Component<{}, State> {

  onClick = () => {    
    alert("my test");
  };

  
  
  
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
    map:  new Map({
      layers: [
          new TileLayer({
              source: new OSM()
          })
      ],
      target: 'map',
      view: new View({
          center: [0, 0],
          zoom: 2
      })
  }) 
};

render() {
  
  return (
      <div>
        <AddTodo></AddTodo>
        <input type="button" onClick={this.onClick}></input>          
        <MapComponent></MapComponent>
      </div>
  )
}
 
}

export default App;
