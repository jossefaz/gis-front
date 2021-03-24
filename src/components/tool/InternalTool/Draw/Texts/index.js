import React, { useState } from "react";
import TextItem from "./TextItem";
import { Table } from "semantic-ui-react";
import { Accordion, Icon } from "semantic-ui-react";
import "./style.css";

export default (props) => {
  const { Header, Body, Row, HeaderCell } = Table;
  const [active, toggle] = useState(true);

  const defaultBG = "rgba(0, 0, 0, 0.5)";
  const highlightBG = "rgba(12, 52, 233, 0.5)";

  const toggleRowHighlight = (overlay, leave) => {
    const overlayDiv = document.querySelector(
      `#${props.overlays[overlay].selector}`
    );
    overlayDiv.style.backgroundColor = leave ? defaultBG : highlightBG;
  };

  return (
    <React.Fragment>
      {Object.keys(props.overlays).length > 0 && (
        <Accordion>
          <Accordion.Title active={active} onClick={() => toggle(!active)}>
            <Icon name="dropdown" />
            "טקסטים"
          </Accordion.Title>
          <Accordion.Content active={active}>
            <Table compact celled selectable className="cTable">
              <Header>
                <Row>
                  <HeaderCell>מס'</HeaderCell>
                  <HeaderCell>טקסט</HeaderCell>
                  <HeaderCell>שליטה</HeaderCell>
                </Row>
              </Header>

              <Body>
                {Object.keys(props.overlays).map((overlay, index) => (
                  <Row
                    key={overlay}
                    onMouseOver={(e) => toggleRowHighlight(overlay, false)}
                    onMouseLeave={() => toggleRowHighlight(overlay, true)}
                  >
                    <TextItem
                      removeOverlay={props.removeOverlay}
                      index={index}
                      id={overlay}
                      content={props.overlays[overlay].content}
                      editText={props.editText}
                    />
                  </Row>
                ))}
              </Body>
            </Table>
          </Accordion.Content>
        </Accordion>
      )}
    </React.Fragment>
  );
};
