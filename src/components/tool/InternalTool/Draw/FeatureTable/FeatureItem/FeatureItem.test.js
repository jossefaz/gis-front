import { shallow, mount } from "enzyme";
import React, { useState as useStateMock } from "react";
import FeatureItem from "./FeatureItem";
import ColorPicker from "../../ColorPicker/ColorPicker";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));
describe("FeatureItem component", () => {
  const mockgetFeatureById = jest.fn((x) => 0);

  const setState = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation((init) => [init, setState]);
  });

  it("expect to match snapshot", () => {
    const FeatureItemSh = shallow(
      <FeatureItem
        editSession={{ status: false }}
        source={{ getFeatureById: mockgetFeatureById }}
      />
    );
    expect(FeatureItemSh).toMatchSnapshot();
  });

  //   it("function OutlineWidth to be updated", () => {
  //     const FeatureItemSh2 = mount(
  //       <FeatureItem
  //         editSession={{ status: false }}
  //         source={{ getFeatureById: mockgetFeatureById }}
  //       />
  //     );
  //     expect(setState).toHaveBeenCalledTimes(1);
  //   });
});
