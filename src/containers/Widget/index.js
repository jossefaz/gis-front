import React from "react";
import { connect } from "react-redux";
import Tool from "../../components/tool";
class WidgetContainer extends React.Component {
  componentDidMount() {
    window.addEventListener("message", (e) => {
      if (e.origin !== "http://localhost:3000") {
        console.log(e);
        return;
      }
    });
  }

  renderOpenedTool = (Widgets) => {
    return Widgets
      ? Object.keys(Widgets.tools).map((toolId) => {
          return Widgets.tools[toolId].IsOpen ? (
            <Tool key={toolId} ToolID={toolId} />
          ) : null;
        })
      : null;
  };

  render() {
    return <div>{this.renderOpenedTool(this.props.Widgets)}</div>;
  }
}
const mapStateToProps = (state) => {
  return { Widgets: state.Tools };
};

export default connect(mapStateToProps, null)(WidgetContainer);
