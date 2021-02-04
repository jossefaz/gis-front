import React from "react";
import { connect } from "react-redux";
import { toggleTool } from "../../../redux/actions/tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getFocusedMapProxy } from '../../../nessMapping/api'
import { ListGroup } from "react-bootstrap";

class Loader extends React.Component {
  get Tools() {
    const currentMapId = getFocusedMapProxy() ? getFocusedMapProxy().uuid.value : null
    return currentMapId ? this.props.Tools[currentMapId] : null
  }
  render() {
    const { ToolTip, ToolName, ToolImage, ToolIcon } = this.Tools.tools[
      this.props.ToolID
    ];
    const ToggleCB = () => this.props.toggleTool(this.props.ToolID);

    return (
      <ListGroup.Item className="tool-item">
        <div className="tool-item__icon">
          {ToolIcon ? <i className={'gis-icon gis-icon-' + ToolIcon}></i> : <i>i</i>}
        </div>
        <div className="tool-item__title flex-grow-1 mx-2">{ToolTip}</div>
        <div className="tool-item__drag">
          <i className="gis-icon gis-icon-drag-thin"></i>
        </div>
      </ListGroup.Item>
    );

    return (
      <a className="item" onClick={ToggleCB}>
        {ToolIcon ? (
          <FontAwesomeIcon icon={ToolIcon} size="2x" />
        ) : ToolImage ? (
          <img src={`/img/${ToolImage}`} />
        ) : (
              ToolName
            )}
      </a>
    );
  }
}

const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};

export default connect(mapStateToProps, { toggleTool })(Loader);
