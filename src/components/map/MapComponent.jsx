import React,{ Component } from "react";
import Map from 'ol/Map.js';
import View from 'ol/View.js';

class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {  }

        this.map = {};
        this.layer = null;
    }

    componentDidMount() {
        
        this.map = new Map({
            target: 'map',
            view: new View({
                center: [207000, 624000],
                zoom: 12,
                extent: [207000.0,624000.0,234525.12,651525.12]
            })
        });
    }

    componentWillReceiveProps(newProps) {
        
        
        if (
          newProps.layers !== this.props.layers &&
          newProps.layers.length > 0 
        ) {
            var layers = [...newProps.layers];
            this.layer  = layers.pop();
            this.map.addLayer(this.layer.vl);
        }

        if(newProps.units != null 
            && this.props.units !== newProps.units 
            && newProps.units.length > 0
            )                   
        {
            console.log("new units:" + newProps.units)             
       
            
            if(this.layer){
                this.layer.setProperties(newProps.units,{
                    targetId : "NUM",
                    sourceId : "id"
                });
            }
           
        }     
    }


    render() { 
     
        return (  
            <div>
              <div id = "map" 
                className = "map" 
                ref = "olmap"> 
             </div>             
            </div>            
        );
    }
}
 
export default MapComponent;