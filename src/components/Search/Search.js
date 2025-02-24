import React, { useState } from "react";
import Guides from "./Guides"; // Import Guides.js
// import CryptoFiles from "./CryptoFiles"; // Uncomment when CryptoFiles.js is ready

function Search() {
  const [selectedOption, setSelectedOption] = useState(null);

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

      {/* Render content below based on selected option */}
      {selectedOption === "guides" && <Guides />}
      {/* {selectedOption === "crypto" && <CryptoFiles />} */}
    </div>
  );
}

export default Search;
