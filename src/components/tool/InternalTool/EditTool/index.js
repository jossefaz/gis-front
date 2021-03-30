import React, { Component } from "react";
import EditProxyManager from "../../../../core/proxymanagers/edit";
import { InteractionUtil } from "../../../../utils/interactions";
import EditForm from "./EditForm";
import API from "../../../../core/api";
import { click } from "ol/events/condition";
import styles from "../../../../core/mapStyle";
import Confirm from "../../../UI/Modal/Confirm";
import IconButton from "../../../UI/Buttons/IconButton";
import withNotifications from "../../../HOC/withNotifications";
import VectorLayerRegistry from "../../../../core/proxymanagers/vectorlayer";
import {
  selectVisibleLayers,
  selectSelectedFeatures,
} from "../../../../state/reducers";
import {
  toggleToolByName,
  setSelectedFeatures,
  setCurrentFeature,
  setCurrentFeatureLayer,
} from "../../../../state/actions";
import { connect } from "react-redux";
import { InteractionSupportedTypes as TYPES } from "../../../../core/types/interaction";
const { getFocusedMap } = API.map;

const initialState = {
  geomType: null,
  openForm: false,
  newFeature: null,
  EditFeature: null,
  fields: null,
  openConfirm: false,
  openCancelConfirm: false,
  addingIcon: false,
  editIcon: false,
  eraseFeature: {
    openAlert: false,
    content: "? האם באמת למחוק את היישות",
    confirmBtn: "כן",
    cancelBtn: "לא",
  },

  cancelFeature: {
    openAlert: false,
    content: "? האם באמת לבטל את כלל השינוים ",
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
    return this._editProxy ? this._editProxy.registry[this.props.uuid] : false;
  }
  get registry() {
    return VectorLayerRegistry.getInstance();
  }

  onAddFeature = async () => {
    await this.interactions.unSelect();
    await this.interactions.newDraw({ type: this.state.geomType });
    this.setState({
      openForm: false,
      newFeature: null,
      EditFeature: null,
      addingIcon: true,
      editIcon: false,
    });

    this.onDrawEnd();
  };

  onDeleteFeature = () => {
    this.setState({ openConfirm: true });
  };

  onDeleteConfirm = async () => {
    const deleted = await this.editProxy.remove();
    if (deleted) {
      this.props.successNotification("Successfully removed feature !");
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
      this.props.errorNotification("Failed to remove feature !");
      this.setState({
        openConfirm: false,
      });
    }
  };

  onIdentifyFeature = async () => {
    await this.interactions.unDraw();
    await this.interactions.newSelect(null, [this.currentLayer], true, click);
    this.setState({
      openForm: false,
      newFeature: null,
      EditFeature: null,
      addingIcon: false,
      editIcon: true,
    });
    if (this.interactions.getVectorSource(TYPES.DRAW)) {
      this.interactions.getVectorSource(TYPES.DRAW).clear();
    }
    this.onSelectEnd();
  };

  getMetadata = async () => {
    this.metadata = await this.editProxy.getMetadata();
    const geomType = this.metadata.featureTypes[0].properties.find((t) =>
      t.name.includes("geom")
    ).localType;
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
          selectedF.set("editable", true);
          // TODO : change true value by real editable value
          selectedF.set("__NessUUID__", this.currentLayer.get("__NessUUID__"));
          await this.props.setSelectedFeatures([selectedF]);
          await this.props.setCurrentFeature(selectedF.getId());
          await this.props.toggleToolByName("Identify", true);

          this.editProxy.edit(selectedF);
          const extent = selectedF.getGeometry().getExtent();
          selectedF.setStyle(styles.EDIT);
          getFocusedMap()
            .getView()
            .fit(extent, { padding: [850, 850, 850, 850] });
        } else if (this.state.EditFeature) {
          this.interactions.currentSelect
            .getFeatures()
            .push(this.state.EditFeature);
        }
      });
    }
  };

  autoClosingEditSession = async () => {
    if (Boolean(this.state.EditFeature)) {
      const updated = await this.editProxy.save();
      if (updated) {
        this.props.successNotification("Successfully saved feature !");
        const extent = this.state.EditFeature.getGeometry().getExtent();
        getFocusedMap()
          .getView()
          .fit(extent, { padding: [850, 850, 850, 850] });
      } else {
        this.props.errorNotification("Failed to save feature !");
      }
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

  onEditCancel = () => {
    this.setState({ openCancelConfirm: true });
  };

  onEditCancelConfirm = () => {
    this.setState({
      openConfirm: false,
      openCancelConfirm: false,
      openForm: false,
      newFeature: null,
      EditFeature: null,
      addingIcon: false,
      editIcon: false,
    });
    if (this.interactions.getVectorSource(TYPES.DRAW)) {
      this.interactions.getVectorSource(TYPES.DRAW).clear();
    }
    this.registry.getVectorLayer(this.props.uuid).hideAllFeatures();
  };

  onSubmit = async (data) => {
    this.interactions.clearVectorSource(TYPES.DRAW);
    this.interactions.unsetAll();
    this.setState({ newFeature: null, openForm: false });
  };

  componentDidMount() {
    if (this.props.uuid && this.props.VisibleLayers.includes(this.props.uuid)) {
      this.registry.initVectorLayers([this.props.uuid]);
      this.currentLayer = this.registry.getVectorLayersByRefName(
        this.props.uuid
      );
      this._editProxy = EditProxyManager.getInstance([this.props.uuid]);
      if (this._editProxy) this.getMetadata();
    }
  }
  componentWillUnmount() {
    this.interactions.clearVectorSource(TYPES.DRAW);
    this.interactions.unsetAll();
    if (this._editProxy) this._editProxy.removeItem(this.props.uuid);
  }
  render() {
    return (
      <React.Fragment>
        {this.editProxy && this.state.fields && this.state.newFeature && (
          <EditForm
            fields={this.state.fields}
            feature={this.state.newFeature}
            onSubmit={this.onSubmit}
            editProxy={this.editProxy}
            values={
              this.state.EditFeature
                ? this.state.EditFeature.getProperties()
                : null
            }
            onCancel={this.onEditCancel}
            onDeleteFeature={this.onDeleteFeature}
            existingFeature={Boolean(this.state.EditFeature)}
            openForm={this.state.openForm}
          />
        )}
        {this.props.uuid && this.props.VisibleLayers.includes(this.props.uuid) && (
          <React.Fragment>
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
              isOpen={this.state.openConfirm}
              confirmTxt={this.state.eraseFeature.content}
              cancelBtnTxt={this.state.eraseFeature.cancelBtn}
              confirmBtnTxt={this.state.eraseFeature.confirmBtn}
              onCancel={() => this.setState({ openConfirm: false })}
              onConfirm={this.onDeleteConfirm}
            />
            <Confirm
              isOpen={this.state.openCancelConfirm}
              confirmTxt={this.state.cancelFeature.content}
              cancelBtnTxt={this.state.cancelFeature.cancelBtn}
              confirmBtnTxt={this.state.cancelFeature.confirmBtn}
              onCancel={() => this.setState({ openCancelConfirm: false })}
              onConfirm={this.onEditCancelConfirm}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    VisibleLayers: selectVisibleLayers(state),
    selectedFeatures: selectSelectedFeatures(state),
  };
};

export default connect(mapStateToProps, {
  toggleToolByName,
  setSelectedFeatures,
  setCurrentFeature,
  setCurrentFeatureLayer,
})(withNotifications(EditTool));
