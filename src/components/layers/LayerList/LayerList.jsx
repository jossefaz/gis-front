import React, { Component } from "react";
import { connect } from "react-redux";
import { Accordion, Button, Icon } from "semantic-ui-react";
import LayerListItem from "../LayerListItem/LayerListItem.jsx";
import { getMetaData } from "../../../communication/mdFetcher.js";
import { selectLayers } from "../../../redux/selectors/layersSelector";
import _ from "lodash";
import "../style.css";

class LayerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: -1,
      layers: {},
      subjects: {},
      layerSubjectRelation: [],
      layerListObject: {},
    };
  }
  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    var activeIndex = this.state.activeIndex;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  componentDidMount() {
    console.log("layerlist mounted");
    this.fetchMetaDataFromServer();

  }
  static getDerivedStateFromProps(props, state) {
    return {
      layers: props.layers,
    };
  }

  componentDidUpdate(prevProps, prevState) {

    if (Object.keys(prevState.layers).length !== Object.keys(this.state.layers).length) {
      console.log("not working")
      this.renderLayerList();
    }
  }
  componentWillUpdate(prevProps, prevState) {

  }

  // shouldComponentUpdate = (nextProps, nextState) => {
  //   var prevLayers = this.props.layers;
  //   var nextLayers = nextProps.layers;
  //   var subjects = nextState.subjects;

  //   return (
  //     (Object.keys(nextLayers).length !== Object.keys(prevLayers).length &&
  //       Object.keys(subjects).length > 0) ||
  //     nextState.activeIndex !== this.state.activeIndex
  //   );
  // };

  fetchMetaDataFromServer = async () => {
    const [subjectsResult, layerSubjectResult] = await Promise.all([
      getMetaData("subjects"),
      getMetaData("layerListRelations"),
    ]);

    if (subjectsResult && layerSubjectResult) {
      var subjectList = {};
      subjectsResult.map((subject) => {
        subject.layers = {};
        subjectList[subject.subjectid] = subject;
      });
      this.setState({
        subjects: subjectList,
        layerSubjectRelation: layerSubjectResult,
      }, this.renderLayerList());
    }
  };

  // renderTest = () => {
  //   this.setState({ layers: this.props.layers });
  // };

  renderLayerList = () => {
    console.log("got to renderLayerList");
    var activeIndex = this.state.activeIndex;

    var layerSubjectRelation = _.cloneDeep(this.state.layerSubjectRelation);

    var layerListObject = _.cloneDeep(this.state.subjects);

    var layers = this.state.layers;
    Object.keys(layers).map((lyrId) => {
      var lyr = layers[lyrId];
      var filteredSubjectIds = layerSubjectRelation
        .filter((relation) => {
          return lyr.semanticId === relation.semanticid;
        })
        .map((relation) => {
          return relation.subjectid;
        });
      filteredSubjectIds.map((subjectid) => {
        layerListObject[subjectid].layers[lyr.uuid] = lyr;
      });
    });
    this.setState({ layerListObject: layerListObject });
  }



  createLayerListItems = (layers) => {

    return Object.keys(layers).map((layerId, index) => (
      <LayerListItem layerId={layerId} key={index}></LayerListItem>
    ));
  };

  render() {

    return (
      <React.Fragment>
        <Accordion className="uirtl">
          {Object.keys(this.state.layerListObject).map((subjectId, index) => (
            <React.Fragment key={index}>
              <Accordion.Title
                active={this.state.activeIndex === index}
                index={index}
                onClick={this.handleClick}
              >
                <Icon name="dropdown" />
                {this.state.layerListObject[subjectId].description}
              </Accordion.Title>
              <Accordion.Content active={this.state.activeIndex === index}>
                {this.createLayerListItems(this.state.layerListObject[subjectId].layers)}
              </Accordion.Content>
            </React.Fragment>
          ))}
        </Accordion>
        <Button id="btnShowSelectedLayers"
          onClick={() => this.props.setMode(2)}>הצג את השכבות הנבחרות</Button>
      </React.Fragment>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    layers: selectLayers(state), //[state.map.focused]["layers"],
    mapId: state.map.focused,
  };
};

export default connect(mapStateToProps)(LayerList);
