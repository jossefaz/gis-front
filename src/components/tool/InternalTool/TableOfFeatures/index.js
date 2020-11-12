import React, { Component } from "react";
import EditProxy from "../../../../nessMapping/EditProxy";
import { InteractionUtil } from "../../../../utils/interactions";
import withNotifications from "../../../HOC/withNotifications";
import VectorLayerRegistry from "../../../../utils/vectorlayers";
import Table from "../../../UI/Table";
import ActionRegistry from "../../../UI/Table/Actions";
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
  data: [],
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
    return this._editProxy ? this._editProxy[this.props.uuid] : false;
  }
  get registry() {
    return VectorLayerRegistry.getInstance();
  }

  get vectorLayer() {
    return this.registry.getVectorLayer(this.props.uuid);
  }

  onDeleteFeature = () => {
    this.setState({ openConfirm: true });
  };

  onDeleteConfirm = async () => {
    const deleted = await this.editProxy.remove();
    if (deleted) {
      this.props.successNotification("Successfully added feature !");
      this.setState({
        openConfirm: false,
        EditFeature: null,
      });
    } else {
      this.props.errorNotification("Failed to add feature !");
    }
  };

  onIdentifyFeature = async (fid) => {
    // await this.interactions.newSelect(null, [this.currentLayer], false, click);
    // this.interactions.newModify(new Collection([]));
    this.setState({
      EditFeature: null,
    });
  };

  generateColumns = () => {
    this.columns = this.metadata.featureTypes[0].properties
      .map((prop) => {
        if (!prop.type.includes("gml")) {
          return {
            Header: prop.name,
            accessor: prop.name,
          };
        }
      })
      .filter((f) => f != undefined);
    // this.columns = [
    //   ...this.columns,
    //   { Header: "Actions", accessor: "actions", id: "actions" },
    // ];
  };

  generateData = () => {
    this.vectorLayer.getFeaturesData().then((data) => {
      if (data.length !== this.state.data.lentgh) {
        // let ActionsData = data.map((row) => {
        //   row.actions = [];
        //   Object.keys(ActionRegistry).forEach((action) => {
        //     row.actions.push(ActionRegistry[action].icon);
        //   });
        //   return row;
        // });

        this.setState({ data });
      }
    });
  };

  getMetadata = async () => {
    this.metadata = await this.editProxy.getMetadata();
    this.generateColumns();
    this.generateData();
  };

  onEditCancel = () => {
    this.setState({ openCancelConfirm: true });
  };

  onEditCancelConfirm = () => {
    this.setState({
      openConfirm: false,
      openCancelConfirm: false,
      openForm: false,
      EditFeature: null,
      addingIcon: false,
      editIcon: false,
    });
    this.registry.getVectorLayer(this.props.uuid).hideAllFeatures();
  };

  onSubmit = async (data) => {
    this.setState({ openForm: false });
  };

  initTable = () => {
    this.registry.initVectorLayers([this.props.uuid]);
    this.currentLayer = this.registry.getVectorLayersByRefName(this.props.uuid);
    this._editProxy = EditProxy.getInstance([this.props.uuid]);
    this.getMetadata();
  };

  componentDidMount() {
    this.initTable();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.uuid != this.props.uuid) {
      this.initTable();
    }
  }
  render() {
    return (
      <React.Fragment>
        {this.state.data.length > 0 && this.columns && (
          <Table
            data={this.state.data}
            columns={this.columns}
            uuid={this.props.uuid}
          />
        )}
      </React.Fragment>
    );
  }
}

export default withNotifications(EditTool);
