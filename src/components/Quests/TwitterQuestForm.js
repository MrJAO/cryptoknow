import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

function TwitterQuestForm({ discordUser }) {
  const [formData, setFormData] = useState({
    twitter_username: "",
    quest_details: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (discordUser) {
      fetchTwitterUsername();
    }
  }, [discordUser]);

  // Fetch Twitter username from the database
  const fetchTwitterUsername = async () => {
    const { data } = await supabase
      .from("user_twitter_usernames")
      .select("twitter_username")
      .eq("discord_username", discordUser)
      .single();

    if (data) {
      setFormData((prevData) => ({
        ...prevData,
        twitter_username: data.twitter_username,
      }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.twitter_username) {
      setMessage("⚠️ Please set up your Twitter username first.");
      return;
    }

    const { error } = await supabase.from("twitter_quests").insert([
      {
        discord_username: discordUser,
        twitter_username: formData.twitter_username,
        quest_details: formData.quest_details,
      },
    ]);

    if (error) {
      setMessage("❌ Submission failed. Please try again.");
    } else {
      setMessage("✅ Submission successful!");
      setFormData({ twitter_username: formData.twitter_username, quest_details: "" });
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
      <h2>Twitter Quest</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Twitter Username:</label>
        <input type="text" value={formData.twitter_username} disabled />
        
        <label>Quest Details:</label>
        <textarea
          name="quest_details"
          value={formData.quest_details}
          onChange={handleChange}
          required
          placeholder="Enter quest details"
        />
        
        <div style={{ textAlign: "right", marginTop: "10px" }}>
          <button type="submit">Submit Quest</button>
        </div>
      </form>
    </div>
  );
}

export default TwitterQuestForm;
