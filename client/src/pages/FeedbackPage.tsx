import React from "react";
import { Feedback } from "../types/feedback";

type FeedbackPageProps = {
  feedback: Feedback;
  onRestart: () => void;
};

const scoreLabel = (score: number) => {
  if (score >= 85) {
    return "Excellent";
  }

  if (score >= 70) {
    return "Strong";
  }

  if (score >= 55) {
    return "Developing";
  }

  return "Needs Focus";
};

const FeedbackPage: React.FC<FeedbackPageProps> = ({ feedback, onRestart }) => {
  return (
    <>
      <div className="feedback-page">
        <div className="feedback-shell">
          <header className="feedback-header">
            <div>
              <p className="eyebrow">Interview Feedback</p>
              <h1 className="feedback-title">Your performance snapshot</h1>
              <p className="feedback-subtitle">
                A structured review of strengths, improvement areas, and next
                steps.
              </p>
            </div>

            <button className="ghost-button" onClick={onRestart}>
              Start New Interview
            </button>
          </header>

          <section className="score-card">
            <div className="score-left">
              <p className="card-label">Overall score</p>
              <div className="score-row">
                <span className="score-value">{feedback.overall_score}</span>
                <span className="score-label">
                  {scoreLabel(feedback.overall_score)}
                </span>
              </div>
              <p className="score-summary">{feedback.interview_summary}</p>
            </div>

            <div className="score-right">
              <div className="metric">
                <span>Clarity</span>
                <strong>{feedback.communication_analysis.clarity}</strong>
              </div>
              <div className="metric">
                <span>Structure</span>
                <strong>{feedback.communication_analysis.structure}</strong>
              </div>
              <div className="metric">
                <span>Depth</span>
                <strong>
                  {feedback.communication_analysis.technical_depth}
                </strong>
              </div>
            </div>
          </section>

          <section className="grid">
            <div className="card">
              <h3>Strengths</h3>
              <ul>
                {feedback.strengths.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3>Weaknesses</h3>
              <ul>
                {feedback.weaknesses.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="card wide-card">
            <div className="card-header">
              <h3>Question analysis</h3>
              <span className="pill">
                {feedback.question_analysis.length} questions reviewed
              </span>
            </div>

            <div className="qa-grid">
              {feedback.question_analysis.map((analysis, index) => (
                <article
                  className="qa-card"
                  key={`${analysis.question}-${index}`}
                >
                  <div className="qa-header">
                    <h4>{analysis.question}</h4>
                    <span className="score-pill">{analysis.score}/10</span>
                  </div>
                  <p className="qa-line">{analysis.evaluation}</p>
                  <div className="qa-split">
                    <div>
                      <p className="qa-label">What went wrong</p>
                      <p className="qa-text">{analysis.what_went_wrong}</p>
                    </div>
                    <div>
                      <p className="qa-label">How to improve</p>
                      <p className="qa-text">
                        {analysis.improvement_suggestion}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid">
            <div className="card">
              <h3>Final mentor advice</h3>
              <p>{feedback.final_mentor_advice}</p>
            </div>

            <div className="card">
              <h3>Next steps</h3>
              <ol>
                {feedback.next_steps.map((step, index) => (
                  <li key={`${step}-${index}`}>{step}</li>
                ))}
              </ol>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        .feedback-page {
          min-height: 100vh;
          background: radial-gradient(circle at top, rgba(255, 191, 72, 0.12), transparent 45%),
            #050505;
          display: flex;
          justify-content: center;
          padding: 48px 20px 80px;
          font-family: 'Poppins', sans-serif;
          color: #f5f5f5;
        }

        .feedback-shell {
          width: min(1100px, 100%);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .feedback-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .eyebrow {
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.2em;
          color: #fbbf24;
          margin: 0 0 8px;
        }

        .feedback-title {
          margin: 0;
          font-size: clamp(28px, 4vw, 40px);
        }

        .feedback-subtitle {
          margin: 8px 0 0;
          color: #c4c4c4;
          font-size: 14px;
          max-width: 560px;
        }

        .ghost-button {
          background: transparent;
          color: #f5f5f5;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 10px 18px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .ghost-button:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-1px);
        }

        .score-card {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          background: linear-gradient(135deg, rgba(255, 191, 72, 0.12), rgba(190, 74, 29, 0.12));
          border: 1px solid rgba(255, 191, 72, 0.2);
          border-radius: 20px;
          padding: 24px;
        }

        .card-label {
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.15em;
          color: #fcd34d;
          margin: 0 0 10px;
        }

        .score-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .score-value {
          font-size: 48px;
          font-weight: 600;
        }

        .score-label {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.7);
        }

        .score-summary {
          margin: 12px 0 0;
          color: #f2f2f2;
          font-size: 14px;
          line-height: 1.6;
        }

        .score-right {
          display: grid;
          gap: 12px;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 13px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .card {
          background: #0f0f0f;
          border: 1px solid #242424;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .card h3 {
          margin: 0 0 12px;
          font-size: 16px;
        }

        .card ul,
        .card ol {
          margin: 0;
          padding-left: 18px;
          display: grid;
          gap: 8px;
          color: #d4d4d4;
          font-size: 14px;
        }

        .card p {
          margin: 0;
          color: #d4d4d4;
          font-size: 14px;
          line-height: 1.6;
        }

        .wide-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .pill {
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          background: rgba(255, 191, 72, 0.15);
          border: 1px solid rgba(255, 191, 72, 0.3);
          color: #fcd34d;
        }

        .qa-grid {
          display: grid;
          gap: 16px;
        }

        .qa-card {
          border-radius: 14px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(7, 7, 7, 0.9);
        }

        .qa-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .qa-header h4 {
          margin: 0;
          font-size: 15px;
        }

        .score-pill {
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #7dd3fc;
          font-size: 12px;
        }

        .qa-line {
          margin: 10px 0 0;
          color: #c9c9c9;
          font-size: 13px;
        }

        .qa-split {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }

        .qa-label {
          margin: 0 0 6px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #9ca3af;
        }

        .qa-text {
          margin: 0;
          color: #d4d4d4;
          font-size: 13px;
        }

        @media (max-width: 720px) {
          .feedback-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .ghost-button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default FeedbackPage;
