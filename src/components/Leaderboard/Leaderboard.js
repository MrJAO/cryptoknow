import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search input state

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("points", { ascending: false }); // Sort by points in descending order

    if (error) {
      console.error("Error fetching leaderboard:", error);
    } else {
      setLeaders(data);
    }
  };

  // Filtered leaders based on search query
  const filteredLeaders = leaders.filter((leader) =>
    leader.discord_username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Leaderboard</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Discord Username..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "15px",
          fontSize: "16px",
          width: "80%",
          maxWidth: "400px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          textAlign: "center",
        }}
      />

      <div
        style={{
          width: "100%",
          overflowX: "auto",
          padding: "20px",
          maxWidth: "800px",
          margin: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "400px",
          }}
        >
          <thead>
            <tr style={{ background: "#333", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: "12px", width: "10%" }}>Rank</th>
              <th style={{ padding: "12px", width: "60%" }}>Discord Username</th>
              <th style={{ padding: "12px", width: "30%" }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaders.length > 0 ? (
              filteredLeaders.map((leader, index) => (
                <tr key={leader.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>#{index + 1}</td>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>{leader.discord_username}</td>
                  <td style={{ padding: "12px" }}>{leader.points}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: "12px", textAlign: "center" }}>
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
