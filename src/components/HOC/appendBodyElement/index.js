import React from "react";
import { render } from "react-dom";

const appenedElements = {};

function getAppendedElements() {
  const elements = [];

  const keys = Object.keys(appenedElements);
  const length = keys.length;

  if (length > 0) {
    keys.forEach((key) => {
      elements.push(appenedElements[key]);
    });
  }

  return elements;
}

class AppendBodyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.appendElementContainer = document.getElementById(
      "append-element-container"
    );
  }

  setAppendElementId(id) {
    this.appendElementId = id;
  }

  updateAppendElement(content) {
    appenedElements[this.appendElementId] = content;

    this.updateAppendElements();
  }

  updateAppendElements() {
    render(<span>{getAppendedElements()}</span>, this.appendElementContainer);
  }

  removeAppendElement() {
    if (this.appendElementId && this.appendElementId in appenedElements) {
      delete appenedElements[this.appendElementId];
    }
    this.updateAppendElements();
  }
}

export default AppendBodyComponent;
