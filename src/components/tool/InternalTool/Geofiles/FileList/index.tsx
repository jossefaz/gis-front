import { GeofileItem } from "../../../../../core/HTTP/geofiles";
import FileItem from "./FileItem";

const FileList: React.FC<{ FileList: GeofileItem[] }> = ({ FileList }) => {
  const renderList = () =>
    FileList.map((file) => (
      <li key={file.id}>
        <FileItem {...file} />
      </li>
    ));

  return (
    <div>
      <ul>{renderList()}</ul>
    </div>
  );
};

export default FileList;
