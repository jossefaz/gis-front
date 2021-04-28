import React from "react";
import { connect } from "react-redux";
import API from "../../../../../core/api";
import withNotifications from "../../../../HOC/withNotifications";
import EditProxy from "../../../../../core/proxymanagers/edit";
import {
  setSelectedFeatures,
  updateFeature,
  removeFeature,
} from "../../../../../state/actions";
import {
  selectCurrentLayerUUID,
  selectCurrentFeature,
  selectSelectedFeatures,
} from "../../../../../state/reducers";
import _ from "lodash";
import Confirm from "../../../../UI/Modal/Confirm";
import IconButton from "../../../../UI/Buttons/IconButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import { Button, ButtonGroup, Col, Collapse, Form, Row, Table } from "react-bootstrap";

const { getFocusedMapProxy } = API.map;
const { zoomTo } = API.features;
class FeatureDetail extends React.Component {
  state = {
    isOpened: true,
    editing: false,
    properties: null,
    openConfirm: false,
    eraseFeature: {
      openAlert: false,
      content: "? האם באמת למחוק את היישות",
      confirmBtn: "כן",
      cancelBtn: "לא",
    },
  };

  get editProxy() {
    return this._editProxy.registry[this.currentFeature.__Parent_NessUUID__];
  }

  onZoom = () => {
    const feature = this.editProxy.getFeatureById(this.currentFeature.id);
    zoomTo(feature.getGeometry());
  }

  onStartEdit = (event) => {
    event.stopPropagation()
    const feature = this.editProxy.getFeatureById(this.currentFeature.id);
    zoomTo(feature.getGeometry());
    this.editProxy.edit(feature);
    this.editProxy.getMetadata();
    this.setState({
      editing: true,
      properties: this.currentFeature.properties,
    });
  };

  onStartEditGeom = () => {
    this.props.onEditGeometry(this.currentFeature);
  };

  onEditCancel = () => {
    this.setState({ editing: false, properties: null });
  };

  onSave = async () => {
    const prop = this.state.properties;
    const updated = await this.editProxy.save(prop);
    if (updated) {
      this.props.successNotification("Successfully saved feature !");
      const newFeature = _.cloneDeep(this.currentFeature);
      newFeature.properties = _.cloneDeep(prop);
      await this.props.updateFeature(this.currentFeature.id, newFeature);
      this.setState({ editing: false, properties: null });
    } else {
      this.props.errorNotification("Failed to save feature !");
    }
  };

  onFeatureDelete = async () => {
    const deleted = await this.editProxy.remove(this.currentFeature.id);
    if (deleted) {
      this.props.successNotification("Successfully delete feature !");
      await this.props.removeFeature(this.currentFeature.id);
      this.setState({ editing: false, properties: null, openConfirm: false });
    } else {
      this.props.errorNotification("Failed to delete feature !");
      this.setState({ editing: false, openConfirm: false });
    }
  };

  get focusedmap() {
    return getFocusedMapProxy().uuid.value;
  }

  get currentFeature() {
    return this.props.currentFeature;
  }

  handleValueChange = (propertyname, value) => {
    this.setState((oldState) => ({
      properties: {
        ...oldState.properties,
        [propertyname]: value,
      },
    }));
  };

  componentDidMount() {
    this._editProxy = EditProxy.getInstance([this.props.CurrentLayerUUID]);
  }

  render() {
    const properties = this.state.properties
      ? this.state.properties
      : this.currentFeature
        ? this.currentFeature.properties
        : null;

    return (
      this.currentFeature && (
        <React.Fragment>
          <div className="feature-details" onMouseDownCapture={(e) => e.stopPropagation()}>

          <ButtonGroup className="btn-group-block border-0">
              <Button variant="white" onClick={this.onZoom}>
                <span>תקריב</span>
                <i className="gis-icon gis-icon--search-eye-thin"></i>
              </Button>
              {properties.editable && (<React.Fragment>
                <Button variant="white" onClick={this.onStartEditGeom}>
                  <span>ערוך</span>
                  <i className="gis-icon gis-icon--graphic-pen-thin"></i>
                </Button>
                <Button variant="white" onClick={() => this.setState({ openConfirm: true })}>
                  <span>מחק/י</span>
                  <i className="gis-icon gis-icon--trash"></i>
                </Button>
              </React.Fragment>)}
            </ButtonGroup>

            <div className="feature-details__header"
              onClick={() => this.setState({ isOpened: !this.state.isOpened })}
            >
              <div className="flex-grow-1 text-left py-1">נתונים נוספים</div>
              <Button onClick={this.onStartEdit} disabled={this.state.editing}><i className="gis-icon gis-icon--pencil-square"></i> ערוך</Button>
            </div>

            <Collapse in={this.state.isOpened} >
              <div className="feature-details__content">
                <Table borderless>
                  <tbody>
                    {Object.keys(properties).map(
                      (property) =>
                        property !== "bbox" &&
                        property !== "editable" && (
                          <tr key={property}>
                            <td>{property}</td>
                            <td>
                              {this.state.editing ? (
                                <Form.Control
                                  value={this.state.properties[property]}
                                  onChange={(e) =>
                                    this.handleValueChange(property, e.target.value)
                                  } />
                              ) : (
                                properties[property]
                              )}
                            </td>
                          </tr>
                        )
                    )}
                  </tbody>
                </Table>

                {properties.editable && this.state.editing &&
                  <div className="m-3">
                    <Row className="feature-details__properties-actions">
                      <Col>
                        <Button block onClick={this.onEditCancel}>בטל</Button>
                      </Col>
                      <Col>
                        <Button block onClick={this.onSave}>שמור</Button>
                      </Col>
                    </Row>
                  </div>
                }
              </div>

            </Collapse>

          </div>

          <Confirm
            isOpen={this.state.openConfirm}
            confirmTxt={this.state.eraseFeature.content}
            cancelBtnTxt={this.state.eraseFeature.cancelBtn}
            confirmBtnTxt={this.state.eraseFeature.confirmBtn}
            onCancel={() => this.setState({ openConfirm: false })}
            onConfirm={this.onFeatureDelete}
          />
        </React.Fragment>
      )
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Features: state.Features,
    map: state.map.focused,
    CurrentLayerUUID: selectCurrentLayerUUID(state),
    currentFeature: selectCurrentFeature(state),
    selectedFeatures: selectSelectedFeatures(state),
  };
};

export default connect(mapStateToProps, {
  setSelectedFeatures,
  updateFeature,
  removeFeature,
})(withNotifications(FeatureDetail));
