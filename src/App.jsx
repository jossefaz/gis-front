import React, { Component } from 'react';
import ToolList from './components/tool/ToolList/ToolList.jsx';
import tools from './usefulgarbage/tools.json';
import VisibleMap from './containers/VisibleMap/VisibleMap.jsx';
import VisibleLayerList from './containers/VisibleLayerList/VisibleLayerList.jsx';

class App extends Component {

  render() {
        
    return (
      <div>
        {/* <div><ToolList tools={tools}></ToolList></div>             */}
        <div>
         <VisibleMap></VisibleMap>
         <VisibleLayerList></VisibleLayerList>
        </div>
      </div>

    )
  }
}

export default App;
