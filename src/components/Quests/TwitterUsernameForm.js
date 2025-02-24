import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

function TwitterUsernameForm({ discordUser, onUsernameSaved }) {
  const [twitterUsername, setTwitterUsername] = useState("");
  const [message, setMessage] = useState("");

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
      onUsernameSaved(twitterUsername); // Instantly updates parent component
    }
  };

  return (
    <div>
      <h2>Set Up Your Twitter Username</h2>
      <form onSubmit={handleSubmit}>
        <label>Enter your Twitter Username:</label>
        <input
          type="text"
          value={twitterUsername}
          onChange={(e) => setTwitterUsername(e.target.value)}
          required
          placeholder="@yourTwitter"
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default TwitterUsernameForm;
