import React from "react";

interface DemoPageProps {
  cvData: unknown;
  fileId?: string;
  onGoHome: () => void;
}

type CVProject = {
  name?: string;
  technologies?: string[];
  description?: string;
};

type CVExperience = {
  role?: string;
  company?: string;
  duration?: string;
};

type CVData = {
  name?: string;
  professional_summary?: string;
  skills?: unknown[];
  projects?: CVProject[];
  experience?: CVExperience[];
  education?: unknown[];
  achievements_and_volunteering?: unknown[];
  certifications?: unknown[];
  additional_information?: string;
  experience_level?: string;
};

const asCVData = (value: unknown): CVData => {
  if (!value || typeof value !== "object") {
    return {};
  }
  return value as CVData;
};

const hasText = (value?: string): boolean => Boolean(value && value.trim());

const hasItems = <T,>(value?: T[]): boolean =>
  Array.isArray(value) && value.length > 0;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeText = (value: unknown): string => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeText(item))
      .filter(Boolean)
      .join(" | ");
  }

  if (isRecord(value)) {
    const preferredOrder = [
      "name",
      "title",
      "degree",
      "role",
      "institution",
      "company",
      "issuer",
      "organization",
      "duration",
      "year",
      "description",
    ];

    const orderedValues = preferredOrder
      .filter((key) => key in value)
      .map((key) => normalizeText(value[key]))
      .filter(Boolean);

    const remainingValues = Object.entries(value)
      .filter(([key]) => !preferredOrder.includes(key))
      .map(([, item]) => normalizeText(item))
      .filter(Boolean);

    const parts = [...orderedValues, ...remainingValues].filter(
      (part, index, arr) => arr.indexOf(part) === index,
    );

    return parts.join(" | ");
  }

  return "";
};

const normalizeTextList = (value?: unknown[]): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => normalizeText(item))
    .map((item) => item.trim())
    .filter(Boolean);
};

const DemoPage: React.FC<DemoPageProps> = ({ cvData, fileId, onGoHome }) => {
  const data = asCVData(cvData);
  const normalizedSkills = normalizeTextList(data.skills);
  const normalizedEducation = normalizeTextList(data.education);
  const normalizedAchievements = normalizeTextList(
    data.achievements_and_volunteering,
  );
  const normalizedCertifications = normalizeTextList(data.certifications);

  const showIntro =
    hasText(data.name) ||
    hasText(data.professional_summary) ||
    hasText(data.experience_level) ||
    hasText(fileId);

  const showSkills = hasItems(normalizedSkills);
  const showExperience = hasItems(data.experience);
  const showProjects = hasItems(data.projects);
  const showEducation = hasItems(normalizedEducation);
  const showAchievements = hasItems(normalizedAchievements);
  const showCertifications = hasItems(normalizedCertifications);
  const showAdditional = hasText(data.additional_information);

  return (
    <div className="demo-page">
      <div className="demo-shell">
        <div className="demo-header">
          <h1 className="demo-title">CV Data Preview</h1>
          <p className="demo-subtitle">
            Review the extracted details and confirm your profile was parsed
            correctly.
          </p>
        </div>

        <div className="bento-grid">
          {showIntro && (
            <section className="bento-card bento-intro">
              <div>
                <p className="card-label">Candidate</p>
                <h2 className="intro-name">
                  {data.name || "Unnamed Candidate"}
                </h2>
                {hasText(data.professional_summary) && (
                  <p className="intro-summary">{data.professional_summary}</p>
                )}
              </div>

              <div className="intro-meta">
                {hasText(data.experience_level) && (
                  <span className="pill">{data.experience_level}</span>
                )}
                {fileId && <span className="file-pill">ID: {fileId}</span>}
              </div>
            </section>
          )}

          {showSkills && (
            <section className="bento-card">
              <h3>Skills</h3>
              <div className="chip-wrap">
                {normalizedSkills.map((skill, index) => (
                  <span key={`${skill}-${index}`} className="chip">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {showExperience && (
            <section className="bento-card bento-wide">
              <h3>Experience</h3>
              <div className="stack">
                {data.experience?.map((item, index) => (
                  <article
                    key={`${item.role}-${item.company}-${index}`}
                    className="row-card"
                  >
                    <p className="row-title">
                      {item.role || "Role not specified"}
                    </p>
                    <p className="row-meta">
                      {[item.company, item.duration]
                        .filter(Boolean)
                        .join(" | ")}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {showProjects && (
            <section className="bento-card bento-wide">
              <h3>Projects</h3>
              <div className="stack">
                {data.projects?.map((project, index) => (
                  <article
                    key={`${project.name}-${index}`}
                    className="row-card"
                  >
                    <p className="row-title">
                      {project.name || "Untitled Project"}
                    </p>

                    {hasItems(project.technologies) && (
                      <div className="chip-wrap small-gap">
                        {project.technologies?.map((tech) => (
                          <span
                            key={`${project.name}-${tech}`}
                            className="chip muted"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {hasText(project.description) && (
                      <p className="row-text">{project.description}</p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {showEducation && (
            <section className="bento-card">
              <h3>Education</h3>
              <ul className="list">
                {normalizedEducation.map((entry, index) => (
                  <li key={`${entry}-${index}`}>{entry}</li>
                ))}
              </ul>
            </section>
          )}

          {showAchievements && (
            <section className="bento-card">
              <h3>Achievements & Volunteering</h3>
              <ul className="list">
                {normalizedAchievements.map((entry, index) => (
                  <li key={`${entry}-${index}`}>{entry}</li>
                ))}
              </ul>
            </section>
          )}

          {showCertifications && (
            <section className="bento-card">
              <h3>Certifications</h3>
              <ul className="list">
                {normalizedCertifications.map((entry, index) => (
                  <li key={`${entry}-${index}`}>{entry}</li>
                ))}
              </ul>
            </section>
          )}

          {showAdditional && (
            <section className="bento-card">
              <h3>Additional Information</h3>
              <p className="row-text">{data.additional_information}</p>
            </section>
          )}
        </div>

        <div className="nav-btn">
          <button className="demo-btn" onClick={onGoHome}>
            Back To Home
          </button>
          <button className="demo-btn" onClick={onGoHome}>
            Start Interview
          </button>
        </div>
      </div>

      <style>{`
        .demo-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          padding: 30px 18px;
          font-family: 'Poppins', sans-serif;
        }

        .demo-shell {
          width: min(1120px, 100%);
          display: flex;
          flex-direction: column;
          gap: 16px;
          color: #fff;
          align-items: center;
        }

        .demo-header {
          width: 100%;
          text-align: center;
          padding: 6px 0;
        }

        .demo-title {
          margin: 0;
          font-size: clamp(24px, 3vw, 32px);
        }

        .demo-subtitle {
          margin: 8px 0 0;
          color: #a3a3a3;
          font-size: 13px;
        }

        .bento-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: 14px;
        }

        .bento-card {
          grid-column: span 4;
          background: linear-gradient(180deg, #141414 0%, #101010 100%);
          border: 1px solid #232323;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }

        .bento-intro {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
          background:
            radial-gradient(circle at 85% 20%, rgba(56, 189, 248, 0.15), transparent 40%),
            linear-gradient(180deg, #171717 0%, #111111 100%);
        }

        .bento-wide {
          grid-column: span 6;
        }

        .card-label {
          margin: 0;
          color: #9ca3af;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .intro-name {
          margin: 6px 0 10px;
          font-size: clamp(26px, 4vw, 36px);
          line-height: 1.1;
        }

        .intro-summary {
          margin: 0;
          color: #d4d4d4;
          max-width: 760px;
          font-size: 14px;
          line-height: 1.5;
        }

        .intro-meta {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
          min-width: 190px;
        }

        .pill,
        .file-pill {
          border-radius: 999px;
          padding: 7px 11px;
          font-size: 12px;
          border: 1px solid #2f2f2f;
          background: #0f0f0f;
          color: #e5e7eb;
          white-space: nowrap;
        }

        .pill {
          text-transform: capitalize;
          border-color: rgba(74, 222, 128, 0.35);
          color: #86efac;
        }

        .file-pill {
          color: #a3a3a3;
          max-width: 260px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bento-card h3 {
          margin: 0 0 12px;
          font-size: 16px;
          color: #f3f4f6;
        }

        .chip-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .small-gap {
          margin: 8px 0;
        }

        .chip {
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 12px;
          color: #bae6fd;
          background: rgba(14, 116, 144, 0.15);
        }

        .chip.muted {
          border-color: #2f2f2f;
          color: #d1d5db;
          background: #0f0f0f;
        }

        .stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .row-card {
          background: #0d0d0d;
          border: 1px solid #242424;
          border-radius: 12px;
          padding: 12px;
        }

        .row-title {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .row-meta {
          margin: 6px 0 0;
          color: #9ca3af;
          font-size: 12px;
        }

        .row-text {
          margin: 8px 0 0;
          color: #d1d5db;
          font-size: 13px;
          line-height: 1.45;
        }

        .list {
          margin: 0;
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #d1d5db;
          font-size: 13px;
          line-height: 1.4;
        }

        .nav-btn {
          display: flex;
          gap: 12px; /* adjust spacing as you like */
        }

        .demo-btn {
          align-self: center;
          border: none;
          border-radius: 8px;
          padding: 11px 18px;
          background: #fff;
          color: #000;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .demo-btn:hover {
          background: #e5e5e5;
          transform: translateY(-1px);
        }

        @media (max-width: 980px) {
          .bento-card {
            grid-column: span 6;
          }

          .bento-intro {
            grid-column: 1 / -1;
            flex-direction: column;
          }

          .intro-meta {
            justify-content: flex-start;
          }
        }

        @media (max-width: 640px) {
          .bento-card,
          .bento-wide {
            grid-column: 1 / -1;
          }

          .demo-page {
            padding: 22px 12px;
          }

          .bento-grid {
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default DemoPage;
