import React, { Component } from 'react';
import { connect } from 'react-redux';
import LayerList from "../../components/layers/LayerList/LayerList";
import  {addLayer}  from "../../redux/actions/actions";

class VisibleLayerList extends Component {
    state = {  }
    
    render() { 
        return (  
            <div><LayerList addMapLayer = {this.props.addLayer}></LayerList>
            </div>
        );
    }
}
 

const mapStateToProps = state =>  {
    return {
        layers: state.mapLayers.layers 
    }    
}


const mapDispatchToProps = dispatch => {
    return {
      // dispatching actions returned by action creators
      addLayer : (layer) => dispatch(addLayer(layer))
    }
}
  
  export default connect(
      mapStateToProps,   
      mapDispatchToProps,
      null 
  )(VisibleLayerList);
  
