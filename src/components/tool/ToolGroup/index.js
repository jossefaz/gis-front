import React from "react";
import { connect } from "react-redux";
import { Dropdown } from "semantic-ui-react";
import { toggleGroupTool } from "../../../state/actions";
import ToolItem from "../ToolItem";
import API from "../../../core/api";
import "./style.css";

class GroupTool extends React.Component {
  get Tools() {
    const currentMapId = API.map.getFocusedMapUUID();
    return currentMapId ? this.props.Tools[currentMapId] : null;
  }
  render() {
    const { IsOpen, GroupImage, GroupName, Id: GroupID } = this.Tools.Groups[
      this.props.GroupID
    ];
    const CloseCB = () => this.props.toggleGroupTool(GroupID);

    return this.Tools && this.Tools.Groups[GroupID].tools ? (
      <React.Fragment>
        <style>
          {`
#${"Group" + GroupID} {
  position: absolute !important;
}
      `}
        </style>
        <Dropdown
          open={Boolean(IsOpen)}
          item
          icon={
            <a onClick={CloseCB}>
              {GroupImage ? (
                <img className="imageitem" src={`/img/${GroupImage}`} />
              ) : (
                GroupName
              )}
            </a>
          }
        >
          <Dropdown.Menu id={"Group" + GroupID}>
            <div className="ui segment grouptool">
              {this.Tools.Groups[GroupID].tools.map((toolId) => (
                <ToolItem key={toolId} ToolID={toolId} />
              ))}
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </React.Fragment>
    ) : null;
  }
}
const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};

export default connect(mapStateToProps, { toggleGroupTool })(GroupTool);

// <React.Fragment>

//   {IsOpen ? (        ) : null}
// </React.Fragment>
