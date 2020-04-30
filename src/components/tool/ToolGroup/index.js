import React from "react";
import { connect } from "react-redux";
import { Dropdown } from "semantic-ui-react";
import { toggleGroupTool } from "../../../redux/actions/tools";
import ToolItem from "../ToolItem";
import "./style.css";

class GroupTool extends React.Component {
  render() {
    const {
      IsOpen,
      GroupImage,
      GroupName,
      Id: GroupID,
    } = this.props.Tools.Groups[this.props.GroupID];
    const CloseCB = () => this.props.toggleGroupTool(GroupID);

    return (
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
              {this.props.Tools.Groups[GroupID].tools.map((toolId) => (
                <ToolItem key={toolId} ToolID={toolId} />
              ))}
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </React.Fragment>

    );
  }
}
const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};

export default connect(mapStateToProps, { toggleGroupTool })(GroupTool);

// <React.Fragment>

//   {IsOpen ? (        ) : null}
// </React.Fragment>
