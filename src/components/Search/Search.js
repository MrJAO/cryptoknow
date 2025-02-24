import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

function Search() {
  const [selectedOption, setSelectedOption] = useState("guides"); // Default to "guides"
  const [guides, setGuides] = useState([]);
  const [cryptoFiles, setCryptoFiles] = useState([]);

  useEffect(() => {
    if (selectedOption === "guides") {
      fetchGuides();
    } else if (selectedOption === "crypto") {
      fetchCryptoFiles();
    }
  }, [selectedOption]);

  const fetchGuides = async () => {
    const { data, error } = await supabase.from("guides").select("*");
    if (error) {
      console.error("Error fetching guides:", error);
    } else {
      setGuides(data);
    }
  };

  const fetchCryptoFiles = async () => {
    const { data, error } = await supabase.from("crypto_files").select("*");
    if (error) {
      console.error("Error fetching crypto files:", error);
    } else {
      setCryptoFiles(data);
    }
  };

  const getAccuracyEmoji = (accuracy) => {
    return accuracy === "Accurate" ? "✔️ Accurate" : "🟠 Can't Confirm";
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Search</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() => setSelectedOption("guides")}
          style={{
            padding: "15px 30px",
            fontSize: "18px",
            cursor: "pointer",
            background: selectedOption === "guides" ? "#007bff" : "#fff",
            color: selectedOption === "guides" ? "#fff" : "#000",
            border: "1px solid #007bff",
            borderRadius: "5px",
          }}
        >
          Beginner Guides
        </button>
        <button
          onClick={() => setSelectedOption("crypto")}
          style={{
            padding: "15px 30px",
            fontSize: "18px",
            cursor: "pointer",
            background: selectedOption === "crypto" ? "#007bff" : "#fff",
            color: selectedOption === "crypto" ? "#fff" : "#000",
            border: "1px solid #007bff",
            borderRadius: "5px",
          }}
        >
          Crypto Files
        </button>
      </div>

      {/* Content Section */}
      <div style={{ maxWidth: "90vw", margin: "auto", padding: "20px" }}>
        {selectedOption === "guides" && (
          <>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Guides</h1>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#333", color: "#fff", textAlign: "left" }}>
                    <th style={{ padding: "10px", width: "40%" }}>Title</th>
                    <th style={{ padding: "10px", width: "40%" }}>Guide Link</th>
                    <th style={{ padding: "10px", width: "20%" }}>Importance</th>
                  </tr>
                </thead>
                <tbody>
                  {guides.map((guide) => (
                    <tr key={guide.id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "10px", fontWeight: "bold" }}>{guide.title}</td>
                      <td style={{ padding: "10px" }}>
                        <a
                          href={guide.guide_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#007bff", textDecoration: "none" }}
                        >
                          Open Guide
                        </a>
                      </td>
                      <td style={{ padding: "10px", fontWeight: "bold", color: "#ff8800" }}>
                        {guide.importance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {selectedOption === "crypto" && (
          <>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Crypto Files</h1>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#333", color: "#fff", textAlign: "left" }}>
                    <th style={{ padding: "10px", width: "30%" }}>Detail Name</th>
                    <th style={{ padding: "10px", width: "30%" }}>Source Link</th>
                    <th style={{ padding: "10px", width: "20%" }}>Source</th>
                    <th style={{ padding: "10px", width: "20%" }}>Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptoFiles.map((file) => (
                    <tr key={file.id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "10px", fontWeight: "bold" }}>{file.detail_name}</td>
                      <td style={{ padding: "10px" }}>
                        <a
                          href={file.source_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#007bff", textDecoration: "none" }}
                        >
                          Open Source
                        </a>
                      </td>
                      <td style={{ padding: "10px", fontWeight: "bold" }}>{file.source}</td>
                      <td style={{ padding: "10px", fontWeight: "bold", color: "#ff8800" }}>
                        {getAccuracyEmoji(file.accuracy)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Search;
