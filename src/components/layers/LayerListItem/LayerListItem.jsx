import React, { Component } from "react";
import { connect } from "react-redux";
import withWidgetLifeCycle from "../../HOC/withWidgetLifeCycle";
import {
  addLayerToOLMap,
  setMapLayerVisible,
  setMapLayerOpacity,
} from "../../../redux/actions/layers";
import { getOlLayer } from "../../../nessMapping/api";

class LayerListItem extends Component {

  setLayerVisibilty = (visiblity, lyr) => {
    var foundLyr = getOlLayer(lyr.uuid);
    if (foundLyr && foundLyr !== -1) {
      this.props.setMapLayerVisible(lyr.uuid, visiblity);
    } else {
      this.props.addLayerToOLMap(lyr.uuid, visiblity);
    }
  };

  render() {
    const lyr = this.props.lyr;
    return <React.Fragment>
      <div>
        <div>
          <input
            type="checkbox"
            name="public"
            onChange={(event) =>
              this.setLayerVisibilty(event.target.checked, lyr)
            }
            checked={lyr.visible}
          />
          <label>{lyr.name}</label>
        </div>
      </div>
    </React.Fragment>;
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    lyr: state.Layers[state.map.focused]["layers"][ownProps.layerId],
  };
};

export default connect(mapStateToProps, {
  addLayerToOLMap,
  setMapLayerVisible,
  setMapLayerOpacity,
})(withWidgetLifeCycle(LayerListItem));
