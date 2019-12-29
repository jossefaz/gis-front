import React, { Component } from 'react';
import { Socket } from 'react-socket-io';
import './App.css';

 import ToolList from './components/tool/ToolList.jsx';
 import tools from './usefulgarbage/tools.json';
import TestIO from './usefulgarbage/TestIO';

 const uri = 'http://localhost/test';
 const options = { transports: ['websocket'] };

 class App extends Component{  
  
  constructor(props) {
    super(props);
  
  }
  
  render(){

    console.log(tools);
    return (
      <div>
        <Socket uri={uri} options={options}> 
         <TestIO></TestIO>
        </Socket>  
        <ToolList tools={tools}></ToolList>
      </div>
    )
  }  
}

export default App;
