import React from "react";

// --- local type re-declaration so client doesn't depend on server paths ---
type QCategory = "screening" | "project" | "technical" | "behavioural" | "challenge";
type QDifficulty = "easy" | "medium" | "hard";

interface IQuestion {
  id: number;
  category: QCategory;
  question: string;
  difficulty: QDifficulty;
  hint?: string;
}

interface ISession {
  candidateName: string;
  experience_level: string;
  questions: IQuestion[];
  totalQuestions: number;
  generatedAt: string;
}

interface InterviewPageProps {
  session: ISession;
  onDone: () => void;
}

const CATEGORY_LABELS: Record<QCategory, string> = {
  screening:   "Screening",
  project:     "Project Deep-Dive",
  technical:   "Technical Depth",
  behavioural: "Behavioural",
  challenge:   "Challenge",
};

const CATEGORY_ICONS: Record<QCategory, string> = {
  screening:   "🔍",
  project:     "🗂️",
  technical:   "⚙️",
  behavioural: "🤝",
  challenge:   "🧩",
};

const DIFFICULTY_COLORS: Record<QDifficulty, string> = {
  easy: "#4ade80",
  medium: "#facc15",
  hard: "#f87171",
};

const ALL_CATEGORIES: QCategory[] = ["screening", "project", "technical", "behavioural", "challenge"];

const InterviewPage: React.FC<InterviewPageProps> = ({ session, onDone }) => {
  const [activeCategory, setActiveCategory] = React.useState<QCategory>("screening");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [shownHints, setShownHints] = React.useState<Set<number>>(new Set());

  const filtered = session.questions.filter((q) => q.category === activeCategory);

  // Reset index whenever category changes
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const current = filtered[currentIndex] ?? null;
  const progress = filtered.length > 0 ? ((currentIndex + 1) / filtered.length) * 100 : 0;

  const toggleHint = (id: number) => {
    setShownHints((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="iv-page">
      {/* ───── Header ───── */}
      <header className="iv-header">
        <div className="iv-header-inner">
          <div>
            <p className="iv-label">Interview Session</p>
            <h1 className="iv-candidate">{session.candidateName}</h1>
          </div>
          <div className="iv-header-right">
            <span className="iv-pill iv-level">{session.experience_level}</span>
            <span className="iv-pill iv-count">
              {session.totalQuestions} Questions
            </span>
          </div>
        </div>
      </header>

      <main className="iv-main">
        {/* ───── Category Tabs ───── */}
        <nav className="iv-tabs">
          {ALL_CATEGORIES.map((cat) => {
            const count = session.questions.filter((q) => q.category === cat).length;
            return (
              <button
                key={cat}
                className={`iv-tab${activeCategory === cat ? " iv-tab--active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span className="iv-tab-icon">{CATEGORY_ICONS[cat]}</span>
                <span className="iv-tab-label">{CATEGORY_LABELS[cat]}</span>
                <span className="iv-tab-badge">{count}</span>
              </button>
            );
          })}
        </nav>

        {/* ───── Question Card ───── */}
        {filtered.length === 0 ? (
          <div className="iv-empty">No questions in this category.</div>
        ) : (
          <div className="iv-card-wrap">
            {/* Progress bar */}
            <div className="iv-progress-bar">
              <div className="iv-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="iv-progress-text">
              Question {currentIndex + 1} of {filtered.length}
            </p>

            {/* Card */}
            <div className="iv-card">
              <div className="iv-card-top">
                <span className="iv-q-number">Q{current.id}</span>
                <span
                  className="iv-difficulty"
                  style={{ color: DIFFICULTY_COLORS[current.difficulty] }}
                >
                  ● {current.difficulty}
                </span>
              </div>

              <p className="iv-question">{current.question}</p>

              {current.hint && (
                <div className="iv-hint-wrap">
                  <button
                    className="iv-hint-toggle"
                    onClick={() => toggleHint(current.id)}
                  >
                    {shownHints.has(current.id) ? "Hide hint ▲" : "Show hint ▼"}
                  </button>
                  {shownHints.has(current.id) && (
                    <p className="iv-hint">{current.hint}</p>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="iv-nav">
              <button
                className="iv-nav-btn"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => i - 1)}
              >
                ← Previous
              </button>
              <button
                className="iv-nav-btn iv-nav-btn--next"
                disabled={currentIndex === filtered.length - 1}
                onClick={() => setCurrentIndex((i) => i + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ───── Done button ───── */}
        <button className="iv-done-btn" onClick={onDone}>
          ✓ Done — Back to Home
        </button>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        .iv-page {
          min-height: 100vh;
          background: #050505;
          font-family: 'Poppins', sans-serif;
          color: #f3f4f6;
          display: flex;
          flex-direction: column;
        }

        /* ── Header ── */
        .iv-header {
          border-bottom: 1px solid #1f1f1f;
          background: linear-gradient(180deg, #0f0f0f 0%, #080808 100%);
          padding: 20px 24px;
        }

        .iv-header-inner {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
          flex-wrap: wrap;
        }

        .iv-label {
          margin: 0 0 4px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6b7280;
        }

        .iv-candidate {
          margin: 0;
          font-size: clamp(22px, 3.5vw, 30px);
          font-weight: 700;
          background: linear-gradient(90deg, #e2e8f0, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .iv-header-right {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .iv-pill {
          border-radius: 999px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid;
        }

        .iv-level {
          border-color: rgba(74, 222, 128, 0.4);
          color: #86efac;
          background: rgba(74, 222, 128, 0.08);
          text-transform: capitalize;
        }

        .iv-count {
          border-color: #2a2a2a;
          color: #9ca3af;
          background: #111;
        }

        /* ── Main ── */
        .iv-main {
          flex: 1;
          max-width: 900px;
          width: 100%;
          margin: 0 auto;
          padding: 28px 20px 48px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* ── Tabs ── */
        .iv-tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .iv-tab {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          border-radius: 12px;
          border: 1px solid #252525;
          background: #111;
          color: #9ca3af;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .iv-tab:hover {
          border-color: #3f3f3f;
          color: #d1d5db;
        }

        .iv-tab--active {
          border-color: rgba(147, 197, 253, 0.5);
          background: rgba(59, 130, 246, 0.12);
          color: #93c5fd;
        }

        .iv-tab-icon {
          font-size: 15px;
        }

        .iv-tab-badge {
          background: #1e1e1e;
          border-radius: 999px;
          padding: 1px 7px;
          font-size: 11px;
          color: #6b7280;
        }

        .iv-tab--active .iv-tab-badge {
          background: rgba(59, 130, 246, 0.2);
          color: #93c5fd;
        }

        /* ── Card area ── */
        .iv-card-wrap {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .iv-progress-bar {
          height: 4px;
          background: #1e1e1e;
          border-radius: 999px;
          overflow: hidden;
        }

        .iv-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 999px;
          transition: width 0.35s ease;
        }

        .iv-progress-text {
          margin: 0;
          font-size: 12px;
          color: #6b7280;
          text-align: right;
        }

        .iv-card {
          background: linear-gradient(160deg, #141414, #0f0f0f);
          border: 1px solid #232323;
          border-radius: 20px;
          padding: 28px 24px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
          transition: transform 0.2s ease;
        }

        .iv-card:hover {
          transform: translateY(-2px);
        }

        .iv-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .iv-q-number {
          font-size: 12px;
          font-weight: 600;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .iv-difficulty {
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .iv-question {
          margin: 0;
          font-size: clamp(15px, 2.2vw, 18px);
          line-height: 1.65;
          color: #e5e7eb;
          font-weight: 500;
        }

        .iv-hint-wrap {
          margin-top: 18px;
        }

        .iv-hint-toggle {
          background: none;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          color: #6b7280;
          font-family: 'Poppins', sans-serif;
          font-size: 12px;
          padding: 6px 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .iv-hint-toggle:hover {
          border-color: #3f3f3f;
          color: #9ca3af;
        }

        .iv-hint {
          margin: 12px 0 0;
          font-size: 13px;
          color: #9ca3af;
          line-height: 1.5;
          border-left: 2px solid #3b82f6;
          padding-left: 12px;
        }

        /* ── Navigation ── */
        .iv-nav {
          display: flex;
          gap: 12px;
          justify-content: space-between;
        }

        .iv-nav-btn {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #252525;
          background: #111;
          color: #d1d5db;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .iv-nav-btn:hover:not(:disabled) {
          border-color: #3f3f3f;
          background: #1a1a1a;
          transform: translateY(-1px);
        }

        .iv-nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .iv-nav-btn--next {
          border-color: rgba(147, 197, 253, 0.3);
          color: #93c5fd;
        }

        /* ── Empty state ── */
        .iv-empty {
          text-align: center;
          padding: 60px 20px;
          color: #4b5563;
          font-size: 14px;
        }

        /* ── Done button ── */
        .iv-done-btn {
          align-self: center;
          padding: 12px 28px;
          border-radius: 12px;
          border: none;
          background: #fff;
          color: #000;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .iv-done-btn:hover {
          background: #e5e7eb;
          transform: translateY(-1px);
        }

        @media (max-width: 600px) {
          .iv-tabs {
            gap: 8px;
          }
          .iv-tab {
            padding: 8px 12px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default InterviewPage;
