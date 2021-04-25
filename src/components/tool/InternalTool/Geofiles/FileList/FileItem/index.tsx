import { useEffect, useState } from "react";
import {
  GeofileItem,
  retrieveFormat,
  downloadFormat,
  downloadFile,
  getGeojsonStream,
} from "../../../../../../core/HTTP/geofiles";
import API from "../../../../../../core/api";

const FileItem: React.FC<GeofileItem> = (props) => {
  const { file_name, id, eol, type } = props;
  const [availableFormats, setAvailableFormats] = useState<string[]>([]);

  const getAvailableFormat = async () => {
    const formats = await retrieveFormat(id);
    formats && setAvailableFormats(formats);
  };

  const zoomTo = async () => {
    const geojson = await getGeojsonStream(id);
    geojson && API.features.zoomToGeojson(geojson);
  };

  const renderButtonList = () =>
    availableFormats.map((url) => (
      <button
        className="ui labeled icon button"
        key={url}
        onClick={() => downloadFormat(url)}
      >
        <i className="download icon"></i>
        {url.split("/")[url.split("/").length - 1]}
      </button>
    ));

  useEffect(() => {
    getAvailableFormat();
  }, []);

  return (
    <div>
      <div>{file_name}</div>
      <div>{renderButtonList()}</div>
      <button
        className="ui labeled icon button"
        onClick={() => downloadFile(id)}
      >
        <i className="download icon"></i>
        download
      </button>
      <button className="ui labeled icon button" onClick={() => zoomTo()}>
        <i className="focus icon"></i>
        Zoom
      </button>
    </div>
  );
};
export default FileItem;
