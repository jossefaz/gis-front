import React, { FC, useState, useEffect, useMemo, useCallback } from "react";
import {
  retrieveAllFiles,
  GeofileItem,
  uploadFile,
  getGeojsonStream,
} from "../../../../core/HTTP/geofiles";
import { useDropzone, DropEvent } from "react-dropzone";
import { acceptStyle, activeStyle, baseStyle, rejectStyle } from "./style";
import _ from "lodash";
import FileList from "./FileList";
import API from "../../../../core/api";

const Geofiles: FC = () => {
  const [filesMetadata, setFilesMetadata] = useState<GeofileItem[]>([]);
  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const fd = new FormData();
      fd.append("file", file);
      uploadFile(fd).then(async (fileUUID) => {
        if (fileUUID) {
          const geojson = await getGeojsonStream(fileUUID);
          geojson && API.features.zoomToGeojson(geojson);
          refreshFilesList();
        }
      });
    });
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
  });

  const refreshFilesList = async () => {
    const fetchedFiles = await retrieveAllFiles();
    const metadataChanged = _.isEqual(filesMetadata, fetchedFiles);
    if (!metadataChanged && fetchedFiles) {
      setFilesMetadata(fetchedFiles);
    }
  };

  useEffect(() => {
    refreshFilesList();
  }, []);

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <React.Fragment>
      <div className="container">
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p>Choose geographic files</p>
        </div>
      </div>
      <FileList FileList={filesMetadata} />
    </React.Fragment>
  );
};

export default Geofiles;
