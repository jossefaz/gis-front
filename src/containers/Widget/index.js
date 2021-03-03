import React from "react";
import { connect } from "react-redux";
import Tool from "../../components/tool";
import API from "../../core/api";
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
    const currentMapId = API.map.getFocusedMapProxy()
      ? API.map.getFocusedMapProxy().uuid.value
      : null;
    return Widgets && currentMapId
      ? Object.keys(Widgets[currentMapId].tools).map((toolId) => {
          return Widgets[currentMapId].tools[toolId].IsOpen ? (
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
