"use client";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    const nextFiles = newFiles.slice(0, 1);
    setFiles(nextFiles);
    onChange && onChange(nextFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: MAX_CV_SIZE_BYTES,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: () => {
      alert("Please upload one PDF file up to 5MB.");
    },
  });

  return (
    <div className="file-upload-container" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="file-upload-wrapper group-file"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden-input"
        />
        <div className="grid-mask">
          <GridPattern />
        </div>
        <div className="content-flex">
          <p className="upload-subtitle">
            Drag or drop your files here or click to upload
          </p>
          <div className="files-list-container">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className="file-item-card"
                >
                  <div className="file-item-header">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="file-name"
                    >
                      {file.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="file-size-badge"
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>

                  <div className="file-item-footer">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="file-type-badge"
                    >
                      {file.type}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="upload-icon-card"
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="drop-it-text"
                  >
                    Drop it
                    <IconUpload className="icon-small" />
                  </motion.p>
                ) : (
                  <IconUpload className="icon-small" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="secondary-upload-box"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
      <style>{cssStyles}</style>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="grid-pattern-container">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          const isEven = index % 2 === 0;
          return (
            <div
              key={`${col}-${row}`}
              className={`grid-cell ${isEven ? "cell-even" : "cell-odd"}`}
            />
          );
        }),
      )}
    </div>
  );
}

const cssStyles = `
  .file-upload-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .file-upload-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 64rem; /* Increased width */
    min-height: 280px;
    cursor: pointer;
    overflow: hidden;
    border-radius: 1rem;
    padding: 2.5rem;
    background-color: transparent;
    border: 1px solid rgba(0,0,0,0.05);
  }

  .hidden-input {
    display: none;
  }

  .grid-mask {
    position: absolute;
    inset: 0;
    -webkit-mask-image: radial-gradient(ellipse at center, white, transparent);
    mask-image: radial-gradient(ellipse at center, white, transparent);
    pointer-events: none;
  }

  .content-flex {
    position: relative;
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-grow: 1;
  }

  .upload-title {
    font-family: sans-serif;
    font-size: 1.25rem; /* Bigger text */
    font-weight: 700;
    color: #404040;
    margin: 0;
  }

  .upload-subtitle {
    margin-top: 0.10rem;
    font-family: sans-serif;
    font-size: 1.1rem;
    font-weight: 400;
    color: #a3a3a3;
    text-align: center;
  }

  .files-list-container {
    position: relative;
    margin-top: 1.75rem;
    width: 100%;
    max-width: 42rem; /* Increased inner width */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .file-item-card {
    position: relative;
    z-index: 40;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    overflow: hidden;
    border-radius: 0.5rem;
    background-color: #ffffff;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .file-item-header {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }

  .file-name {
    max-width: 25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.1rem;
    font-weight: 500;
    color: #404040;
  }

  .file-size-badge {
    width: fit-content;
    flex-shrink: 0;
    border-radius: 0.5rem;
    padding: 0.35rem 0.75rem;
    font-size: 0.9rem;
    color: #525252;
    background: #f9fafb;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  }

  .file-item-footer {
    margin-top: 1rem;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #6b7280;
  }

  .file-type-badge {
    border-radius: 0.375rem;
    background-color: #f3f4f6;
    padding: 0.25rem 0.5rem;
  }

  .upload-icon-card {
    position: relative;
    z-index: 40;
    display: flex;
    height: 10rem; /* Increased size */
    width: 10rem;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    background-color: #ffffff;
    box-shadow: 0px 20px 60px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
  }

  .group-file:hover .upload-icon-card {
    box-shadow: 0 35px 70px -15px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  .drop-it-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #525252;
    font-weight: 500;
  }

  .icon-small {
    height: 2rem; /* Bigger icon */
    width: 2rem;
    color: #525252;
  }

  .secondary-upload-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 30;
    display: flex;
    height: 10rem;
    width: 10rem;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    border: 2px dashed #38bdf8;
    background-color: transparent;
    opacity: 0;
  }

  .grid-pattern-container {
    display: flex;
    flex-shrink: 0;
    transform: scale(1.1);
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1px;
    background-color: #f3f4f6;
    width: 100%;
    height: 100%;
  }

  .grid-cell {
    display: flex;
    height: 3rem; /* Bigger cells */
    width: 3rem;
    flex-shrink: 0;
    border-radius: 2px;
  }

  .cell-even {
    background-color: #fafafa;
  }

  .cell-odd {
    background-color: #fafafa;
    box-shadow: inset 0px 0px 1px 3px rgba(255,255,255,1);
  }

  @media (prefers-color-scheme: dark) {
    .file-upload-wrapper { border-color: rgba(255,255,255,0.05); }
    .upload-title { color: #d4d4d4; }
    .file-item-card { background-color: #171717; }
    .file-name { color: #d4d4d4; }
    .file-size-badge { background-color: #262626; color: #ffffff; }
    .file-item-footer { color: #a3a3a3; }
    .file-type-badge { background-color: #262626; }
    .upload-icon-card { background-color: #171717; }
    .icon-small { color: #d4d4d4; }
    .grid-pattern-container { background-color: #171717; }
    .cell-even, .cell-odd { background-color: #0a0a0a; }
    .cell-odd { box-shadow: inset 0px 0px 1px 3px rgba(0,0,0,1); }
  }

  @media (min-width: 768px) {
    .file-item-footer { flex-direction: row; align-items: center; }
  }
`;
