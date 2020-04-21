import React, { Component } from "react";
import { connect } from 'react-redux'
import { Image as ImageLayer } from "ol/layer";
import  ImageWMS from "ol/source/ImageWMS";
import { addLayers ,setLayerVisible, setLayerOpacity } from "../../../redux/actions/layers";
import { convertMdLayerToMapLayer } from "../../../utils/convertors/layerConverter"

import { Menu } from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";

class LayerListItem extends Component {
  settings = {
    start: 0.5,
    min: 0,
    max: 1,
    step: 0.1,
    onChange: (value) => {
      this.props.setLayerOpacity(this.props.lyrID, value)
    },
  };

  addLayer = (mdLayer) => {  

    debugger    
   
    var currentLayers = this.props.Layers;

    //checks if layer already exists     
    var layer = currentLayers[mdLayer.semanticid]
      
    if(!layer){
      var newLyr = convertMdLayerToMapLayer(mdLayer);
      this.props.addLayers([newLyr]);
    }
  };

  render() {
    return (
      <Menu.Item as="a">
        <div className="ui toggle checkbox">
          <input type="checkbox" name="public" onChange={() => this.addLayer(this.props.lyr)} defaultChecked={this.props.visible} />
          <label className="ui align left">{this.props.alias}</label>
        </div>
        <Slider color="blue" settings={this.settings} />
      </Menu.Item>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Layers: state.mapLayers.currentLayers
  };
};

export default connect(mapStateToProps, {addLayers, setLayerVisible, setLayerOpacity })
(LayerListItem);

