import React, { Component } from "react";
import { connect } from 'react-redux'
import { Image as ImageLayer } from "ol/layer";
import  ImageWMS from "ol/source/ImageWMS";
import { addLayers ,setLayerVisible, setLayerOpacity } from "../../../redux/actions/layers";

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

  createMapLayerFromMdLayer = (mdLayer) => {
    
      const newLyr = new ImageLayer({
        source: new ImageWMS({      
          url: mdLayer.restaddress,    
        }),
      });
      newLyr.name = mdLayer.restid;
      newLyr.id = mdLayer.semanticid;
      newLyr.alias = mdLayer.title;
      newLyr.setVisible(Boolean(true));  
      newLyr.selectable = mdLayer.selectable;
      this.props.addLayers([newLyr]);
  };

  render() {
    return (
      <Menu.Item as="a">
        <div className="ui toggle checkbox">
          <input type="checkbox" name="public" onChange={() => this.createMapLayerFromMdLayer(this.props.lyr)} defaultChecked={this.props.visible} />
          <label className="ui align left">{this.props.alias}</label>
        </div>
        <Slider color="blue" settings={this.settings} />
      </Menu.Item>
    );
  }
}
export default connect(null, {addLayers, setLayerVisible, setLayerOpacity })(LayerListItem);

