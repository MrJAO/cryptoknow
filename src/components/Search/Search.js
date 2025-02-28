import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom"; // Added for dynamic navigation

function Search() {
  const [selectedOption, setSelectedOption] = useState("guides"); // Default to "guides"
  const [guides, setGuides] = useState([]);
  const [cryptoFiles, setCryptoFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("None");
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (selectedOption === "guides") {
      fetchGuides();
    } else if (selectedOption === "crypto") {
      fetchCryptoFiles();
    }
  }, [selectedOption]);

  const fetchGuides = async () => {
    const { data, error } = await supabase
      .from("guides")
      .select("id, title, slug, description, importance, category, tags");

    if (error) {
      console.error("❌ Error fetching guides:", error);
    } else {
      setGuides(data);
    }
  };

  const fetchCryptoFiles = async () => {
    const { data, error } = await supabase.from("crypto_files").select("*");
    if (error) {
      console.error("❌ Error fetching crypto files:", error);
    } else {
      setCryptoFiles(data);
    }
  };

  const getAccuracyEmoji = (accuracy) => {
    return accuracy === "Accurate" ? "✔️ Accurate" : "🟠 Can't Confirm";
  };

  const filteredGuides = guides
    .filter((guide) =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (guide.tags && guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    .filter((guide) => selectedCategory === "All" || guide.category === selectedCategory)
    .sort((a, b) => {
      if (sortOrder === "Ascending") return a.importance.localeCompare(b.importance);
      if (sortOrder === "Descending") return b.importance.localeCompare(a.importance);
      return 0;
    });

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* Button Navigation */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px" }}>
        <button onClick={() => setSelectedOption("guides")}>Beginner Guides</button>
        <button onClick={() => setSelectedOption("crypto")}>Crypto Files</button>
      </div>

      {/* Search Bar */}
      <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      {/* Filters */}
      {selectedOption === "guides" && (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "10px 0" }}>
          <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
            <option value="All">All Categories</option>
            <option value="Airdrops">Airdrops</option>
            <option value="DeFi">DeFi</option>
            <option value="Wallets">Wallets</option>
            <option value="Security">Security</option>
          </select>

          <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
            <option value="None">Sort by Importance</option>
            <option value="Ascending">Low to High</option>
            <option value="Descending">High to Low</option>
          </select>
        </div>
      )}

      {/* Content Section */}
      <div>
        {selectedOption === "guides" && (
          <>
            <h1>Guides</h1>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Importance</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuides.map((guide) => (
                  <tr key={guide.id}>
                    <td>
                      <a onClick={() => navigate(`/guides/${guide.slug}`)}>{guide.title}</a>
                    </td>
                    <td>{guide.description || "No description available."}</td>
                    <td>{guide.category}</td>
                    <td>{guide.importance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {selectedOption === "crypto" && (
          <>
            <h1>Crypto Files</h1>
            <table>
              <thead>
                <tr>
                  <th>Detail Name</th>
                  <th>Source Link</th>
                  <th>Source</th>
                  <th>Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {cryptoFiles.map((file) => (
                  <tr key={file.id}>
                    <td>{file.detail_name}</td>
                    <td>
                      <a href={file.source_link} target="_blank" rel="noopener noreferrer">Open Source</a>
                    </td>
                    <td>{file.source}</td>
                    <td>{getAccuracyEmoji(file.accuracy)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default Search;
