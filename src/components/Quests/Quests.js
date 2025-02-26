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

  const quests = [
    {
      title: "Welcome to the Community!",
      tableName: "onboarding_pending_submissions",
      fields: [
        { name: "discord_username", label: "Discord Username", placeholder: "Enter your Discord username", required: true, disabled: true },
        { name: "why_join", label: "Why did you join?", placeholder: "Tell us why you joined", required: true }
      ]
    },
    {
      title: "Twitter Follow Quest",
      tableName: "twitter_pending_submissions",
      fields: [
        { name: "twitter_username", label: "Your Twitter Username", placeholder: "Enter your Twitter username", required: true, disabled: true },
        { name: "follow_status", label: "Did you follow us?", placeholder: "Yes or No", required: true }
      ]
    },
    {
      title: "Retweet a Post",
      tableName: "twitter_pending_submissions",
      fields: [
        { name: "twitter_username", label: "Your Twitter Username", placeholder: "Enter your Twitter username", required: true, disabled: true },
        { name: "retweet_link", label: "Retweet Link", placeholder: "Paste the link to your retweet", required: true }
      ]
    },
    {
      title: "Join Our Discord Server",
      tableName: "discord_pending_submissions",
      fields: [
        { name: "discord_username", label: "Discord Username", placeholder: "Enter your Discord username", required: true, disabled: true },
        { name: "joined_server", label: "Did you join?", placeholder: "Yes or No", required: true }
      ]
    },
    {
      title: "Submit a Feedback",
      tableName: "feedback_submissions",
      fields: [
        { name: "discord_username", label: "Discord Username", placeholder: "Enter your Discord username", required: true, disabled: true },
        { name: "feedback", label: "Your Feedback", placeholder: "Write your feedback", required: true }
      ]
    }
  ];

  return (
    <div className="quests-container">
      <div className="important-box">Important - Twitter Username</div>
      <div className="quest-container">
        <form onSubmit={handleSubmit}>
          <label>Discord Username</label>
          <input type="text" name="discord_username" value={formData.discord_username} disabled className="input-field" />
          <label>Twitter Username (without @)</label>
          <input type="text" name="twitter_username" value={formData.twitter_username} onChange={handleChange} placeholder="e.g CryptoModJAO" required className="input-field" />
          <button type="submit" disabled={loading} className="submit-button">{loading ? "Submitting..." : "Submit"}</button>
        </form>
        {message && <p style={{ marginTop: "10px", color: message.includes("⚠️") || message.includes("❌") ? "red" : "green" }}>{message}</p>}
      </div>
    </div>
	<h2 className="quests-title">Available Quests</h2>
      <div className="quest-container">
        {quests.map((quest, index) => (
          <QuestBox key={index} {...quest} />
        ))}
      </div>
  );
};

export default Quests;
