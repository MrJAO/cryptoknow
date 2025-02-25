import React, { useState, useEffect } from "react";
import QuestBox from "./QuestBox";
import { supabase } from "../../supabaseClient";

const Quests = () => {
  const [formData, setFormData] = useState({
    discord_username: "",
    twitter_username: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
          discord_username: discordUsername,
        }));

        // Fetch user's linked Twitter username (if any)
        const { data: existingData, error: fetchError } = await supabase
          .from("user_twitter_usernames")
          .select("twitter_username")
          .eq("discord_username", discordUsername)
          .maybeSingle();

        if (fetchError) {
          console.error("Error fetching linked Twitter:", fetchError);
        } else if (existingData) {
          setFormData((prevData) => ({
            ...prevData,
            twitter_username: existingData.twitter_username,
          }));
        }
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
      // Check if Twitter username is already linked for this Discord user
      const { data: existingUser, error: checkError } = await supabase
        .from("user_twitter_usernames")
        .select("*")
        .eq("discord_username", discord_username)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingUser) {
        setMessage("⚠️ You have already linked a Twitter username!");
        setLoading(false);
        return;
      }

      // Insert new Twitter username for this Discord user
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
      <div style={{ background: "#ffcc00", padding: "10px", borderRadius: "8px", marginBottom: "10px", color: "#333", fontWeight: "bold" }}>
        Important - Twitter Username
      </div>
      <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "10px", textAlign: "left" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <label>Discord Username</label>
            <input type="text" name="discord_username" value={formData.discord_username} disabled style={{ width: "100%", padding: "8px", borderRadius: "5px", background: "#333", color: "white", border: "1px solid #555" }} />
          </div>
          <div>
            <label>Twitter Username (without @)</label>
            <input type="text" name="twitter_username" value={formData.twitter_username} onChange={handleChange} placeholder="e.g CryptoModJAO" required style={{ width: "100%", padding: "8px", borderRadius: "5px", background: "#333", color: "white", border: "1px solid #555" }} />
          </div>
          <button type="submit" disabled={loading} style={{ padding: "10px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        {message && <p style={{ marginTop: "10px", color: message.includes("⚠️") || message.includes("❌") ? "red" : "green" }}>{message}</p>}
      </div>
    </div>
  );
};

export default Quests;
