import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

function TwitterUsernameForm({ discordUser, onUsernameSaved }) {
  const [twitterUsername, setTwitterUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (discordUser) {
      fetchTwitterUsername();
    }
  }, [discordUser]);

  // Fetch existing Twitter username
  const fetchTwitterUsername = async () => {
    const { data } = await supabase
      .from("user_twitter_usernames")
      .select("twitter_username")
      .eq("discord_username", discordUser)
      .single();

    if (data) {
      setTwitterUsername(data.twitter_username);
      setIsSubmitted(true);
      onUsernameSaved(true); // Notify parent component that Twitter username exists
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!twitterUsername.trim()) {
      setMessage("⚠️ Please enter your Twitter username.");
      return;
    }

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
      {isSubmitted ? (
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
          />
          <button type="submit">Submit</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default TwitterUsernameForm;
