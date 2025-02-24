import React, { useState, useEffect } from "react";
import TwitterUsernameForm from "./TwitterUsernameForm";
import TwitterQuestForm from "./TwitterQuestForm";
import { supabase } from "../../supabaseClient";

function Quests({ discordUser }) {
  const [hasTwitterUsername, setHasTwitterUsername] = useState(false);

  useEffect(() => {
    checkTwitterUsername();
  }, [discordUser]);

  const checkTwitterUsername = async () => {
    const { data } = await supabase
      .from("user_twitter_usernames")
      .select("twitter_username")
      .eq("discord_username", discordUser)
      .single();

    setHasTwitterUsername(!!data);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Quests</h1>
      
      <div style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "10px" }}>
        {!hasTwitterUsername ? (
          <TwitterUsernameForm discordUser={discordUser} onUsernameSaved={setHasTwitterUsername} />
        ) : (
          <p>✅ Twitter Username is set. You can now do Twitter quests.</p>
        )}
      </div>

      {hasTwitterUsername && (
        <div>
          <TwitterQuestForm discordUser={discordUser} />
          {/* You can add more quest types here, each wrapped in its own div */}
        </div>
      )}
    </div>
  );
}

export default Quests;
