import React from "react";
import axios from "axios";
import CVUpload from "./pages/home";
import Loader from "./components/ui/loader";
import DemoPage from "./pages/demo";
import InterviewPage from "./pages/interview";

type AppPage = "home" | "loading" | "demo" | "interview-loading" | "interview";

type ISession = {
  candidateName: string;
  experience_level: string;
  questions: {
    id: number;
    category: "screening" | "project" | "technical" | "behavioural" | "challenge";
    question: string;
    difficulty: "easy" | "medium" | "hard";
    hint?: string;
  }[];
  totalQuestions: number;
  generatedAt: string;
};

function App() {
  const [page, setPage] = React.useState<AppPage>("home");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [cvData, setCvData] = React.useState<unknown>(null);
  const [fileId, setFileId] = React.useState("");
  const [interviewSession, setInterviewSession] = React.useState<ISession | null>(null);
  const [interviewError, setInterviewError] = React.useState("");

  // ── Upload CV ──────────────────────────────────────────────────────────────
  const handleStartInterview = async (file: File) => {
    const formData = new FormData();
    formData.append("cv", file);

    setErrorMessage("");
    setPage("loading");

    try {
      const res = await axios.post("http://localhost:5000/api/cv/upload", formData);
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

  // ── Generate Interview Questions ───────────────────────────────────────────
  const handleGenerateInterview = async () => {
    if (!cvData) return;

    setInterviewError("");
    setPage("interview-loading");

    try {
      const res = await axios.post("http://localhost:5000/api/interview/generate", {
        cvData,
      });
      console.log("Interview session:", res.data.session);
      setInterviewSession(res.data.session);
      setPage("interview");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiError =
          (err.response?.data as { error?: string } | undefined)?.error || err.message;
        setInterviewError(apiError);
      } else {
        setInterviewError("Failed to generate interview questions. Please try again.");
      }
      setPage("demo");
      console.error(err);
    }
  };

  // ── Loading screens ────────────────────────────────────────────────────────
  const LoadingScreen = ({ message }: { message: string }) => (
    <div className="loading-page">
      <div className="loading-inner">
        <Loader />
        <p>{message}</p>
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

  if (page === "loading") return <LoadingScreen message="Processing your CV…" />;

  if (page === "interview-loading")
    return <LoadingScreen message="Generating your interview questions…" />;

  if (page === "demo") {
    return (
      <DemoPage
        cvData={cvData}
        fileId={fileId}
        interviewError={interviewError}
        onGoHome={() => {
          setPage("home");
          setErrorMessage("");
        }}
        onStartInterview={handleGenerateInterview}
      />
    );
  }

  if (page === "interview" && interviewSession) {
    return (
      <InterviewPage
        session={interviewSession}
        onDone={() => {
          setPage("home");
          setErrorMessage("");
          setInterviewSession(null);
        }}
      />
    );
  }

  return (
    <CVUpload onStartInterview={handleStartInterview} errorMessage={errorMessage} />
  );
}

export default App;
