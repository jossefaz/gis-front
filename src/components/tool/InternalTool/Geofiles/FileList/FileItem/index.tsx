import { useEffect, useState } from "react";
import {
  GeofileItem,
  retrieveFormat,
  downloadFormat,
  downloadFile,
} from "../../../../../../core/HTTP/geofiles";

const FileItem: React.FC<GeofileItem> = (props) => {
  const { file_name, id, eol, type } = props;
  const [availableFormats, setAvailableFormats] = useState<string[]>([]);

  const getAvailableFormat = async () => {
    const formats = await retrieveFormat(id);
    formats && setAvailableFormats(formats);
  };

  const renderButtonList = () =>
    availableFormats.map((url) => (
      <button key={url} onClick={() => downloadFormat(url)}>
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

      <button key={id} onClick={() => downloadFile(id)}>
        download
      </button>
    </div>
  );
};
export default FileItem;
