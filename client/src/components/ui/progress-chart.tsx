import React, { useEffect, useState } from "react";

type ProgressChartProps = {
  score: number;
};

const ProgressChart: React.FC<ProgressChartProps> = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Simple count up animation
    let start = 0;
    const duration = 1000;
    const increment = score / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        clearInterval(timer);
        setAnimatedScore(score);
      } else {
        setAnimatedScore(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  const percentage = (animatedScore / 10) * 100;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-chart-container">
      <svg width="160" height="160" className="progress-circle">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#1f2937"
          strokeWidth="12"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#4ade80"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="progress-circle-value"
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>
      <div className="progress-score-text">
        <span className="score-value">{animatedScore.toFixed(1)}</span>
        {/* <span className="score-max">/ 10</span> */}
      </div>

      <style>{`
        .progress-chart-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 160px;
          height: 160px;
        }

        .progress-circle {
          transform: rotate(-90deg);
        }

        .progress-circle-value {
          filter: drop-shadow(0 0 6px rgba(74, 222, 128, 0.4));
        }

        .progress-score-text {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .score-value {
          font-size: 36px;
          font-weight: 600;
          color: #f3f4f6;
          line-height: 1;
        }

        .score-max {
          font-size: 14px;
          color: #9ca3af;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default ProgressChart;
