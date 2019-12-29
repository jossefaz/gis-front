import React from 'react';
import { connect } from 'react-redux';
import MapComponent from '../components/map/MapComponentOld';
import { bindActionCreators } from 'redux'
import  {addLayer}  from "../redux/actions/actions";
import {Vector as VectorSource} from 'ol/source.js';
import {Projection} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {addMantiIntersectionLayer} from '../usefulgarbage/layers'



class VisibleMap extends React.Component {
    constructor(props) {
        super(props)

        
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


    handleAddTzmatimLayer = () =>{
        this.props.addLayer(addMantiIntersectionLayer());   

    }
    handleChangeStatusTzmet = () => {
        var ftrs = this.props.layers[1].getSource().getFeatures();
        if(ftrs.length > 0){
            ftrs[0].values_['CSTAT'] = 'FAIL';
        }
    }
    
    render() {

        return (
            <div>
              <button  onClick={() => { this.handleAddLayer(); }} > 
              Health Center
              </button>
              <button  onClick={() => { this.handleAddTzmatimLayer(); }} > 
              צמתים
              </button>
              <button  onClick={() => { this.handleChangeStatusTzmet(); }} > 
              שנה סטטוס צומת
              </button> 
              {/* <button  onClick={() => { this.changeStatusFromServer("",null); }} > 
              שינוי צמתים ידנית
              </button>               */}
             <MapComponent layers={this.props.layers}   addLayer={this.props.addLayer} ></MapComponent>
        </div>
        )
    }
}

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