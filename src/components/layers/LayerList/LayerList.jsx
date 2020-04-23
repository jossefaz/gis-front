import React, { Component } from "react";
import LayerListItem from "../LayerListItem/LayerListItem.jsx";
import { getMetaData } from "../../../communication/mdFetcher.js";
class LayerList extends Component {
  constructor(props) {
    super(props);
    this.state = { layers: {}, subjects: {} };
  }
  componentDidMount() {
    // getMetaData("layerlist").then((result) =>
    //   this.setState({ layers: result })
    // );
    this.test();
  }
  test = async () => {
    const [layersResult, subjectsResult] = await Promise.all([
      getMetaData("layers"),
      getMetaData("subjects"),
    ]);

    if (layersResult && subjectsResult) {
      console.log(subjectsResult);
      var a = {};
      subjectsResult.map((subject) => {
        a[subject.subjectid] = subject;
      });
      this.setState({ layers: layersResult, subjects: a });
    }
  };
  componentWillUpdate() {
    console.log("LAYERLIST WILL UPDATE");
  }

  renderLayerList = (subjects) => {
    return Object.keys(subjects).map((subjectId) => (
      <React.Fragment key={subjectId}>
        <div>{subjects[subjectId].description}</div>
      </React.Fragment>
    ));
  };

  render() {
    return (
      <React.Fragment>
        {this.state.subjects ? (
          this.renderLayerList(this.state.subjects)
        ) : (
          <p>ToBeRendered</p>
        )}
      </React.Fragment>
    );
  }
}

export default LayerList;
