
import React,{ Component } from "react";
import LayerListItem from "../LayerListItem/LayerListItem.jsx";
import config from 'react-global-configuration';

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
        console.log(config.get('MapConfig'))
        return ( 
          <ul>
            {config.get('layers').map(mdLayer => (
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