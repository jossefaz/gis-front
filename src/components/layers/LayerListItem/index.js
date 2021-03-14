import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon } from "semantic-ui-react";
import withWidgetLifeCycle from "../../HOC/withWidgetLifeCycle";
import {
  addLayerToOLMap,
  setMapLayerVisible,
  setMapLayerOpacity,
} from "../../../state/actions";
import { selectCurrentMapLayers } from "../../../state/reducers";
import API from "../../../core/api";
import LayerListMenuItem from "../LayerListMenuItem";

class LayerListItem extends Component {
  state = {
    isLayerItemClicked: false,
    map: null,
    OlLayer: null,
    boundingBox: null,
    showMenu: false,
    onlyShowMe: false,
  };

  get currentLayer() {
    const { layers, layerId } = this.props;
    return layers && layerId in layers ? layers[layerId] : null;
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.closeItem !== prevProps.closeItem) {
      if (this.props.closeItem) {
        if (this.state.onlyShowMe === false) {
          this.setState({ showMenu: false });
        } else {
          this.setState(
            { onlyShowMe: false },
            this.props.execCloseLayerListItem(false)
          );
        }
      }
    }
  };

  setLayerVisibilty = (visiblity, layer) => {
    var foundLyr = API.layers.getOlLayer(layer.uuid);
    if (foundLyr) {
      this.props.setMapLayerVisible(layer.uuid, visiblity);
    } else {
      this.props.addLayerToOLMap(layer.uuid, visiblity);
    }
  };

  execShowMenu = () => {
    this.setState(
      {
        showMenu: !this.state.showMenu,
        onlyShowMe: true,
      },
      this.props.execCloseLayerListItem(true)
    );
  };

  createMenu = () => {
    if (this.state.showMenu) {
      return (
        <LayerListMenuItem layerId={this.currentLayer.uuid}></LayerListMenuItem>
      );
    } else return null;
  };

  renderLayerMenu = () => {
    return (
      <React.Fragment>
        {this.currentLayer && (
          <div>
            <div>
              <input
                type="checkbox"
                name="public"
                onChange={(event) =>
                  this.setLayerVisibilty(
                    event.target.checked,
                    this.currentLayer
                  )
                }
                checked={this.currentLayer.visible}
              />
              <label>{this.currentLayer.name}</label>
              <Icon
                link
                size="large"
                name={this.state.showMenu ? "angle down" : "angle right"}
                onClick={() => this.execShowMenu()}
              />
            </div>
            <div>{this.createMenu()}</div>
          </div>
        )}
      </React.Fragment>
    );
  };

  render() {
    return <React.Fragment>{this.renderLayerMenu()}</React.Fragment>;
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    mapId: state.map.focused,
    layers: selectCurrentMapLayers(state),
    closeLayerListItem: ownProps.closeLayerListItem,
  };
};

export default connect(mapStateToProps, {
  addLayerToOLMap,
  setMapLayerVisible,
  setMapLayerOpacity,
})(withWidgetLifeCycle(LayerListItem));
