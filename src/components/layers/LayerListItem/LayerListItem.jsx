import React, { Component } from "react";
import { connect } from "react-redux";
import {
  addLayers,
  setLayerVisible,
  setLayerOpacity,
} from "../../../redux/actions/layers";
import { convertMdLayerToMapLayer } from "../../../utils/convertors/layerConverter";
import { Menu, Label } from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";
import { Dropdown } from "semantic-ui-react";

class LayerListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLayerItemClicked: false,
    };
  }

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

  showLayerPanel = (title) => {
    return;
  };

  displayLayerMenu = () => {
    this.setState({
      displayLayerMenu: !this.state.displayLayerMenu,
    });
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
          <label
            className="ui align left"
            onClick={() => this.displayLayerMenu()}
          >
            {lyr.title}
          </label>
        </div>

        {this.state.displayLayerMenu ? (
          <div>
            {/* <label>שכבה חדשה</label>
            <Slider color="blue" settings={this.settings} /> */}
            <Dropdown.Menu>
              <Slider color="blue" settings={this.settings} />
            </Dropdown.Menu>
          </div>
        ) : null}
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
