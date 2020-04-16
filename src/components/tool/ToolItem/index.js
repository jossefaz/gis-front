import React from "react";
import { connect } from "react-redux";
import { toggleTool } from "../../../redux/actions/tools";

class Loader extends React.Component {
  componentDidMount() {
    window.addEventListener("message", (e) => {
      if (e.origin !== "http://localhost:3000") {
        console.log(e);
        return;
      }
    });
  }

  render() {
    const { ToolName, ToolImage } = this.props.Tools.tools[this.props.ToolID];
    const CloseCB = () => this.props.toggleTool(this.props.ToolID);
    return (
      <a className="item" onClick={CloseCB}>
        {ToolImage ? <img src={`/img/${ToolImage}`} /> : ToolName}
      </a>
    );
  }
}

const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};

export default connect(mapStateToProps, { toggleTool })(Loader);
