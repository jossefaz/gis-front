import React from "react";
import IconButton from "../../../../../UI/Buttons/IconButton";
import { Table } from "semantic-ui-react";
import "./style.css";
import { Button, ButtonGroup } from "react-bootstrap";
const TextItem = (props) => {
  const extractContent = (s) => {
    var span = document.createElement("span");
    span.innerHTML = s;
    return span.textContent || span.innerText;
  };

  return (
    <div className="draw-item">
      <div className="flex-grow-1">{extractContent(props.content)}</div>
      <Button variant="white" onClick={() => props.removeOverlay(props.id)}>
        <i className="gis-icon gis-icon--trash"></i>
      </Button>
      <Button variant="white" onClick={() => props.editText(props.content, props.id)}>
        <i className="gis-icon gis-icon--pencil-on-square"></i>
      </Button>
    </div>
  );

  return (
    <React.Fragment>
      <Table.Cell>
        <p>{props.index + 1}</p>
      </Table.Cell>
      <Table.Cell>{extractContent(props.content)}</Table.Cell>
      <Table.Cell>
        <IconButton
          className="ui icon button pointer negative"
          onClick={() => props.removeOverlay(props.id)}
          icon="trash-alt"
          size="lg"
        />
        <IconButton
          className="ui icon button pointer positive"
          onClick={() => {
            props.editText(props.content, props.id);
          }}
          icon="edit"
          size="lg"
        />
      </Table.Cell>
    </React.Fragment>
  );
};

export default TextItem;
