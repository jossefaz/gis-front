import TileLayer from "ol/layer/Tile";

interface RasterMetadata {
  name: string;
  alias: string;
  icon: string;
}

export interface RasterItem {
  layer: TileLayer;
  metadata: RasterMetadata;
}
