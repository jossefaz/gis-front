import React, { Component } from "react";
import { connect } from "react-redux";
import { Dropdown } from "semantic-ui-react";
import { logLevel, LogIt } from "../../../utils/logs";
import LayerListItem from "../LayerListItem/LayerListItem.jsx";
import { getMetaData } from "../../../communication/mdFetcher.js";
import { getFocusedMapProxy } from "../../../nessMapping/api";
import "./style.css";
class LayerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: {},
      subjects: {},
      layerSubjectRelation: [],
      layerListObject: {},
    };
  }
  componentDidMount() {
    this.fetchMetaDataFromServer();
  }

  fetchMetaDataFromServer = async () => {
    const [
      // layersResult,
      subjectsResult,
      layerSubjectResult,
    ] = await Promise.all([
      // getMetaData("layers"),
      getMetaData("subjects"),
      getMetaData("layerListRelations"),
    ]);

    if (this.props.Layers && subjectsResult && layerSubjectResult) {
      console.log(subjectsResult);
      var subjectList = {};
      // var layerList = {};
      subjectsResult.map((subject) => {
        subject.layers = {};
        subjectList[subject.subjectid] = subject;
      });
      // this.props.Layers.map((layer) => {
      //   layerList[layer.uuid] = layer;
      // });
      this.setState({
        layers: this.props.Layers.Layers,
        subjects: subjectList,
        layerSubjectRelation: layerSubjectResult,
      });
    }
    // this.setLayerListObject();
  };

  componentDidUpdate = () => {
    console.log("changes layers:" + this.props.Layers);
    // this.setLayerListObject();
    this.renderLayerList();
  };

  setLayerListObject = () => {
    if (this.state.subjects) {
      var layerListObject = this.state.subjects;

      // if (this.props.Layers && this.props.Layers.length > 0)
      Object.keys(this.props.Layers).map((lyrId) => {
        var lyr = this.props.Layers[lyrId];
        var filteredSubjectIds = this.state.layerSubjectRelation
          .filter((relation) => {
            return lyrId === relation.semanticid.toString();
          })
          .map((relation) => {
            return relation.subjectid;
          });

        filteredSubjectIds.map((subjectid) => {
          layerListObject[subjectid].layers[lyr.uuid] = lyr;
        });
      });
      // this.setState({ layerListObject: layerListObject });
      LogIt(logLevel.INFO, "Map Update");
    }
  };

  renderLayerList = () => {
    if (this.state.subjects) {
      var layerListObject = this.state.subjects;

      // if (this.props.Layers && this.props.Layers.length > 0)

      if (this.props.mapId && JSON.stringify(this.props.Layers) !== "{}") {
        var layers = this.props.Layers[this.props.mapId];
        Object.keys(layers).map((lyrId) => {
          var lyr = layers[lyrId];
          var filteredSubjectIds = this.state.layerSubjectRelation
            .filter((relation) => {
              return lyr.semanticId === relation.semanticid;
            })
            .map((relation) => {
              return relation.subjectid;
            });

          filteredSubjectIds.map((subjectid) => {
            layerListObject[subjectid].layers[lyr.uuid.value] = lyr;
          });
        });
        // this.setState({ layerListObject: layerListObject });
        LogIt(logLevel.INFO, "Map Update");
      }
      // var layerListObject = this.state.layerListObject;
      return Object.keys(layerListObject).map((subjectId) => (
        <React.Fragment key={subjectId}>
          <Dropdown item text={layerListObject[subjectId].description}>
            <Dropdown.Menu>
              {this.createLayerListItems(layerListObject[subjectId].layers)}
            </Dropdown.Menu>
          </Dropdown>
        </React.Fragment>
      ));
    }
  };

  createLayerListItems = (layers) => {
    return Object.keys(layers).map((layerId, index) => (
      <Dropdown.Item key={index}>
        <LayerListItem key={index} lyr={layers[layerId]}></LayerListItem>
      </Dropdown.Item>
    ));
  };

  render() {
    return (
      <React.Fragment>
        {this.state.subjects &&
        this.props.Layers &&
        this.state.layerSubjectRelation ? (
          //this.state.layerListObject
          this.renderLayerList()
        ) : (
          <p>ToBeRendered</p>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return { Layers: state.Layers.Layers, mapId: state.map.focused };
};

export default connect(mapStateToProps)(LayerList);
