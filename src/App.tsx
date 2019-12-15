import React, { Component } from 'react';
import './App.css';
import {Tool} from "./models/tool";

// import AddTodo from './components/test/testComponent';

// Open Layers Imports
import {Tile as TileLayer} from 'ol/layer.js';
import {OSM,} from 'ol/source.js';
import View from 'ol/View.js';
import Map from 'ol/Map.js';
import 'ol/ol.css';
import VisibleMap from './containers/VisibleMap'

interface State {
  tools:Tool[];
  map : Map
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
        <VisibleMap/>
      </div>
  )
}
 
}

export default App;
