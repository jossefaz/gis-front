import React, { Component } from "react";
import { connect } from "react-redux";
import {
  addLayers,
  setLayerVisible,
  setLayerOpacity,
} from "../../../redux/actions/layers";
import { convertMdLayerToMapLayer } from "../../../utils/convertors/layerConverter";
import { Menu } from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";

class LayerListItem extends Component {
  settings = {
    start: 0.7,
    min: 0,
    max: 1,
    step: 0.1,
    onChange: (value) => {
      this.props.setLayerOpacity(this.props.lyr.semanticid, value);
    },
  };

  addLayer = (mdLayer) => {
    var currentLayers = this.props.Layers;
    var layer = currentLayers[mdLayer.semanticid];

    if (layer) this.props.setLayerVisible(mdLayer.semanticid);
    else {
      var newLyr = convertMdLayerToMapLayer(mdLayer);
      this.props.addLayers([newLyr]);
    }
  };

  render() {
    const lyr = this.props.lyr;
    return (
      <Menu.Item as="a">
        <div className="ui toggle checkbox">
          <input
            type="checkbox"
            name="public"
            onChange={() => this.addLayer(lyr)}
            defaultChecked={lyr.visible}
          />
          <label className="ui align left">{lyr.title}</label>
        </div>
        <Slider color="blue" settings={this.settings} />
      </Menu.Item>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Layers: state.mapLayers.currentLayers,
  };
};

export default connect(mapStateToProps, {
  addLayers,
  setLayerVisible,
  setLayerOpacity,
})(LayerListItem);
