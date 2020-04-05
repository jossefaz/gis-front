
import React,{ Component } from "react";
import LayerListItem from "../LayerListItem/LayerListItem.jsx";
import mdLayers from '../../../usefulgarbage/mdLayers.json';

class LayerList extends Component {
    state = {  }
    
    showLayer = (layer,show) => {
   
      
      if(show)
        if(layer){

          console.log(layer.get('id'));
          console.log(layer.get('name'));
          this.props.addMapLayer(layer);
        }        
        else if(!show)
          layer.setVisible(false);
    }
    
    render() { 
        return ( 
          <ul>
            {mdLayers.map(mdLayer => (
              <div key = {mdLayer.id}>          
                  <LayerListItem 
                    mdLayer = {mdLayer}
                    showLayer = {this.showLayer}></LayerListItem>
              </div>
            ))}
        </ul> 
        );
    }
}
 
export default LayerList;