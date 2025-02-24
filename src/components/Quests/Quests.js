import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const Quests = () => {
  const [formData, setFormData] = useState({
    discord_username: "",
    twitter_username: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch logged-in user from Supabase Auth
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        setMessage("⚠️ Failed to fetch user. Please log in again.");
      } else if (data?.user) {
        const discordUsername =
          data.user.user_metadata?.user_name ||
          data.user.user_metadata?.full_name ||
          "";

        setFormData((prevData) => ({
          ...prevData,
          discord_username: discordUsername, // Auto-fill Discord username
        }));
      }
    };

    fetchUser();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { discord_username, twitter_username } = formData;

    if (!twitter_username.trim()) {
      setMessage("⚠️ Please enter your Twitter username.");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Check if the Twitter username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("user_twitter_usernames")
        .select("*")
        .eq("twitter_username", twitter_username)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingUser) {
        setMessage("⚠️ This Twitter username is already linked to your account!");
        setLoading(false);
        return; // Stop further execution
      }

      // Step 2: Insert new username if it's not already linked
      const { error: insertError } = await supabase
        .from("user_twitter_usernames")
        .insert([{ discord_username, twitter_username }]);

      if (insertError) throw insertError;

      setMessage("✅ Twitter username linked successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      setMessage("❌ Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", textAlign: "center", color: "white" }}>
      
      {/* Main Page Header */}
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>Available Quests</h1>

      {/* Quest Form Header */}
      <div style={{ background: "#ffcc00", padding: "10px", borderRadius: "8px", marginBottom: "10px", color: "#333", fontWeight: "bold" }}>
        Important - Twitter Username
      </div>

      {/* Quest Form */}
      <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "10px", textAlign: "left" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          
          {/* Discord Username - Auto-filled */}
          <div>
            <label>Discord Username</label>
            <input
              type="text"
              name="discord_username"
              value={formData.discord_username}
              disabled
              style={{ width: "100%", padding: "8px", borderRadius: "5px", background: "#333", color: "white", border: "1px solid #555" }}
            />
          </div>

          {/* Twitter Username - User Input */}
          <div>
            <label>Twitter Username</label>
            <input
              type="text"
              name="twitter_username"
              value={formData.twitter_username}
              onChange={handleChange}
              placeholder="Enter your Twitter username"
              required
              style={{ width: "100%", padding: "8px", borderRadius: "5px", background: "#333", color: "white", border: "1px solid #555" }}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} style={{ padding: "10px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {/* Message Output */}
        {message && <p style={{ marginTop: "10px", color: message.includes("⚠️") || message.includes("❌") ? "red" : "green" }}>{message}</p>}
      </div>
    </div>
  );
};

export default Quests;
