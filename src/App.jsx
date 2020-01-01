import React, { Component } from 'react';
import './App.css';

 import ToolList from './components/tool/ToolList.jsx';
 import tools from './usefulgarbage/tools.json';
import MapComponent from './components/map/MapComponent';
import ProductDetail from './usefulgarbage/ProductDetail';
import VisibleMap from './containers/VisibleMap';



 class App extends Component{  
  
  constructor(props) {
    super(props);
  }
  
  render(){

    console.log(tools);
    return (
      <div>
        <div><ToolList tools={tools}></ToolList></div>      
        {/* <div>
          <ProductDetail></ProductDetail>
        </div> */}
       <div>
         <VisibleMap></VisibleMap>
           {/* <MapComponent></MapComponent> */}
       </div>
      </div>
    )
  }  
}

export default App;
