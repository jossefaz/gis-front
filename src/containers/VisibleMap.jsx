import React from 'react';
import { connect } from 'react-redux';
import MapComponent from '../components/map/MapComponent';
import { bindActionCreators } from 'redux'
import  {addLayer}  from "../redux/actions/actions";
import {Vector as VectorSource} from 'ol/source.js';
import {Projection} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Vector as VectorLayer} from 'ol/layer.js';



class VisibleMap extends React.Component {
    constructor(props) {
        super(props)

        this.map = {};
    }

    handleAddLayer = () =>{

        console.log('trying toadd a layer!!!!!!');
        
        
        var proj_2039 = new Projection({
            code: 'EPSG:2039',
            units: 'm',
            axisOrientation: 'neu',
            global: false
          });
      
          var polyEditingVectorSource = new VectorSource({
            format: new GeoJSON(),
            url:'http://localhost:8080/geoserver/Jeru/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Jeru%3AFAMILY_HEALTH_CENTER&maxFeatures=50&outputFormat=application%2Fjson'
          });
      
          var vectorEditingLayer = new VectorLayer({
            source: polyEditingVectorSource,
            projection: proj_2039 
          });
          console.log("vectorEditingLayer declared");
          console.log('as of now the layers are:' + this.props.layers);
          this.props.addLayer(vectorEditingLayer);          
    }
    
    render() {
        return (
            <div>
              <button  onClick={() => { this.handleAddLayer(); }} > 
              Health Center
              </button>
             <MapComponent layers={this.props.layers} addLayer={this.props.addLayer}></MapComponent>
        </div>
        )
    }
}

//const addLayer = () => ({ type: 'ADD_LAYER' })

const mapStateToProps = state => {
    return{
        layers: state.mapLayers.layers
    }    
}

const mapDispatchToProps = (dispatch) => {    
    return {
      addLayerParent: (layer) => dispatch(addLayer(layer))
    };
};

// const mapDispatchToProps =(dispatch) => {
//     return {actions: bindActionCreators(addLayer, dispatch)}
// }

export default connect(
    mapStateToProps,
    {addLayer},
    null 
)(VisibleMap);


//export default (VisibleMap);
    
//     mapStateToProps,
//     addLayer,
//     null 
// )(VisibleMap);