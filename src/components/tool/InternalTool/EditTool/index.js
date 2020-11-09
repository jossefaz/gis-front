import React, { Component } from "react";
import {
  initVectorLayers,
  getWFSMetadata,
  getVectorLayersByRefName,
} from "../../../../utils/features";
import EditProxy from "../../../../nessMapping/EditProxy";
import { InteractionUtil } from "../../../../utils/interactions";
import EditForm from "./EditForm";
import { getFocusedMap } from "../../../../nessMapping/api";
import { click } from "ol/events/condition";
import styles from "../../../../nessMapping/mapStyle";

const initialState = {
  geomType: null,
  openForm: false,
  newFeature: null,
  EditFeature: null,
  fields: null,
};
class EditTool extends Component {
  WIDGET_NAME = "EditTool";

  constructor() {
    super();
    this.interactions = new InteractionUtil(this.WIDGET_NAME);
    this.state = initialState;
  }

  onAddFeature = async () => {
    this.setState({
      openForm: false,
      newFeature: null,
      EditFeature: null,
    });
    await this.interactions.unSelect();
    await this.interactions.newDraw({ type: this.state.geomType });
    this.onDrawEnd();
  };

  onIdentifyFeature = async () => {
    await this.interactions.unDraw();
    await this.interactions.newSelect(null, [this.currentLayer], false, click);
    this.setState({
      openForm: false,
      newFeature: null,
      EditFeature: null,
    });
    if (this.interactions.getVectorSource(this.interactions.TYPES.DRAW)) {
      this.interactions.getVectorSource(this.interactions.TYPES.DRAW).clear();
    }
    this.onSelectEnd();
  };

  getMetadata = async () => {
    this.metadata = await getWFSMetadata(this.props.ref_name);
    this.setState({
      geomType: this.metadata.featureTypes[0].properties[0].localType,
      fields: this.metadata.featureTypes[0].properties,
    });
  };

  onSelectEnd = () => {
    if (this.interactions.currentSelect) {
      this.interactions.currentSelect.on("select", async (e) => {
        if (e.selected.length > 0) {
          this.setState({
            EditFeature: e.selected[0],
            newFeature: null,
            openForm: true,
          });
          const extent = e.selected[0].getGeometry().getExtent();
          e.selected[0].setStyle(styles.EDIT);
          getFocusedMap()
            .getView()
            .fit(extent, { padding: [850, 850, 850, 850] });
        }
      });
    }
  };

  onDrawEnd = () => {
    if (this.interactions.currentDraw) {
      this.interactions.currentDraw.on("drawend", async (e) => {
        this.setState({
          newFeature: e.feature,
          EditFeature: null,
          openForm: true,
        });
        const extent = e.feature.getGeometry().getExtent();
        getFocusedMap()
          .getView()
          .fit(extent, { padding: [850, 850, 850, 850] });
        this.interactions.unDraw();
      });
    }
  };

  onSubmit = async (data) => {
    this.interactions.getVectorSource(this.interactions.TYPES.DRAW).clear();
    this.setState({ newFeature: null, openForm: false });
  };

  componentDidMount() {
    initVectorLayers([this.props.ref_name]);
    this.currentLayer = getVectorLayersByRefName(this.props.ref_name);
    this.editProxy = EditProxy.getInstance([this.props.ref_name]);
    this.getMetadata();
  }
  render() {
    return (
      <React.Fragment>
        {this.editProxy && this.state.fields && (
          <EditForm
            fields={this.state.fields}
            feature={this.state.newFeature || this.state.EditFeature}
            onSubmit={this.onSubmit}
            editProxy={this.editProxy[this.props.ref_name]}
            values={
              this.state.EditFeature
                ? this.state.EditFeature.getProperties()
                : null
            }
            openForm={this.state.openForm}
          />
        )}

        <button onClick={this.onAddFeature}>add feature</button>
        <button onClick={this.onIdentifyFeature}>Identify</button>
      </React.Fragment>
    );
  }
}

export default EditTool;
