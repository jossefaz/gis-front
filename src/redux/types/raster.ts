import TileLayer from "ol/layer/Tile";

interface RasterMetadata {
  name: string;
  alias: string;
  icon: string;
}

interface RasterItem {
  layer: TileLayer;
  metadata: RasterMetadata;
}

export interface RasterState {
  Catalog: { [rasterName: string]: RasterItem };
  Focused: string | null;
}
