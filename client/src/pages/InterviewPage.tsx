import React, { useState, useEffect } from "react";
import AiTalkAnimation from "../components/ui/ai-talk-animation";

const InterviewPage: React.FC = () => {
  const [isTalking, setIsTalking] = useState<boolean>(false);
  const [isUserTalking, setIsUserTalking] = useState<boolean>(false);

  // Simulation for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTalking((prev) => !prev);
      setIsUserTalking((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="interview-page">
        <div className="background-glow" />

        {/* --- TOP HUD --- */}
        <header className="interview-hud">
          <div className="role-tag">
            <span className="dot"></span>
            Full-Stack Developer Intern
          </div>
          <button className="exit-button" onClick={() => console.log("Exit")}>
            Exit Interview
          </button>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="content-container">
          <div className="animation-wrapper">
            <div className="animation-scale-container">
              <AiTalkAnimation state={isTalking ? "talking" : "idle"} />
            </div>
          </div>

          <div className="status-text">
            {isTalking ? "AI is speaking..." : "Listening..."}
          </div>
        </main>

        {/* --- USER VOICE VISUALIZER --- */}
        <footer className="user-waveform-container">
          <div className={`waveform ${isUserTalking ? "active" : ""}`}>
            {[...Array(20)].map((_, i) => (
              <div key={i} className="bar"></div>
            ))}
          </div>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        .interview-page {
          min-height: 100vh;
          width: 100%;
          background-color: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Poppins', sans-serif;
          position: relative;
          overflow: hidden;
          animation: fadeIn 0.35s ease;
        }

        /* --- HUD STYLES --- */
        .interview-hud {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 2rem 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }

        .role-tag {
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          padding: 0.6rem 1.2rem;
          border-radius: 100px;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        .role-tag .dot {
          width: 6px;
          height: 6px;
          background: #ffbf48;
          border-radius: 50%;
          box-shadow: 0 0 10px #ffbf48;
        }

        .exit-button {
          background: transparent;
          color: #ff4d4d;
          border: 1px solid rgba(255, 77, 77, 0.3);
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .exit-button:hover {
          background: rgba(255, 77, 77, 0.1);
          border-color: #ff4d4d;
          transform: translateY(-2px);
        }

        /* --- CONTENT STYLES --- */
        .background-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60vw;
          height: 60vw;
          background: radial-gradient(circle, rgba(255, 191, 72, 0.03) 0%, rgba(0, 0, 0, 0) 70%);
          border-radius: 50%;
          z-index: 1;
          pointer-events: none;
        }

        .content-container {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3rem;
        }

        .animation-wrapper::after {
          content: "";
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255, 191, 72, 0.08) 0%, rgba(0,0,0,0) 70%);
          border-radius: 50%;
          z-index: -1;
          filter: blur(40px);
        }

        .status-text {
          color: #ffffff;
          font-size: 1rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          opacity: 0.5;
          animation: pulse 2.5s infinite;
        }

        /* --- USER WAVEFORM --- */
        .user-waveform-container {
          position: absolute;
          bottom: 10%;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .waveform {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 40px;
        }

        .bar {
          width: 3px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          transition: all 0.2s ease;
        }

        .waveform.active .bar {
          background: rgba(255, 255, 255, 0.6);
          animation: wave 1.2s infinite ease-in-out;
        }

        /* Staggered animation for the bars */
        .waveform.active .bar:nth-child(even) { animation-delay: 0.2s; }
        .waveform.active .bar:nth-child(3n) { animation-delay: 0.4s; }

        @keyframes wave {
          0%, 100% { height: 4px; }
          50% { height: 30px; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .interview-hud { padding: 1.5rem; }
          .role-tag { font-size: 0.7rem; }
          .exit-button { font-size: 0.7rem; }
        }
      `}</style>
    </>
  );
};

export default InterviewPage;
