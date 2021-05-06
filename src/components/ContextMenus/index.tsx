import React, { useEffect, useState } from "react";
import _ from "lodash";
import "./style.css";
import { connect } from "react-redux";
import UpdateMenu from "./feed";
import { selectContextMenus } from "../../state/reducers";
import REGISTRY from "./registry";
import { Collapse, Table } from "react-bootstrap";
import { Feature } from "../../core/types";
import { useTypedSelector } from "../../hooks/useTypedSelectors";
const ContextMenuContainer: React.FC<{ candidateFeature: Feature }> = ({
  candidateFeature,
}) => {
  const [isOpened, setisOpened] = useState<boolean>(false);

  const updateMenu = () => {
    const { parentlayerProperties, id, properties } = candidateFeature;
    UpdateMenu(parentlayerProperties.layerId, id, properties);
  };

  const menus = useTypedSelector(selectContextMenus);

  useEffect(() => {
    candidateFeature && updateMenu();
  }, []);

  const renderMenu = (source: string, config: { [key: string]: any }) => {
    const InternalTool = REGISTRY[source].component;
    return (
      menus && source in menus &&
      candidateFeature.id in menus[source] &&
      menus[source][candidateFeature.id].length > 0 && (
        <tr key={source}>
          <td>
            <b>{source}</b>
          </td>
          <td>
            <InternalTool
              menu_config={config}
              local_config={REGISTRY[source].configuration}
              feature={candidateFeature}
            />
          </td>
        </tr>
      )
    );
  };
  return candidateFeature && menus ? (
    <React.Fragment>
      <div
        className="context-menu"
        onMouseDownCapture={(e) => e.stopPropagation()}
      >
        <div
          className="context-menu__header"
          onClick={() => setisOpened(!isOpened)}
        >
          Menu
        </div>
        <Collapse in={isOpened}>
          <div className="context-menu__content">
            <Table borderless>
              <tbody>
                {Object.keys(menus).map((source) => {
                  return renderMenu(source, menus[source][candidateFeature.id]);
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
};

export default ContextMenuContainer;
