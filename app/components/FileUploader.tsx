import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);

  const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selected = acceptedFiles[0] || null;
      setFile(selected);
      onFileSelect?.(selected);
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // don't bubble to the dropzone and reopen the file picker
    e.preventDefault();
    setFile(null);
    onFileSelect?.(null);
  };

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()} className="uploader-drag-area">
        <input {...getInputProps()} id="uploader" />

        {file ? (
          <div
            className="uploader-selected-file"
            onClick={(e) => e.stopPropagation()}
          >
            <img src="/images/pdf.png" alt="pdf" className="size-10" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                {file.name}
              </p>
              <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              className="p-2 cursor-pointer"
              onClick={handleRemove}
            >
              <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <img src="/icons/info.svg" alt="upload" className="size-16" />
            <p className="text-lg text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-sm text-gray-400">
              PDF (max {formatSize(maxFileSize)})
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
