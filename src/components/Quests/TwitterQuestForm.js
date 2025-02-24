import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

function TwitterQuestForm() {
  const [formData, setFormData] = useState({
    discord_username: "",
    twitter_username: "",
    quest_details: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        setMessage("⚠️ Failed to fetch user. Please log in again.");
      } else if (data?.user) {
        const discordUsername = data.user.user_metadata?.user_name || data.user.user_metadata?.full_name || "";
        
        setFormData((prevData) => ({
          ...prevData,
          discord_username: discordUsername,
        }));

        fetchTwitterUsername(discordUsername);
      }
    };

    fetchUser();
  }, []);

  // Fetch Twitter username from the database
  const fetchTwitterUsername = async (discordUsername) => {
    const { data } = await supabase
      .from("user_twitter_usernames")
      .select("twitter_username")
      .eq("discord_username", discordUsername)
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

    if (!formData.discord_username) {
      setMessage("⚠️ Discord username is missing. Please log in again.");
      return;
    }

    if (!formData.twitter_username) {
      setMessage("⚠️ Please set up your Twitter username first.");
      return;
    }

    const { error } = await supabase.from("twitter_quests").insert([
      {
        discord_username: formData.discord_username,
        twitter_username: formData.twitter_username,
        quest_details: formData.quest_details,
      },
    ]);

    if (error) {
      console.error("Error submitting quest:", error);
      setMessage("❌ Failed to submit. Please try again.");
    } else {
      setMessage("✅ Submission successful!");
      setFormData({ ...formData, quest_details: "" });
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
      <h2>Twitter Quest</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Discord Username:</label>
        <input type="text" value={formData.discord_username} disabled />

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
