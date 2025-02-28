import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import SuggestGuideForm from "../guides/SuggestGuideForm"; // Import Suggestion Form

function Search() {
  const [selectedOption, setSelectedOption] = useState("guides");
  const [guides, setGuides] = useState([]);
  const [cryptoFiles, setCryptoFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortOption, setSortOption] = useState("importance");
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGuides();
    fetchCryptoFiles();
  }, []);

  const fetchGuides = async () => {
    const { data, error } = await supabase
      .from("guides")
      .select("id, title, slug, description, category, tags, importance");

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

  const filteredGuides = guides
    .filter(
      (guide) =>
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (guide.tags && guide.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    )
    .filter((guide) => selectedCategory === "All" || guide.category === selectedCategory)
    .filter((guide) => selectedTag === "All" || (guide.tags && guide.tags.includes(selectedTag)))
    .sort((a, b) => {
      if (sortOption === "importance") return b.importance - a.importance;
      if (sortOption === "title-asc") return a.title.localeCompare(b.title);
      if (sortOption === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });

  const uniqueCategories = ["All", ...new Set(guides.map((g) => g.category).filter(Boolean))];
  const uniqueTags = ["All", ...new Set(guides.flatMap((g) => g.tags || []))];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* Buttons Navigation */}
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px" }}>
        <button
          onClick={() => setSelectedOption("guides")}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
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
            padding: "12px 20px",
            fontSize: "16px",
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

      {/* Suggest a Guide Button */}
      {selectedOption === "guides" && (
        <button
          onClick={() => setShowSuggestionForm(true)}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "15px",
          }}
        >
          + Suggest a Guide
        </button>
      )}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title, category, or tags..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: "80%",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          marginBottom: "15px",
        }}
      />

      {/* Filters */}
      {selectedOption === "guides" && (
        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "15px" }}>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>

          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="importance">Sort by Importance</option>
            <option value="title-asc">Sort A → Z</option>
            <option value="title-desc">Sort Z → A</option>
          </select>
        </div>
      )}

      {/* Guides List */}
      {selectedOption === "guides" && (
        <>
          <h1>Guides</h1>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#333", color: "#fff", textAlign: "left" }}>
                <th style={{ padding: "10px", width: "30%" }}>Title</th>
                <th style={{ padding: "10px", width: "20%" }}>Category</th>
                <th style={{ padding: "10px", width: "30%" }}>Tags</th>
                <th style={{ padding: "10px", width: "20%" }}>Importance</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuides.map((guide) => (
                <tr key={guide.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td>
                    <a
                      onClick={() => navigate(`/guides/${guide.slug}`)}
                      role="button"
                      style={{ cursor: "pointer", color: "#007bff", textDecoration: "none" }}
                    >
                      {guide.title}
                    </a>
                  </td>
                  <td>{guide.category || "Uncategorized"}</td>
                  <td>{guide.tags ? guide.tags.join(", ") : "No Tags"}</td>
                  <td style={{ fontWeight: "bold", color: "#ff8800" }}>{guide.importance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Crypto Files List */}
      {selectedOption === "crypto" && (
        <>
          <h1>Crypto Files</h1>
          <p>Coming Soon...</p> {/* Placeholder for Crypto Files Data */}
        </>
      )}

      {/* Show Suggest Guide Form if Open */}
      {showSuggestionForm && <SuggestGuideForm onClose={() => setShowSuggestionForm(false)} />}
    </div>
  );
}

export default Search;
