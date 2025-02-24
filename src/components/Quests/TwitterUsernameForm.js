import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

function TwitterUsernameForm({ discordUser, onUsernameSaved }) {
  const [twitterUsername, setTwitterUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (discordUser) {
      fetchTwitterUsername();
    }
  }, [discordUser]);

  // Fetch existing Twitter username (with a manual timeout failover)
  const fetchTwitterUsername = async () => {
    setLoading(true);
    
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setMessage("⚠️ Failed to fetch Twitter username. Please refresh.");
    }, 5000); // 5-second timeout

    try {
      const { data, error } = await supabase
        .from("user_twitter_usernames")
        .select("twitter_username")
        .eq("discord_username", discordUser)
        .single();

      clearTimeout(timeoutId); // Prevent timeout if successful

      if (error) {
        console.warn("Error fetching Twitter username:", error.message);
      }

      if (data) {
        setTwitterUsername(data.twitter_username);
        setIsSubmitted(true);
        onUsernameSaved(true); // Notify parent component
      }
    } catch (err) {
      console.error("Error fetching Twitter username:", err.message);
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!twitterUsername.trim()) {
      setMessage("⚠️ Please enter your Twitter username.");
      return;
    }

    setMessage("⏳ Saving...");

    const { error } = await supabase
      .from("user_twitter_usernames")
      .upsert({ discord_username: discordUser, twitter_username: twitterUsername });

    if (error) {
      setMessage("❌ Failed to submit. Please try again.");
    } else {
      setMessage("✅ Twitter username saved successfully!");
      setIsSubmitted(true);
      onUsernameSaved(true); // Notify parent component
    }
  };

  return (
    <div>
      <h2>Set Up Your Twitter Username</h2>

      {/* Loading State */}
      {loading ? (
        <p>⏳ Checking existing username... (If stuck, refresh the page.)</p>
      ) : isSubmitted ? (
        <p>✅ Your Twitter username is: <strong>{twitterUsername}</strong></p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Enter your Twitter Username:</label>
          <input
            type="text"
            value={twitterUsername}
            onChange={(e) => setTwitterUsername(e.target.value)}
            required
            placeholder="@yourTwitter"
            disabled={isSubmitted} // Prevents re-editing after submission
          />
          <button type="submit" disabled={isSubmitted}>Submit</button>
        </form>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default TwitterUsernameForm;
