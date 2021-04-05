import React, { useState } from "react";
import FeatureItem from "./FeatureItem/FeatureItem";
import { Table } from "semantic-ui-react";
import API from "../../../../../core/api";
import { Accordion, Icon } from "semantic-ui-react";
import "./style.css";
const { highlightFeature, unhighlightFeature } = API.features;
const FeatureTable = (props) => {
  const { Header, Body, Row, HeaderCell } = Table;
  const [OveredFeature, serOveredFeature] = useState(null);
  const [active, toggle] = useState(true);

  const onRowOver = (feature) => {
    if (!OveredFeature) {
      serOveredFeature(feature);
    }
    highlightFeature(feature.getGeometry());
  };

  return (
    <React.Fragment>
      <Accordion>
        <Accordion.Title active={active} onClick={() => toggle(!active)}>
          <Icon name="dropdown" />
          "ציורים"
        </Accordion.Title>
        <Accordion.Content active={active}>
          <Table compact celled selectable className="cTable">
            <Header>
              <Row>
                <HeaderCell>מס'</HeaderCell>
                <HeaderCell>סגנון</HeaderCell>
                <HeaderCell>שליטה</HeaderCell>
              </Row>
            </Header>

            <Body>
              {props.features
                ? props.features.map((feature, index) => (
                    <Row
                      key={"fi" + feature.getId()}
                      onMouseOver={(e) => onRowOver(feature)}
                      onMouseLeave={() => unhighlightFeature()}
                    >
                      <FeatureItem
                        index={index}
                        fid={feature.getId()}
                        source={props.source}
                        defaultColor={props.defaultColor}
                        deleteLastFeature={props.deleteLastFeature}
                        onOpenEditSession={props.onOpenEditSession}
                        editSession={props.editSession}
                      />
                    </Row>
                  ))
                : null}
            </Body>
          </Table>
        </Accordion.Content>
      </Accordion>
    </React.Fragment>
  );
};
export default FeatureTable;
