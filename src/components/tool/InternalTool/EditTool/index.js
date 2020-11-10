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
import Collection from "ol/Collection";
import { Confirm } from "semantic-ui-react";
import IconButton from "../../../UI/Buttons/IconButton";
import withNotifications from "../../../HOC/withNotifications";
const initialState = {
  geomType: null,
  openForm: false,
  newFeature: null,
  EditFeature: null,
  fields: null,
  openConfirm: false,
  addingIcon: false,
  editIcon: false,
  eraseFeature: {
    openAlert: false,
    content: "? האם באמת למחוק את היישות",
    confirmBtn: "כן",
    cancelBtn: "לא",
  },
};

class EditTool extends Component {
  WIDGET_NAME = "EditTool";

  constructor() {
    super();
    this.interactions = new InteractionUtil(this.WIDGET_NAME);
    this.state = initialState;
  }

  get editProxy() {
    return this._editProxy ? this._editProxy[this.props.uuid] : false;
  }

  onAddFeature = async () => {
    this.setState({
      openForm: false,
      newFeature: null,
      EditFeature: null,
      addingIcon: true,
      editIcon: false,
    });
    await this.interactions.unSelect();
    await this.interactions.newDraw({ type: this.state.geomType });
    this.onDrawEnd();
  };

  onDeleteFeature = () => {
    this.setState({ openConfirm: true });
  };

  onDeleteConfirm = async () => {
    const deleted = await this.editProxy.remove();
    if (deleted) {
      this.props.successNotification("Successfully added feature !");
      this.setState({
        openConfirm: false,
        openForm: false,
        newFeature: null,
        EditFeature: null,
        addingIcon: false,
        editIcon: true,
      });
      await this.interactions.unModify();
      await this.interactions.unDraw();
    } else {
      this.props.errorNotification("Failed to add feature !");
    }
  };

  onIdentifyFeature = async () => {
    await this.interactions.unDraw();
    await this.interactions.newSelect(null, [this.currentLayer], false, click);
    this.setState({
      openForm: false,
      newFeature: null,
      EditFeature: null,
      addingIcon: false,
      editIcon: true,
    });
    if (this.interactions.getVectorSource(this.interactions.TYPES.DRAW)) {
      this.interactions.getVectorSource(this.interactions.TYPES.DRAW).clear();
    }
    this.onSelectEnd();
  };

  getMetadata = async () => {
    this.metadata = await this.editProxy.getMetadata();
    const geomType = this.metadata.featureTypes[0].properties.find((t) =>
      t.name.includes("geom")
    ).localType;
    console.log("geomType", geomType);
    this.setState({
      geomType,
      fields: this.metadata.featureTypes[0].properties,
    });
  };

  onSelectEnd = () => {
    if (this.interactions.currentSelect) {
      this.interactions.currentSelect.on("select", async (e) => {
        if (e.selected.length > 0) {
          const selectedF = e.selected[0];
          this.setState({
            EditFeature: selectedF,
            newFeature: null,
            openForm: true,
          });
          await this.interactions.newModify(new Collection([selectedF]));
          this.editProxy.edit(selectedF);
          const extent = selectedF.getGeometry().getExtent();
          selectedF.setStyle(styles.EDIT);
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
    this.interactions.clearVectorSource(this.interactions.TYPES.DRAW);
    this.interactions.unsetAll();
    this.setState({ newFeature: null, openForm: false });
  };

  componentDidMount() {
    initVectorLayers([this.props.uuid]);
    this.currentLayer = getVectorLayersByRefName(this.props.uuid);
    this._editProxy = EditProxy.getInstance([this.props.uuid]);
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
            editProxy={this.editProxy}
            values={
              this.state.EditFeature
                ? this.state.EditFeature.getProperties()
                : null
            }
            onDeleteFeature={this.onDeleteFeature}
            existingFeature={Boolean(this.state.EditFeature)}
            openForm={this.state.openForm}
          />
        )}
        <IconButton
          className={`ui icon button pointer ${
            this.state.addingIcon ? "secondary" : "primary"
          }`}
          onClick={this.onAddFeature}
          icon="plus-square"
          size="lg"
        />
        <IconButton
          className={`ui icon button pointer ${
            this.state.editIcon ? "secondary" : "primary"
          }`}
          onClick={this.onIdentifyFeature}
          icon="edit"
          size="lg"
        />
        <Confirm
          open={this.state.openConfirm}
          size="mini"
          content={this.state.eraseFeature.content}
          cancelButton={this.state.eraseFeature.cancelBtn}
          confirmButton={this.state.eraseFeature.confirmBtn}
          onCancel={() => this.setState({ openConfirm: false })}
          onConfirm={this.onDeleteConfirm}
        />
      </React.Fragment>
    );
  }
}

export default withNotifications(EditTool);
