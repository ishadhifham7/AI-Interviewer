import React from "react";
import axios from "axios";
import CVUpload from "./pages/home";
import Loader from "./components/ui/loader";
import DemoPage from "./pages/demo";
import InterviewPage from "./pages/InterviewPage";
import FeedbackPage from "./pages/FeedbackPage";
import api from "./lib/api";
import { generateInterviewFeedback } from "./lib/feedbackApi";
import { Feedback } from "./types/feedback";

type AppPage = "home" | "loading" | "demo" | "interview" | "feedback";

function App() {
  const [page, setPage] = React.useState<AppPage>("home");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [cvData, setCvData] = React.useState<unknown>(null);
  const [fileId, setFileId] = React.useState("");
  const [feedback, setFeedback] = React.useState<Feedback | null>(null);
  const [feedbackError, setFeedbackError] = React.useState("");
  const [isFinishing, setIsFinishing] = React.useState(false);

  // ── Upload CV ──────────────────────────────────────────────────────────────
  const handleStartInterview = async (file: File) => {
    const formData = new FormData();
    formData.append("cv", file);

    setErrorMessage("");
    setFeedback(null);
    setFeedbackError("");
    setPage("loading");

    try {
      const res = await api.post("/cv/upload", formData);

      console.log("Structured CV JSON:", res.data.cvData);
      setCvData(res.data.cvData);
      setFileId(res.data.fileId || "");
      setPage("demo");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiError =
          (err.response?.data as { error?: string } | undefined)?.error || err.message;
        setErrorMessage(apiError);
      } else {
        setErrorMessage("Upload failed. Please try again.");
      }
      setPage("home");
      console.error(err);
    }
  };

  const handleFinishInterview = async () => {
    setFeedbackError("");
    setIsFinishing(true);

    try {
      const result = await generateInterviewFeedback();
      setFeedback(result);
      setPage("feedback");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiError =
          (err.response?.data as { error?: string } | undefined)?.error ||
          err.message;
        setFeedbackError(apiError);
      } else {
        setFeedbackError("Failed to generate feedback. Please try again.");
      }

      console.error(err);
    } finally {
      setIsFinishing(false);
    }
  };

  if (page === "loading") {
    return (
      <div className="loading-page">
        <div className="loading-inner">
          <Loader />
          <p>Processing your CV...</p>
        </div>

        <style>{`
          .loading-page {
            min-height: 100vh;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .loading-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 14px;
            color: #d1d5db;
            font-family: 'Poppins', sans-serif;
          }

          .loading-inner p {
            margin: 0;
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  if (page === "demo") {
    return (
      <DemoPage
        cvData={cvData}
        fileId={fileId}
        interviewError={interviewError}
        onGoHome={() => {
          setPage("home");
          setErrorMessage("");
          setFeedback(null);
          setFeedbackError("");
        }}
        onStartInterview={() => setPage("interview")}
      />
    );
  }

  if (page === "interview") {
    return (
      <InterviewPage
        onFinishInterview={handleFinishInterview}
        isFinishing={isFinishing}
        finishError={feedbackError}
      />
    );
  }

  if (page === "feedback" && feedback) {
    return (
      <FeedbackPage
        feedback={feedback}
        onRestart={() => {
          setPage("home");
          setFeedback(null);
          setFeedbackError("");
        }}
      />
    );
  }

  return (
    <CVUpload onStartInterview={handleStartInterview} errorMessage={errorMessage} />
  );
}

export default App;
