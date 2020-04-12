import types from "../actions/actionsTypes";

export default function (state = null, action) {
  switch (action.type) {
    case types.INIT_TOOLS:
      return action.payload;
    default:
      return state;
  }
}
