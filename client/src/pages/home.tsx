"use client";
import React, { useState } from "react";
import { FileUpload } from "../components/ui/file-upload";

interface HomeProps {
  onStartInterview: (file: File) => void;
  errorMessage?: string;
}

const Home: React.FC<HomeProps> = ({ onStartInterview, errorMessage = "" }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a PDF file");
      return;
    }

    onStartInterview(file);
  };

  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (uploadedFiles: File[]) => {
    const selectedFile = uploadedFiles[0] || null;
    setFile(selectedFile);
    setFiles(uploadedFiles);
    console.log(uploadedFiles);
  };

  return (
    <>
      <div className="cv-page">
        <div className="cv-card">
          <h1 className="cv-title">Upload Your CV</h1>
          <p className="cv-subtitle">
            Let AI analyze your profile and start your interview
          </p>

          <div className="upload-container">
            <FileUpload onChange={handleFileUpload} />
          </div>

          {files.length > 0 && <p className="file-name">{files[0].name}</p>}

          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={!file}
          >
            Start Interview
          </button>

          {errorMessage && <p className="upload-message">{errorMessage}</p>}
        </div>
      </div>

      {/* CSS inside same file */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        .cv-page {
          height: 100vh;
          background-color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Poppins', sans-serif;
        }

        .cv-card {
          width: 400px;
          padding: 30px;
          background: #111;
          border: 1px solid #222;
          border-radius: 16px;
          text-align: center;
          color: #fff;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.05);
        }

        .cv-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .cv-subtitle {
          font-size: 13px;
          color: #aaa;
          margin-bottom: 20px;
        }

        /* Upload Container (replaces tailwind wrapper) */
        .upload-container {
          width: 100%;
          max-width: 600px;
          min-height: 260px;
          margin: 20px auto;

          border: 1px dashed #333;
          border-radius: 16px;

          background: #0d0d0d;
          transition: 0.3s;
          position: relative;
          overflow: hidden;
        }

        /* Hover effect */
        .upload-container:hover {
          border-color: #555;
          box-shadow: 0 0 25px rgba(255, 255, 255, 0.05);
        }

        /* Make FileUpload fill container */
        .upload-container .fu-container {
          height: 100%;
        }

        .upload-container .fu-box {
          height: 100%;
          padding: 30px;
          background: transparent;
        }

        /* Improve text alignment inside upload */
        .upload-container .fu-content {
          text-align: center;
        }

        /* Title inside upload */
        .upload-container .fu-title {
          font-size: 16px;
          font-weight: 600;
          color: #e5e5e5;
        }

        /* Subtitle */
        .upload-container .fu-subtitle {
          font-size: 13px;
          color: #888;
        }

        /* Center preview properly */
        .upload-container .fu-preview-wrapper {
          margin-top: 25px;
        }

        /* File card styling tweak */
        .upload-container .fu-file-card {
          background: #111;
          border: 1px solid #222;
        }

        /* Icon box */
        .upload-container .fu-icon-box {
          background: #111;
          border: 1px solid #222;
        }

        /* Dashed overlay */
        .upload-container .fu-dashed-box {
          border: 1px dashed #38bdf8;
          opacity: 0.2;
        }


        .file-name {
          font-size: 12px;
          color: #4ade80;
          margin-bottom: 15px;
        }

        .upload-btn {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 8px;
          background: #fff;
          color: #000;
          font-weight: 500;
          cursor: pointer;
          transition: 0.3s;
        }

        .upload-btn:hover {
          background: #ddd;
        }

        .upload-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .upload-message {
          margin-top: 10px;
          font-size: 12px;
          color: #9ca3af;
        }
      `}</style>
    </>
  );
};

export default Home;
