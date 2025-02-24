import React, { useState, useEffect } from "react";
import TwitterUsernameForm from "./TwitterUsernameForm";
import TwitterQuestForm from "./TwitterQuestForm";
import { supabase } from "../../supabaseClient";

function Quests({ discordUser }) {
  const [hasTwitterUsername, setHasTwitterUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (discordUser) {
      checkTwitterUsername();
    } else {
      setLoading(false); // Stop loading if no Discord user
    }
  }, [discordUser]);

  const checkTwitterUsername = async () => {
    setLoading(true);
    
    try {
      // Set a timeout limit (3 seconds) to prevent hanging
      const fetchTwitterUsername = supabase
        .from("user_twitter_usernames")
        .select("twitter_username")
        .eq("discord_username", discordUser)
        .single();
      
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 3000)
      );

      const { data, error } = await Promise.race([fetchTwitterUsername, timeout]);

      if (error) {
        console.warn("Twitter username fetch error:", error.message);
      }

      setHasTwitterUsername(!!data);
    } catch (err) {
      console.error("Error fetching Twitter username:", err.message);
      setHasTwitterUsername(false); // Assume no Twitter username if request fails
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Quests</h1>

      {/* Loading State */}
      {loading ? (
        <p>⏳ Checking Twitter username...</p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default Quests;
