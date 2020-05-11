import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Label } from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";
import { Dropdown } from "semantic-ui-react";
import {
  addLayerToOLMap,
  setMapLayerVisible,
  setMapLayerOpacity,
} from "../../../redux/actions/layers";
import { getOlLayer, getFocusedMap } from "../../../nessMapping/api";
import { convertMdLayerToMapLayer } from "../../../utils/convertors/layerConverter";

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
      this.props.setMapLayerOpacity(this.props.lyr.uuid, value);
    },
  };

  setLayerVisibilty = (visiblity, lyr) => {
    var foundLyr = getOlLayer(lyr.uuid);
    if (foundLyr && foundLyr !== -1) {
      this.props.setMapLayerVisible(lyr.uuid, visiblity);
    } else {
      this.props.addLayerToOLMap(lyr.uuid, visiblity);
    }
  };
  zoomToLayer = (lyr) => {
    var map = getFocusedMap();
    var layer = getOlLayer(lyr.uuid);
    if (layer) map.zoomToExtent(layer.getDataExtent());
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
            onChange={(event) =>
              this.setLayerVisibilty(event.target.checked, lyr)
            }
            defaultChecked={lyr.visible}
          />
          <label
            className="ui align left"
            onClick={() => this.displayLayerMenu()}
          >
            {lyr.name}
          </label>
        </div>

        {this.state.displayLayerMenu ? (
          <div>
            <Slider color="blue" settings={this.settings} />
            <label>פתיחת מקרא</label>
            <label onClick={() => this.zoomToLayer(lyr)}>מבט מלא לשכבה</label>
            <Dropdown.Menu>
              <Slider color="blue" settings={this.settings} />
            </Dropdown.Menu>
          </div>
        ) : null}
      </Menu.Item>
    );
  }
}
export default connect(null, {
  addLayerToOLMap,
  setMapLayerVisible,
  setMapLayerOpacity,
})(LayerListItem);
