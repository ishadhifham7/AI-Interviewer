"use client";
import React, { useEffect, useState } from "react";
import { FileUpload } from "../components/ui/file-upload";
import ProgressChart from "../components/ui/progress-chart";
import FeedbackModal from "../components/ui/feedback-modal";
import { getInterviewHistory } from "../lib/feedbackApi";

interface HomeProps {
  onStartInterview: (file: File) => void;
  errorMessage?: string;
}

const Dashboard: React.FC<HomeProps> = ({
  onStartInterview,
  errorMessage = "",
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getInterviewHistory();
        setHistory(data || []);
      } catch (err) {
        console.error("Failed to load interview history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a PDF file");
      return;
    }
    onStartInterview(file);
  };

  const handleFileUpload = (uploadedFiles: File[]) => {
    const selectedFile = uploadedFiles[0] || null;
    setFile(selectedFile);
    setFiles(uploadedFiles);
  };

  const calculateAverageScore = () => {
    if (!history.length) return 0;
    const sum = history.reduce(
      (acc, record) => acc + (record.overall_score || 0),
      0,
    );
    // score is out of 100 normally, dividing by 10
    return sum / history.length / 10;
  };

  const avgScore = calculateAverageScore();

  return (
    <>
      <div className="layout-page">
        <header className="page-header">
          <div className="header-logo">
            <div className="logo-dot" />
            AI Interviewer
          </div>
        </header>

        <div className="dashboard-container">
          <div className="dashboard-left">
            <div className="user-greeting">
              <h2 className="greeting-text">Welcome back,</h2>
              <h1 className="user-name">Ishadh Ifham</h1>
            </div>

            <div className="progress-section">
              <h3 className="section-title">Average Performance</h3>
              <div className="chart-wrapper">
                <ProgressChart score={avgScore} />
                <div className="chart-meta">
                  <p className="meta-text">
                    Based on your last <strong>{history.length}</strong>{" "}
                    interviews
                  </p>
                </div>
              </div>
            </div>

            <div className="history-section">
              <h3 className="section-title">Interview History</h3>
              <div className="history-list">
                {loading ? (
                  <p className="loading-text">Loading insights...</p>
                ) : history.length === 0 ? (
                  <div className="empty-state">
                    <p>No interviews completed yet.</p>
                  </div>
                ) : (
                  history.map((record, idx) => (
                    <div
                      key={record.id || idx}
                      className="history-card"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <div className="card-score">
                        <span className="card-score-value">
                          {((record.overall_score || 0) / 10).toFixed(1)}
                        </span>
                        <span className="card-score-max">/ 10</span>
                      </div>
                      <div className="card-content">
                        <p className="card-summary">
                          {record.interview_summary}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-right">
            <div className="cv-card">
              <h1 className="cv-title">Start New Interview</h1>
              <p className="cv-subtitle">
                Upload your CV to begin a new AI-driven session
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
                Upload CV
              </button>

              {errorMessage && <p className="upload-message">{errorMessage}</p>}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .layout-page {
          min-height: 100vh;
          background-color: #050505;
          display: flex;
          flex-direction: column;
          font-family: 'Poppins', sans-serif;
          color: #f3f4f6;
        }

        .page-header {
          padding: 20px 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .logo-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          box-shadow: 0 0 12px #4ade80;
        }

        .dashboard-container {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 40px;
          gap: 60px;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        /* --- LEFT SIDE: DASHBOARD --- */
        .dashboard-left {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .greeting-text {
          margin: 0;
          font-weight: 400;
          font-size: 18px;
          color: #9ca3af;
        }

        .user-name {
          margin: 4px 0 0;
          font-size: 32px;
          font-weight: 600;
          color: #ffffff;
        }

        .section-title {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #9ca3af;
          margin: 0 0 20px 0;
        }

        .chart-wrapper {
          display: flex;
          align-items: center;
          gap: 30px;
          background: #111111;
          border: 1px solid #1f2937;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .meta-text {
          font-size: 14px;
          color: #d1d5db;
          line-height: 1.6;
        }

        .meta-text strong {
          color: #4ade80;
          font-weight: 600;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 12px;
        }

        /* Custom Scrollbar */
        .history-list::-webkit-scrollbar {
          width: 6px;
        }
        .history-list::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
        }
        .history-list::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }

        .history-card {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          background: #0a0a0a;
          border: 1px solid #1f2937;
          padding: 20px;
          border-radius: 16px;
          transition: transform 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }

        .history-card:hover {
          transform: translateY(-2px);
          border-color: #374151;
        }

        .card-score {
          display: flex;
          align-items: baseline;
          background: rgba(74, 222, 128, 0.1);
          padding: 10px 16px;
          border-radius: 12px;
          border: 1px solid rgba(74, 222, 128, 0.2);
        }

        .card-score-value {
          font-size: 20px;
          font-weight: 600;
          color: #4ade80;
        }

        .card-score-max {
          font-size: 12px;
          color: #9ca3af;
          margin-left: 2px;
        }

        .card-content {
          flex: 1;
        }

        .card-summary {
          margin: 0;
          font-size: 14px;
          color: #d1d5db;
          line-height: 1.6;
        }

        .loading-text, .empty-state {
          color: #9ca3af;
          font-size: 14px;
          padding: 20px 0;
        }

        /* --- RIGHT SIDE: OVERRIDE CV STYLES --- */
        .dashboard-right {
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .cv-card {
          width: 100%;
          max-width: 500px;
          padding: 40px;
          background: #111111;
          border: 1px solid #1f2937;
          border-radius: 24px;
          text-align: center;
          color: #ffffff;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          position: sticky;
          top: 40px;
        }

        .cv-title {
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 10px 0;
        }

        .cv-subtitle {
          font-size: 14px;
          color: #9ca3af;
          margin: 0 0 30px 0;
        }

        .upload-container {
          width: 100%;
          min-height: 280px;
          border: 1px dashed #374151;
          border-radius: 16px;
          background: #050505;
          transition: 0.3s;
          position: relative;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .upload-container:hover {
          border-color: #4ade80;
          box-shadow: 0 0 20px rgba(74, 222, 128, 0.05);
        }

        .upload-container .fu-container {
          height: 100%;
        }

        .upload-container .fu-box {
          height: 100%;
          padding: 30px;
          background: transparent;
        }
        .upload-container .fu-content {
          text-align: center;
        }
        .upload-container .fu-title {
          font-size: 16px;
          font-weight: 600;
          color: #f3f4f6;
        }
        .upload-container .fu-subtitle {
          font-size: 13px;
          color: #9ca3af;
        }

        .file-name {
          font-size: 13px;
          color: #4ade80;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .upload-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: #ffffff;
          color: #000000;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .upload-btn:hover {
          background: #e5e7eb;
          transform: translateY(-2px);
        }

        .upload-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .upload-message {
          margin-top: 16px;
          font-size: 13px;
          color: #ef4444;
        }

        @media (max-width: 1024px) {
          .dashboard-container {
            grid-template-columns: 1fr;
          }
          .dashboard-right {
            justify-content: flex-start;
          }
          .cv-card {
            position: static;
          }
        }
      `}</style>

      <FeedbackModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </>
  );
};

export default Dashboard;
