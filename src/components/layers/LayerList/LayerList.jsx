import React, { Component } from "react";
import { connect } from "react-redux";
import { Accordion, Icon } from "semantic-ui-react";
import LayerListItem from "../LayerListItem/LayerListItem.jsx";
import { getMetaData } from "../../../communication/mdFetcher.js";
import { selectLayers } from "../../../redux/selectors/layersSelector";
import _ from "lodash";
import "./style.css";

class LayerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: -1,
      layers: {},
      subjects: {},
      layerSubjectRelation: [],
      // layerListObject: {},
    };
  }
  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    var activeIndex = this.state.activeIndex;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  componentDidMount() {
    this.fetchMetaDataFromServer();
    // this.renderTest();
  }
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   return {
  //     layers: nextProps.layers,
  //   };
  // }

  componentDidUpdate() {
    this.renderTest();
    // this.renderLayerList();
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    var prevLayers = this.state.layers;
    var nextLayers = nextProps.layers;
    var subjects = nextState.subjects;

    return (
      (prevLayers !== nextLayers &&
        nextProps.layers &&
        Object.keys(nextProps.layers).length > 0 &&
        Object.keys(subjects).length > 0) ||
      nextState.activeIndex !== this.state.activeIndex
    );
  };

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
      });
    }
  };

  renderTest = () => {
    this.setState({ layers: this.props.layers });
  };

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
    // this.setState({ layerListObject: layerListObject });

    return (
      <Accordion>
        {Object.keys(layerListObject).map((subjectId, index) => (
          <React.Fragment key={index}>
            <Accordion.Title
              active={activeIndex === index}
              index={index}
              onClick={this.handleClick}
            >
              <Icon name="dropdown" />
              {layerListObject[subjectId].description}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === index}>
              {this.createLayerListItems(layerListObject[subjectId].layers)}
            </Accordion.Content>
          </React.Fragment>
        ))}
      </Accordion>
    );
  };

  createLayerListItems = (layers) => {
    return Object.keys(layers).map((layerId, index) => (
      <LayerListItem layerId={layerId} key={index}></LayerListItem>
    ));
  };

  mytest = () => {
    console.log("got to this point");
    return <div>{"test"}</div>;
  };

  render() {
    return <React.Fragment>{this.renderLayerList()}</React.Fragment>;
    // var activeIndex = this.state.activeIndex;
    // return (
    //   <Accordion>
    //     {Object.keys(this.state.layerListObject).map((subjectId, index) => (
    //       <React.Fragment key={index}>
    //         <Accordion.Title
    //           active={activeIndex === index}
    //           index={index}
    //           onClick={this.handleClick}
    //         >
    //           <Icon name="dropdown" />
    //           {this.state.layerListObject[subjectId].description}
    //         </Accordion.Title>
    //         <Accordion.Content active={activeIndex === index}>
    //           {this.createLayerListItems(
    //             this.state.layerListObject[subjectId].layers
    //           )}
    //         </Accordion.Content>
    //       </React.Fragment>
    //     ))}
    //   </Accordion>
    // );
  }
}

// const mapStateToProps = (state) => {
//   return { Layers: selectLayers(state, state.map.focused) };
// };

const mapStateToProps = (state) => {
  return {
    layers: selectLayers(state), //[state.map.focused]["layers"],
    mapId: state.map.focused,
  };
};

export default connect(mapStateToProps)(LayerList);
