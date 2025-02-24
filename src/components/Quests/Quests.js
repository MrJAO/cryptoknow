import React, { useState, useEffect } from "react";
import TwitterUsernameForm from "./TwitterUsernameForm";
import TwitterQuestForm from "./TwitterQuestForm";
import { supabase } from "../../supabaseClient";

function Quests({ discordUser }) {
  const [twitterUsername, setTwitterUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (discordUser) {
      fetchTwitterUsername();
    }
  }, [discordUser]);

  // Fetch Twitter username ONCE in the main component
  const fetchTwitterUsername = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("user_twitter_usernames")
        .select("twitter_username")
        .eq("discord_username", discordUser)
        .single();

      if (error) {
        console.warn("Error fetching Twitter username:", error.message);
      }

      if (data) {
        setTwitterUsername(data.twitter_username);
      }
    } catch (err) {
      console.error("Error fetching Twitter username:", err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Quests</h1>

      {/* Show loading message while checking */}
      {loading ? (
        <p>⏳ Checking Twitter username...</p>
      ) : (
        <div style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "10px" }}>
          {/* If Twitter username is missing, show setup form */}
          {!twitterUsername ? (
            <TwitterUsernameForm discordUser={discordUser} onUsernameSaved={setTwitterUsername} />
          ) : (
            <p>✅ Twitter Username: <strong>{twitterUsername}</strong></p>
          )}
        </div>
      )}

      {/* Only show quests if Twitter username is set */}
      {twitterUsername && <TwitterQuestForm discordUser={discordUser} twitterUsername={twitterUsername} />}
    </div>
  );
}

export default Quests;
