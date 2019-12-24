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
import {ToolList} from './components/tool/ToolList';
import tools from './usefulgarbage/tools.json';

interface State {
  tools:Tool[];
  map : Map
}

class App extends Component<{}, State> {
  

render() {
  
  return (
      <div>       
        <ToolList tools={tools}></ToolList>
      </div>
  )
}
 
}

export default App;
