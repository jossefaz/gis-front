import React,{ Component } from "react";
class LayerListItem extends Component {
    state = {  }
    
    
    
    handleClick(cb) {
      var a = this.props.layers;
      alert("Clicked, new value = " + cb.checked);
    }
    
    
    render() {
        const  { 
        layer
        } = this.props; 
        return ( 
            <li><span>Food insecurity layer</span>
            <fieldset id="layer10">
              <div>
                 <label>
                <input id="visible10" class="visible" type="checkbox" onClick={this.handleClick}  />visibility
              </label>
              </div>
              <div>
                <label>opacity</label>
                <input  type="range" min="0" max="1" step="0.01"/>
              </div>     
            </fieldset>
          </li>
         );
    }
}
 
export default LayerListItem;