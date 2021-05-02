import React, { Component } from "react";
import { connect } from "react-redux";
import LayerListItem from "../LayerListItem/index.js";
import { getMetaData } from "../../../core/HTTP/metadata";
import { selectLayers } from "../../../state/selectors/layersSelector";
import _ from "lodash";
// import "../style.css";
import { Accordion, Button, Card } from "react-bootstrap";

class LayerList extends Component {
  state = {
    activeKey: -1,
    layers: {},
    subjects: {},
    layerSubjectRelation: [],
    layerListObject: {},
    closeLayerListItem: false,
  };

  handleSelect = (key) => {
    this.setState({ activeKey: key ? key : -1 });
  };

  componentDidMount() {
    this.fetchMetaDataFromServer();
  }

  static getDerivedStateFromProps(props, state) {
    return {
      layers: props.layers,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      Object.keys(prevState.layers).length !==
        Object.keys(this.state.layers).length ||
      prevState.layers !== this.state.layers
    ) {
      this.renderLayerList();
    }
  }

  fetchMetaDataFromServer = async () => {
    const [subjectsResult, layerSubjectResult] = await Promise.all([
      getMetaData("subjects"),
      getMetaData("layerListRelations"),
    ]);

    if (subjectsResult && layerSubjectResult) {
      var subjectList = {};
      subjectsResult.forEach((subject) => {
        subject.layers = {};
        subjectList[subject.subjectid] = subject;
      });
      this.setState(
        {
          subjects: subjectList,
          layerSubjectRelation: layerSubjectResult,
        },
        () => {
          this.renderLayerList();
        }
      );
    }
  };

  renderLayerList = () => {
    var layerSubjectRelation = _.cloneDeep(this.state.layerSubjectRelation);
    var layerListObject = _.cloneDeep(this.state.subjects);

    var layers = this.state.layers;
    Object.keys(layers).forEach((lyrId) => {
      var lyr = layers[lyrId];
      var filteredSubjectIds = layerSubjectRelation
        .filter((relation) => {
          return lyr.semanticId === relation.semanticid;
        })
        .map((relation) => {
          return relation.subjectid;
        });
      filteredSubjectIds.forEach((subjectid) => {
        layerListObject[subjectid].layers[lyr.uuid] = lyr;
      });
    });
    this.setState({ layerListObject: layerListObject });
  };

  createLayerListItems = (layers) => {
    return Object.keys(layers).map((layerId, index) => (
      <LayerListItem
        layerId={layerId}
        execCloseLayerListItem={this.execCloseLayerListItem}
        key={index}
        closeItem={this.state.closeLayerListItem}
      ></LayerListItem>
    ));
  };

  execCloseLayerListItem = (close) => {
    this.setState({ closeLayerListItem: close });
  };

  layerIsActive = (key) => {
    return this.state.activeKey === key;
  };

  render() {
    return (
      <React.Fragment>
<<<<<<< HEAD
        <Accordion className="layers-list" onSelect={this.handleSelect}>
          {Object.keys(this.state.layerListObject).map((subjectId, index) => (
            <React.Fragment key={subjectId}>
              <Accordion.Toggle
                as="div"
                eventKey={subjectId}
                className={
                  "layers-list__toggle" +
                  (this.layerIsActive(subjectId)
                    ? " layers-list__toggle--active"
                    : "")
                }
              >
                <i
                  className={
                    "gis-icon gis-icon--" +
                    (this.layerIsActive(subjectId) ? "minus" : "plus")
                  }
                ></i>
                <span className="layers-list__toggle-text">
                  {this.state.layerListObject[subjectId].description +
                    "(" +
                    Object.keys(this.state.layerListObject[subjectId].layers)
                      .length +
                    ")"}
                </span>
              </Accordion.Toggle>

              <Accordion.Collapse
                eventKey={subjectId}
                className="layers-list__collapse"
              >
=======
        <Accordion className="layers-list accordion-with-icon" onSelect={this.handleSelect}>

          {Object.keys(this.state.layerListObject).map((subjectId, index) => (
            <React.Fragment key={subjectId}>

              <Accordion.Toggle as="div" eventKey={subjectId} className={"layers-list__toggle collapse-toggler" + (this.layerIsActive(subjectId) ? " collapse-toggler--opened" : "")}>
              {this.state.layerListObject[subjectId].description +
                  "(" + Object.keys(this.state.layerListObject[subjectId].layers).length + ")"}
              </Accordion.Toggle>

              <Accordion.Collapse eventKey={subjectId} className="arrow-padded">
>>>>>>> upstream/styles
                <React.Fragment>
                  {this.createLayerListItems(
                    this.state.layerListObject[subjectId].layers
                  )}
                </React.Fragment>
              </Accordion.Collapse>
            </React.Fragment>
          ))}
        </Accordion>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    layers: selectLayers(state),
    mapId: state.map.focused,
  };
};

export default connect(mapStateToProps)(LayerList);
