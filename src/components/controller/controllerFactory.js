import Map from './map.js';
import Toolbar from './toolbar.js';
import Toc from './toc.js';

const controller = { Map, Toolbar, Toc };

function createController(type, attributes) {
    const ControllerType = controller[type];
    attributes.guid = uuidv4();
    return new ControllerType(attributes);
}

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}

export default { createController };
