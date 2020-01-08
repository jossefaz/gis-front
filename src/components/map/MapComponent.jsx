import React,{ Component } from "react";
import Map from 'ol/Map.js';
import View from 'ol/View.js';


class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {  }

        this.map = {};
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

        this.map.addLayer(this.props.layers[0]);    
    }

    componentWillReceiveProps(newProps) {
        
        console.log("new props recived now:" + newProps.units["unit-id"]);
        
        if (
          newProps.layers !== this.props.layers &&
          newProps.layers.length > 0
        ) {
            var layers = [...newProps.layers];
            this.map.addLayer(layers.pop());
        }
    }


    render() { 
        console.log("our layers:" + this.props.layers)
        return (  
            <div id = "map" 
                className = "map" 
                ref = "olmap"> 
            </div>
        );
    }
}
 
export default MapComponent;