import React, { Component } from 'react';
import './App.css';

import ToolList from './components/tool/ToolList.jsx';
import tools from './usefulgarbage/tools.json';
import channels from './usefulgarbage/channels.json'

import VisibleMap from './containers/VisibleMap';
import { fetchData } from './comm/apiManager.js'
import LayerList from './components/layers/LayerList';
import './general.css';

class App extends Component {

  constructor(props) {

    super(props);

  // var layers = fetchData({
  //     url: "https://localhost:5001/",
  //     functionName: "MetaData",
  //     method: "Get"
  //   });
    
  //   console.log(layers);
  }

  render() {

    console.log("channels:" + channels[0]);

    console.log(tools);
    return (
      <div>
        {/* <div><ToolList tools={tools}></ToolList></div>             */}
        <div className="rowC">
         <VisibleMap></VisibleMap>
         <LayerList></LayerList>
        </div>
      </div>
    )
  }
}

export default App;
