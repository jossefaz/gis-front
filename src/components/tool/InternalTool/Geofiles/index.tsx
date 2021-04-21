import React, { FC, useState, useEffect, useMemo, useCallback } from "react";
import { retrieveAllFiles, GeofileItem } from "../../../../core/HTTP/geofiles";
import { useDropzone } from "react-dropzone";
import { acceptStyle, activeStyle, baseStyle, rejectStyle } from "./style";
import _ from "lodash";

const Geofiles: FC = () => {
  const [filesMetadata, setFilesMetadata] = useState<GeofileItem[]>([]);
  const onDrop = useCallback((acceptedFiles) => {
    console.log(`acceptedFiles`, acceptedFiles);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: [
      "application/zip",
      "image/x-dwg",
      "image/x-dxf",
      "drawing/x-dwf",
      "application/json",
    ],
  });

  useEffect(() => {
    retrieveAllFiles().then((fetchedFiles) => {
      const metadataChanged = _.isEqual(filesMetadata, fetchedFiles);
      if (!metadataChanged && fetchedFiles) {
        setFilesMetadata(fetchedFiles);
      }
    });
  });

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
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Choose geographic files</p>
      </div>
    </div>
  );
};

export default Geofiles;
