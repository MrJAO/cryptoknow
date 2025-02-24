import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

function Quests({ discordUser }) {
  const [twitterUsername, setTwitterUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (discordUser) {
      fetchTwitterUsername();
    }
  }, [discordUser]);

  const fetchTwitterUsername = async () => {
    const { data, error } = await supabase
      .from("user_twitter_usernames")
      .select("twitter_username")
      .eq("discord_username", discordUser)
      .single();

    if (data) {
      setTwitterUsername(data.twitter_username);
      setIsSubmitted(true);
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
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Available Quests</h1>
      
      <div style={{ marginTop: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "10px" }}>
        <h2>Important - Twitter Username</h2>
        <p>Please enter your Twitter username before continuing with quests.</p>
        
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", paddingBottom: "10px" }}>Twitter Username</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={twitterUsername}
                    onChange={(e) => setTwitterUsername(e.target.value)}
                    required
                    placeholder="Enter your Twitter username (without @)"
                    disabled={isSubmitted}
                    style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                  />
                  <button type="submit" disabled={isSubmitted} style={{ padding: "10px", width: "100%" }}>
                    {isSubmitted ? "✅ Submitted" : "Submit"}
                  </button>
                </form>
              </td>
            </tr>
          </tbody>
        </table>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Quests;
