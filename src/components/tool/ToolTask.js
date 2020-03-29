import React, { Component } from "react";


class  ToolTask extends Component{

    constructor(props) {
        super(props);
     
     
    this.state = {logo : null};
    
    this.dynamicfunction = null;
    
    }
      
    
    componentDidMount (){   
        
        //Logo
         this._getImage();        
        
        //Invoker
        switch (this.props.tool.ToolInvokerType) {
            case 1:
                this.addEvent(this.props.tool.ToolActionInvoker);
                break;
            default:
                break;
        }
    
    }


    addEvent = async event => {
        
        console.log(`Loading ${event} component...`);
        console.log(event);        
        
        if(event != null){
             import(`./toolInvokers/${event}.js`)        
          .then( obj => {console.log(obj);  this.dynamicfunction = obj[event]})         
          .catch(error => {        
          }); 
        }
    }

    _getImage = () => {
        if(this.props.tool.ToolImage !== null && 
            this.props.tool.ToolImage !== "") {
                 import(`./toolImages/${ this.props.tool.ToolImage}.png`)        
                 .then( obj => { this.setState({ logo :  obj.default});  
                 })         
                 .catch(error => {        
                 }); 
         }  
        
    }

    _getInvoker(){
        
        let content = 'Step not exists';

        const method = this.dynamicfunction;

        if (typeof method === 'function') {
            content = method();
        }
        return content;
    }
 
    render() {      
     const  { 
        tool
    } = this.props;


    return (
        <div>            
            <input type = "image"  
             alt = ""
             value = {tool.ToolName}   
             title = {tool.ToolTip} 
             src = {this.state.logo}
             onClick = {() => this._getInvoker()}
            />
        </div>
    );
    }
}

 export default ToolTask;

