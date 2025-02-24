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
    <div>
      <h1>Quests</h1>
      {!hasTwitterUsername ? (
        <TwitterUsernameForm discordUser={discordUser} onUsernameSaved={setHasTwitterUsername} />
      ) : (
        <TwitterQuestForm discordUser={discordUser} />
      )}
    </div>
  );
}

export default Quests;
