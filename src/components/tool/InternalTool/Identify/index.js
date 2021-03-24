import React, { Component } from "react";
import FeatureList from "./FeatureList";
import FeatureDetail from "./FeatureDetail";
import ContextMenu from "../../../ContextMenus";
import LayersList from "./LayersList";
import { connect } from "react-redux";
import API from "../../../../core/api";
import { setSelectedFeatures } from "../../../../state/actions";
import {
  selectVisibleLayers,
  selectSelectedFeatures,
  selectCurrentFeature,
} from "../../../../state/reducers";
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle";
import "./style.css";
import VectorLayerRegistry from "../../../../core/proxymanagers/vectorlayer";
import { InteractionUtil } from "../../../../utils/interactions";
import EditProxy from "../../../../core/proxymanagers/edit";
import _ from "lodash";
import Collection from "ol/Collection";
import withNotifications from "../../../HOC/withNotifications";
const { getFocusedMapProxy, getFocusedMap } = API.map;
const { zoomTo } = API.features;
class Identify extends Component {
  WIDGET_NAME = "Identify";

  modifyGeom = null;

  constructor() {
    super();
    this.interactions = new InteractionUtil(this.WIDGET_NAME);
  }

  get focusedmap() {
    return getFocusedMapProxy().uuid.value;
  }

  get selfInteraction() {
    return this.interactions.store;
  }

  get vectorLayerRegistry() {
    return VectorLayerRegistry.getInstance();
  }

  onEditGeometry = async (feature) => {
    this.removeInteraction();
    const layer = feature.__Parent_NessUUID__;
    this.modifyGeom = feature;

    const f = this.editProxy.registry[layer].getFeatureById(feature.id);
    zoomTo(f.getGeometry());
    this.editProxy.registry[layer].edit(f);
    await this.interactions.newModify(new Collection([f]));
    getFocusedMap().on("dblclick", (e) =>
      this.autoClosingEditSession(e, layer)
    );
  };

  autoClosingEditSession = async (e, layer) => {
    if (Boolean(this.modifyGeom)) {
      const updated = await this.editProxy.registry[layer].save();
      if (updated) {
        this.props.successNotification("Successfully saved feature !");
        await this.interactions.unModify();
        this.addInteraction();
        this.modifyGeom = null;
      } else {
        this.props.errorNotification("Failed to save feature !");
      }
    }
  };

  onBoxEnd = () => {
    if (this.interactions.currentDragBoxUUID) {
      const dragBox = this.interactions.currentDragBox;
      const endListener = () => {
        const extent = dragBox.getGeometry().getExtent();
        const features = this.vectorLayerRegistry.getFeaturesByExtent(extent);
        if (features.length > 0) {
          this.props.setSelectedFeatures(features);
        }
      };
      if (dragBox) {
        dragBox.on("boxend", endListener);
      }
    }
  };

  addInteraction = (drawtype) => {
    this.interactions.newDragBox();
    this.onBoxEnd();
  };

  removeInteraction = () => {
    this.interactions.unDragBox();
  };

  componentDidMount() {
    this.addInteraction();
    if (getFocusedMapProxy().uuid.value in this.props.Layers) {
      this.setState({
        currentLayers: [],
      });
    }
  }

  componentDidUpdate() {
    if (this.props.SelectedFeatures) {
      this.editProxy = EditProxy.getInstance(this.props.VisibleLayers);
    }
    const areEquals = _.isEqual(
      this.state.currentLayers,
      this.props.VisibleLayers
    );
    if (!areEquals) {
      this.vectorLayerRegistry.initVectorLayers(this.props.VisibleLayers);
      this.setState({
        currentLayers: this.props.VisibleLayers,
      });
    }
  }

  onUnfocus = () => {
    this.removeInteraction();
  };

  onFocus = () => {
    this.addInteraction();
  };

  componentWillUnmount() {
    this.onUnfocus();
  }

  render() {
    return (
      <React.Fragment>
        {this.props.SelectedFeatures &&
        Object.keys(this.props.SelectedFeatures).length > 0 ? (
          <div className="flexDisplay">
            <LayersList />
            <FeatureList />
            {this.props.currentFeature && (
              <React.Fragment>
                <FeatureDetail onEditGeometry={this.onEditGeometry} />
                <ContextMenu Feature={this.props.currentFeature} />
              </React.Fragment>
            )}
          </div>
        ) : (
          <p>Select on the map</p>
        )}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    Features: state.Features,
    Interactions: state.Interactions,
    Layers: state.Layers,
    currentFeature: selectCurrentFeature(state),
    VisibleLayers: selectVisibleLayers(state),
    SelectedFeatures: selectSelectedFeatures(state),
  };
};

const mapDispatchToProps = {
  setSelectedFeatures,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNotifications(withWidgetLifeCycle(Identify)));
