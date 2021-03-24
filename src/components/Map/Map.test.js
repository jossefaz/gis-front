import { shallow } from "enzyme";
import React from "react";
import Map from "./Map";

let wrapper;
beforeEach(() => {
  const mockProps = {
    setRaster: jest.fn(),
    map: {
      getLayers: jest.fn(() => {
        return {
          getArray: jest.fn(() => {
            return [1];
          }),
        };
      }),
    },
    getFocusedMap: jest.fn(() => {
      return {
        getLayers: jest.fn(() => {
          return {
            getArray: jest.fn(() => {
              return [1];
            }),
          };
        }),
      };
    }),
  };
  wrapper = shallow(<Map {...mockProps} />);
});

describe("Map Component", () => {
  it("render Map Component without crashing", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
