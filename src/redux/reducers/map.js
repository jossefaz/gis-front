import types from "../actions/actionsTypes";
import produce from "immer";

const initialLayersState = {
    uuids: [],
    focused: ''
};

export default function (state = initialLayersState, action) {
    switch (action.type) {
        case types.INIT_MAP:
            return produce(state, (draftState) => {
                draftState.uuids.push(action.payload);
                draftState.focused = action.payload;
            });
        case types.SET_MAP_FOCUSED:
            return produce(state, (draftState) => {
                draftState.focused = action.payload;
            });
        default:
            return state;
    }
}
