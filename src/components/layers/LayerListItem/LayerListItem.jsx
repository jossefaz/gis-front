import React, { Component } from "react";
import { connect } from 'react-redux'
import { addLayer } from "../../../redux/actions/layers";

import { Menu } from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";
const settings = {
  start: 2,
  min: 0,
  max: 10,
  step: 1,
  onChange: (value) => {
    console.log(value);
  },
};
class LayerListItem extends Component {
  render() {
    return (
      <Menu.Item as="a">
        <div className="ui toggle checkbox">
          <input type="checkbox" checked={!this.props.visible} name="public" onChange={() => this.props.addLayer(this.props.lyrID)} />
          <label className="ui align left">{this.props.alias}</label>
        </div>
        <Slider color="blue" settings={settings} />
      </Menu.Item>
    );
  }
}
export default connect(null, { addLayer })(LayerListItem);

