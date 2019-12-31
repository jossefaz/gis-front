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
    
    }


    render() { 
        return (  
            <div id = "map" 
                className = "map" 
                ref = "olmap"> 
            </div>
        );
    }
}
 
export default MapComponent;