const { default: keys } = require("../keys");

const snapshot = {
  NESS_INTERACTION_UUID_KEY: "__NessUUID__",
  NESS_LAYER_UUID_KEY: "__NessUUID__",
  NESS_OVERLAY_UUID_KEY: "__NessUUID__",
  PARENT_UUID: "__PARENT_UUID__",
  VECTOR_SOURCE: "__SOURCE_UID__",
  GRAPHIC_LAYER: "__GRAPHIC_LAYER__",
};
describe("Keys constants", () => {
  it("keys should be the same", () => {
    expect(keys.NESS_INTERACTION_UUID_KEY).toBe(
      snapshot.NESS_INTERACTION_UUID_KEY
    );
    expect(keys.NESS_LAYER_UUID_KEY).toBe(snapshot.NESS_LAYER_UUID_KEY);
    expect(keys.NESS_OVERLAY_UUID_KEY).toBe(snapshot.NESS_OVERLAY_UUID_KEY);
    expect(keys.PARENT_UUID).toBe(snapshot.PARENT_UUID);
    expect(keys.VECTOR_SOURCE).toBe(snapshot.VECTOR_SOURCE);
    expect(keys.GRAPHIC_LAYER).toBe(snapshot.GRAPHIC_LAYER);
  });
});
