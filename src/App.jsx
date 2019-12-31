import React, { Component } from 'react';
import { Socket } from 'react-socket-io';
import './App.css';

 import ToolList from './components/tool/ToolList.jsx';
 import tools from './usefulgarbage/tools.json';
import TestIO from './usefulgarbage/TestIO';
import Map from './components/map/MapComponent';
import MapComponent from './components/map/MapComponent';
import ProductDetail from './usefulgarbage/ProductDetail';

 const uri = '172.17.22.215:9090/subscribe/events';
 const options = { transports: ['websocket'] };

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
          <Socket uri={uri} options={options}> 
          
          <TestIO></TestIO>
          </Socket>  

        </div> */}
        <div>
          <ProductDetail></ProductDetail>
        </div>
       <div>
           <MapComponent></MapComponent>
       </div>
      </div>
    )
  }  
}

export default App;
