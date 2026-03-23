"use client";

import * as React from "react";
import { useCallback } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

interface DropzoneUploaderProps {
  maxFiles?: number;
  maxSize?: number; // bytes
  accept?: { [key: string]: string[] };
  onFiles?: (files: File[]) => void;
  onError?: (errors: FileRejection[]) => void;
}

export function useDropzoneUploader(options: DropzoneUploaderProps) {
  const { maxFiles, maxSize, accept, onFiles, onError } = options;

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        onError?.(fileRejections);
        return;
      }
      onFiles?.(acceptedFiles);
    },
    [onFiles, onError]
  );

  const dropzone = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
  });

  return dropzone;
}

const DropzoneUploader: React.FC<DropzoneUploaderProps> = (props) => {
  const { getRootProps, getInputProps, isDragActive } =
    useDropzoneUploader(props);

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop files here...</p>
      ) : (
        <p>Drag & drop files, or click to select</p>
      )}{" "}
    </div>
  );
};

export default DropzoneUploader;
