import React, { Component } from "react";
import { connect } from 'react-redux'
import { setLayerVisible, setLayerOpacity } from "../../../redux/actions/layers";

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
  render() {
    return (
      <Menu.Item as="a">
        <div className="ui toggle checkbox">
          <input type="checkbox" name="public" onChange={() => this.props.setLayerVisible(this.props.lyrID)} defaultChecked={this.props.visible} />
          <label className="ui align left">{this.props.alias}</label>
        </div>
        <Slider color="blue" settings={this.settings} />
      </Menu.Item>
    );
  }
}
export default connect(null, { setLayerVisible, setLayerOpacity })(LayerListItem);

