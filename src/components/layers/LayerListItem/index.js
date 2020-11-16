import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon } from "semantic-ui-react";
import withWidgetLifeCycle from "../../HOC/withWidgetLifeCycle";
import {
  addLayerToOLMap,
  setMapLayerVisible,
  setMapLayerOpacity,
} from "../../../redux/actions/layers";
import { getOlLayer } from "../../../nessMapping/api";
import LayerListMenuItem from "../LayerListMenuItem";
class LayerListItem extends Component {

  state = {
    isLayerItemClicked: false,
    map: null,
    OlLayer: null,
    boundingBox: null,
    showMenu: false,
    onlyShowMe: false
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.closeItem !== prevProps.closeItem) {
      if (this.props.closeItem) {
        if (this.state.onlyShowMe === false) {
          this.setState({ showMenu: false });
        }
        else {
          this.setState({ onlyShowMe: false }, this.props.execCloseLayerListItem(false));
        }
      }
    }
  }

  setLayerVisibilty = (visiblity, layer) => {
    var foundLyr = getOlLayer(layer.uuid);
    if (foundLyr && foundLyr !== -1) {
      this.props.setMapLayerVisible(layer.uuid, visiblity);
    } else {
      this.props.addLayerToOLMap(layer.uuid, visiblity);
    }
  };

  execShowMenu = () => {
    this.setState({
      showMenu: !this.state.showMenu,
      onlyShowMe: true
    },
      this.props.execCloseLayerListItem(true))
  }

  createMenu = () => {
    if (this.state.showMenu) {
      return (
        <LayerListMenuItem layerId={this.props.layer.uuid} ></LayerListMenuItem>
      )
    }
    else
      return null;
  }

  renderLayerMenu = () => {
    const layer = this.props.layer;
    return (
      <div>
        <div>
          <input
            type="checkbox"
            name="public"
            onChange={(event) =>
              this.setLayerVisibilty(event.target.checked, layer)
            }
            checked={layer.visible}
          />
          <label>{layer.name}</label>
          <Icon link
            size='large'
            name={this.state.showMenu ? 'angle down' : 'angle right'}
            onClick={() => this.execShowMenu()} />
        </div>
        <div>
          {this.createMenu()}
        </div>
      </div>
    );
  };

  render() {
    return <React.Fragment>{this.renderLayerMenu()}</React.Fragment>;
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    mapId: state.map.focused,
    layer: state.Layers[state.map.focused]["layers"][ownProps.layerId],
    closeLayerListItem: ownProps.closeLayerListItem
  };
};

export default connect(mapStateToProps, {
  addLayerToOLMap,
  setMapLayerVisible,
  setMapLayerOpacity,
})(withWidgetLifeCycle(LayerListItem));
