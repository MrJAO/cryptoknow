import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import SuggestGuideForm from "../guides/SuggestGuideForm"; // Import Suggestion Form

function Search() {
  const [selectedOption, setSelectedOption] = useState("guides");
  const [guides, setGuides] = useState([]);
  const [cryptoFiles, setCryptoFiles] = useState([]);
  const [completedGuides, setCompletedGuides] = useState(new Set()); // ✅ Store as a Set for fast lookups
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortOption, setSortOption] = useState("importance");
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGuides();
    fetchCryptoFiles();
    fetchCompletedGuides();
  }, []);

  // Fetch Guide List
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

  // Fetch Completed Guides
  const fetchCompletedGuides = async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return;

    const discord_username =
      user.data.user?.user_metadata?.user_name ||
      user.data.user?.user_metadata?.full_name ||
      "";

    const { data, error } = await supabase
      .from("guide_progress")
      .select("guide_slug")
      .eq("discord_username", discord_username);

    if (error) {
      console.error("❌ Error fetching completed guides:", error);
    } else {
      const completedSet = new Set(data.map((g) => g.guide_slug));
      setCompletedGuides(completedSet);
    }
  };

  // Fetch Crypto Files
  const fetchCryptoFiles = async () => {
    const { data, error } = await supabase
      .from("crypto_files")
      .select("id, detail_name, source, source_link, accuracy");

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

  const filteredCryptoFiles = cryptoFiles.filter(
    (file) =>
      file.detail_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Guide Progress */}
      {selectedOption === "guides" && (
        <div style={{ marginBottom: "20px" }}>
          <p>
            📖 Progress: <strong>{completedGuides.size}</strong> / {guides.length} guides completed
          </p>
          <progress value={completedGuides.size} max={guides.length} style={{ width: "100%" }}></progress>
        </div>
      )}

      {/* Search Bar */}
      <input
        type="text"
        placeholder={selectedOption === "guides" ? "Search Guides..." : "Search Crypto Files..."}
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
                      style={{
                        cursor: "pointer",
                        color: completedGuides.has(guide.slug) ? "#28a745" : "#007bff",
                        textDecoration: "none",
                      }}
                    >
                      {completedGuides.has(guide.slug) ? `✅ ${guide.title}` : guide.title}
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
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#333", color: "#fff", textAlign: "left" }}>
                <th style={{ padding: "10px", width: "40%" }}>Detail Name</th>
                <th style={{ padding: "10px", width: "30%" }}>Source</th>
                <th style={{ padding: "10px", width: "30%" }}>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {filteredCryptoFiles.map((file) => (
                <tr key={file.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td>{file.detail_name}</td>
                  <td><a href={file.source_link} target="_blank">{file.source}</a></td>
                  <td>{getAccuracyEmoji(file.accuracy)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
	
	{/* Suggest a Guide Button */}
		  {selectedOption === "guides" && (
			<div style={{ textAlign: "center", paddingBottom: "20px" }}>
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
				}}
			  >
				+ Suggest a Guide
			  </button>
			</div>
		  )}

		  {/* Show Suggest Guide Form if Open */}
		  {showSuggestionForm && <SuggestGuideForm onClose={() => setShowSuggestionForm(false)} />}
		</>
  );
}

export default Search;
