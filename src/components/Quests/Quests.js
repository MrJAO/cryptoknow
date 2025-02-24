import React, { useState, useEffect } from "react";
import TwitterUsernameForm from "./TwitterUsernameForm";
import TwitterQuestForm from "./TwitterQuestForm";
import { supabase } from "../../supabaseClient";

function Quests({ discordUser }) {
  const [hasTwitterUsername, setHasTwitterUsername] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (discordUser) {
      checkTwitterUsername();
    }
  }, [discordUser]);

  const checkTwitterUsername = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_twitter_usernames")
        .select("twitter_username")
        .eq("discord_username", discordUser)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching Twitter username:", error);
      }

      setHasTwitterUsername(!!data);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Quests</h1>

      <div style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "10px" }}>
        {loading ? (
          <p>Loading...</p>
        ) : !hasTwitterUsername ? (
          <TwitterUsernameForm discordUser={discordUser} onUsernameSaved={() => setHasTwitterUsername(true)} />
        ) : (
          <p>✅ Twitter Username is set. You can now do Twitter quests.</p>
        )}
      </div>

      {hasTwitterUsername && (
        <div style={{ marginTop: "20px" }}>
          <TwitterQuestForm discordUser={discordUser} />
          {/* Add more quest types here, each in a separate div */}
        </div>
      )}
    </div>
  );
}

export default Quests;
