import { shallow } from "enzyme";
import React from "react";
import ColorPicker from "./ColorPicker";

describe("ColorPicker component", () => {
  it("expect to match snapshot", () => {
    expect(shallow(<ColorPicker />)).toMatchSnapshot();
  });
});
