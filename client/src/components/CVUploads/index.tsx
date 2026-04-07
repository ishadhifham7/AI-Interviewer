import React, { useState } from "react";
import axios from "axios";

const CVUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a file");
      return;
    }

    const formData = new FormData();
    formData.append("cv", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/cv/upload",
        formData,
      );
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button onClick={handleUpload}>Upload CV</button>
    </div>
  );
};

export default CVUpload;
