import React,{ Component } from "react";
import Map from 'ol/Map';
import View from 'ol/View';
import {Projection} from 'ol/proj';

class MapComponent extends Component {
    
    constructor(props) {
        super(props);       
      

        this.map = {};
        this.layer = null;
    }

    componentDidMount() {
        
        this.map = new Map({
            target: 'map',
            view: new View({
                projection: new Projection({
                        code: 'EPSG:2039',
                        units: 'm',
                        axisOrientation: 'neu',
                        global: false
                }),
                center: [207000, 624000],
                zoom: 12,
                extent: [207000.0,624000.0,234525.12,651525.12]
            })         
        });
    }

    addLayerToMap = () => {       
     
    }
 

    // if(newProps.units != null 
    //     && this.props.units !== newProps.units 
    //     && newProps.units.length > 0
    //     )                   
    // {
    //     console.log("new units:" + newProps.units)             
    
        
    //     if(this.layer){
    //         this.layer.setProperties(newProps.units,{
    //             targetId : "NUM",
    //             sourceId : "id"
    //         });
    //     }
        
    // }     
    // }


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