import React from "react";
import { FeedbackRecord } from "../../types/history";

type FeedbackModalProps = {
  record: FeedbackRecord | null;
  onClose: () => void;
};

const FeedbackModal: React.FC<FeedbackModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>

          <div className="modal-header">
            <h2 className="modal-title">Interview Feedback</h2>
            <div className="modal-score">
              <span className="modal-score-label">Score</span>
              <span className="modal-score-value">
                {((record.overall_score || 0) / 10).toFixed(1)}/10
              </span>
            </div>
          </div>

          <div className="modal-body">
            <div className="modal-section">
              <h3 className="modal-section-title">Summary</h3>
              <p className="modal-section-text">{record.interview_summary}</p>
            </div>

            <div className="modal-grid">
              <div className="modal-section list-card">
                <h3 className="modal-section-title text-green">Strengths</h3>
                <ul className="modal-list">
                  {record.strengths?.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-section list-card">
                <h3 className="modal-section-title text-red">Weaknesses</h3>
                <ul className="modal-list">
                  {record.weaknesses?.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-section advice-card">
              <h3 className="modal-section-title">Final Mentor Advice</h3>
              <p className="modal-section-text">{record.final_mentor_advice}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
          background: #111111;
          border: 1px solid #1f2937;
          border-radius: 20px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          padding: 30px;
          animation: slideUp 0.3s ease-out;
          font-family: 'Poppins', sans-serif;
        }

        /* Custom Scrollbar for modal */
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }
        .modal-content::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
        }
        .modal-content::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }

        .modal-close {
          position: absolute;
          top: 20px;
          right: 25px;
          background: transparent;
          border: none;
          color: #9ca3af;
          font-size: 32px;
          line-height: 1;
          cursor: pointer;
          transition: color 0.2s;
        }

        .modal-close:hover {
          color: #f3f4f6;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #1f2937;
        }

        .modal-title {
          margin: 0;
          color: #f3f4f6;
          font-size: 24px;
          font-weight: 600;
        }

        .modal-score {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .modal-score-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #9ca3af;
          margin-bottom: 4px;
        }

        .modal-score-value {
          font-size: 24px;
          font-weight: 600;
          color: #4ade80;
          background: rgba(74, 222, 128, 0.1);
          padding: 4px 12px;
          border-radius: 8px;
          border: 1px solid rgba(74, 222, 128, 0.2);
        }

        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .modal-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .modal-section-title {
          margin: 0;
          font-size: 16px;
          color: #f3f4f6;
          font-weight: 600;
        }

        .text-green {
          color: #4ade80;
        }

        .text-red {
          color: #f87171;
        }

        .modal-section-text {
          margin: 0;
          color: #d1d5db;
          font-size: 14px;
          line-height: 1.6;
        }

        .modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .list-card {
          background: #0a0a0a;
          border: 1px solid #1f2937;
          padding: 20px;
          border-radius: 12px;
        }

        .modal-list {
          margin: 0;
          padding-left: 20px;
          color: #d1d5db;
          font-size: 14px;
          line-height: 1.6;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .modal-list li::marker {
          color: #6b7280;
        }

        .advice-card {
          background: linear-gradient(135deg, rgba(74, 222, 128, 0.05), rgba(74, 222, 128, 0.02));
          border: 1px solid rgba(74, 222, 128, 0.2);
          padding: 20px;
          border-radius: 12px;
        }

        .advice-card .modal-section-title {
          color: #4ade80;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .modal-grid {
            grid-template-columns: 1fr;
          }
          .modal-header {
            flex-direction: column;
            gap: 16px;
          }
          .modal-score {
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
};

export default FeedbackModal;
