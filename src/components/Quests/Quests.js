import React, { useState, useEffect } from "react";
import TwitterUsernameForm from "./TwitterUsernameForm";
import TwitterQuestForm from "./TwitterQuestForm";
import { supabase } from "../../supabaseClient";

function Quests({ discordUser }) {
  const [hasTwitterUsername, setHasTwitterUsername] = useState(null); // Set to `null` initially
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (discordUser) {
      checkTwitterUsername();
    }
  }, [discordUser]);

  const checkTwitterUsername = async () => {
    setLoading(true); // Start loading

    const { data, error } = await supabase
      .from("user_twitter_usernames")
      .select("twitter_username")
      .eq("discord_username", discordUser)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching Twitter username:", error.message);
    }

    setHasTwitterUsername(!!data); // `true` if data exists, `false` otherwise
    setLoading(false); // Stop loading
  };

  if (loading) {
    return <p>⏳ Loading...</p>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Quests</h1>

      {/* First Quest: Twitter Username Onboarding */}
      <div style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "10px" }}>
        {!hasTwitterUsername ? (
          <TwitterUsernameForm discordUser={discordUser} onUsernameSaved={() => setHasTwitterUsername(true)} />
        ) : (
          <p>✅ Twitter Username is set. You can now do Twitter quests.</p>
        )}
      </div>

      {/* Show Twitter Quest Form Only After Twitter Username is Set */}
      {hasTwitterUsername && (
        <div>
          <TwitterQuestForm discordUser={discordUser} />
        </div>
      )}
    </div>
  );
}

export default Quests;
