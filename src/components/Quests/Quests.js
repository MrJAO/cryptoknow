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
      const { data: existingUser, error: checkError } = await supabase
        .from("user_twitter_usernames")
        .select("*")
        .eq("twitter_username", twitter_username)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existingUser) {
        setMessage("⚠️ This Twitter username is already linked to your account!");
        setLoading(false);
        return;
      }

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
      {/* Removed the incorrect <QuestsBox /> */}
    </div>
  );
};

const QuestsBox = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto", textAlign: "center", color: "white" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
        Available Quests
      </h1>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
        <QuestBox
          title="Discord Quest"
          tableName="discord_quests"
          fields={[
            { name: "discord_username", label: "Discord Username", placeholder: "", disabled: true, required: true },
            { name: "answer", label: "Your Answer", placeholder: "Enter your answer", disabled: false, required: true },
          ]}
        />
        <QuestBox
          title="Other Quest"
          tableName="other_quests"
          fields={[
            { name: "discord_username", label: "Discord Username", placeholder: "", disabled: true, required: true },
            { name: "task_input", label: "Task Details", placeholder: "Describe your task", disabled: false, required: true },
          ]}
        />
        <QuestBox
          title="Twitter Quest"
          tableName="twitter_quests"
          fields={[
            { name: "discord_username", label: "Discord Username", placeholder: "", disabled: true, required: true },
            { name: "twitter_post", label: "Tweet Link", placeholder: "Paste your tweet link", disabled: false, required: true },
          ]}
        />
      </div>
    </div>
  );
};

export default Quests;
