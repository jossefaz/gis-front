import React from "react";
import _ from "lodash";
import "./style.css";
import { connect } from "react-redux";
import UpdateMenu from "./feed";
import { selectContextMenus } from "../../state/reducers";
import REGISTRY from "./registry";
import { Collapse, Table } from "react-bootstrap";
class ContextMenuContainer extends React.Component {
  state = {
    isOpened: false,
    menus: null,
  };

  updateMenu = ({ layerId, id, properties }) => {
    UpdateMenu(layerId, id, properties);
  };

  componentDidMount() {
    debugger;
    this.props.Feature && this.updateMenu(this.props.Feature);
  }

  componentDidUpdate(prevProps) {
    this.props.Feature &&
      (!_.isEqual(prevProps.menus, this.props.menus) ||
        prevProps.Feature.id !== this.props.Feature.id) &&
      this.updateMenu(this.props.Feature);
  }

  renderMenu(source, config) {
    const InternalTool = REGISTRY[source].component;

    return (
      source in this.props.menus &&
      this.props.Feature.id in this.props.menus[source] &&
      this.props.menus[source][this.props.Feature.id].length > 0 && (
        <tr key={source}>
          <td>
            <b>{source}</b>
          </td>
          <td>
            <InternalTool
              menu_config={config}
              local_config={REGISTRY[source].configuration}
              feature={this.props.Feature}
            />
          </td>
        </tr>
      )
    );
  }

  render() {
    return this.props.Feature && this.props.menus ? (
      <React.Fragment>
        <div
          className="context-menu"
          onMouseDownCapture={(e) => e.stopPropagation()}
        >
          <div
            className="context-menu__header"
            onClick={() => this.setState({ isOpened: !this.state.isOpened })}
          >
            Menu
          </div>
          <Collapse in={this.state.isOpened}>
            <div className="context-menu__content">
              <Table borderless>
                <tbody>
                  {Object.keys(this.props.menus).map((source) => {
                    return this.renderMenu(
                      source,
                      this.props.menus[source][this.props.Feature.id]
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Collapse>
        </div>
      </React.Fragment>
    ) : (
      <div>NO MENU</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    menus: selectContextMenus(state),
  };
};

export default connect(mapStateToProps)(ContextMenuContainer);
