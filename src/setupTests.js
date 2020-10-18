import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "jest-canvas-mock";
global.URL.createObjectURL = jest.fn();

Enzyme.configure({ adapter: new Adapter() });
