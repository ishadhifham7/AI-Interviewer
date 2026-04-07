import React from "react";

interface DemoPageProps {
  cvData: unknown;
  fileId?: string;
  onGoHome: () => void;
}

const DemoPage: React.FC<DemoPageProps> = ({ cvData, fileId, onGoHome }) => {
  return (
    <div className="demo-page">
      <div className="demo-card">
        <h1 className="demo-title">Structured CV JSON</h1>
        {fileId && <p className="demo-file-id">File ID: {fileId}</p>}

        <pre className="demo-json">{JSON.stringify(cvData, null, 2)}</pre>

        <button className="demo-btn" onClick={onGoHome}>
          Back To Home
        </button>
      </div>

      <style>{`
        .demo-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          padding: 24px;
          font-family: 'Poppins', sans-serif;
        }

        .demo-card {
          width: min(900px, 95vw);
          max-height: 86vh;
          padding: 24px;
          background: #111;
          border: 1px solid #222;
          border-radius: 16px;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .demo-title {
          margin: 0;
          text-align: center;
          font-size: 22px;
        }

        .demo-file-id {
          margin: 0;
          text-align: center;
          color: #9ca3af;
          font-size: 12px;
          word-break: break-all;
        }

        .demo-json {
          margin: 0;
          padding: 16px;
          border-radius: 10px;
          border: 1px solid #2a2a2a;
          background: #0b0b0b;
          color: #d1d5db;
          overflow: auto;
          text-align: left;
          font-size: 13px;
          line-height: 1.45;
          flex: 1;
        }

        .demo-btn {
          align-self: center;
          border: none;
          border-radius: 8px;
          padding: 10px 16px;
          background: #fff;
          color: #000;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default DemoPage;
