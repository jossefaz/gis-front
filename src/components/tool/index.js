import React from "react";
import Iframe from "react-iframe";
import { connect } from "react-redux";
import PopUp from "../popup";
class Loader extends React.Component {
  componentDidMount() {
    window.addEventListener("message", function (e) {
      this.console.log(e);
    });
  }

  render() {
    const { IsOpen, ToolInvokerType, ToolLocation } = this.props.Tools[
      this.props.ToolID
    ];
    return (
      <div>
        <button onClick={this.props.toggleTool}>Toggle Html</button>
        {IsOpen ? (
          ToolInvokerType ? (
            <PopUp>
              <Iframe url={ToolLocation} />
            </PopUp>
          ) : (
            React.lazy(() => import(ToolLocation))
          )
        ) : null}
      </div>
    );
  }
}
export default connect(null, { addLayer, setLayerOpacity })(Loader);
