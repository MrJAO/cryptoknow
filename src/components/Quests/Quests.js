import React, { useState, useEffect } from "react";
import QuestBox from "./QuestBox";
import { supabase } from "../../supabaseClient";

const Quests = () => {
  const [formData, setFormData] = useState({
    discord_username: "",
    twitter_username: "",
    facebook_username: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fbMessage, setFbMessage] = useState("");
  const [fbLoading, setFbLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        setMessage("⚠️ Failed to fetch user. Please log in again.");
      } else if (data?.user) {
        const discordUsername =
          data.user.user_metadata?.user_name ||
          data.user.user_metadata?.full_name ||
          "";
        setFormData((prevData) => ({
          ...prevData,
          discord_username: discordUsername,
        }));
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="quests-container">
      <h2 className="quests-title">Required Quests</h2>
      <div className="quest-container">
        {[
          {
            title: "Follow the Dev",
            tableName: "required_quests_table",
            quest_title: "Follow the Dev",
            quest_type: "Twitter Quest",
            link: "https://x.com/CryptoModJAO",
            fields: [
              { name: "discord_username", label: "Discord Username", disabled: true },
              { name: "twitter_username", label: "Twitter Username", disabled: true },
            ],
          },
          {
            title: "Follow our Facebook Page",
            tableName: "required_quests_table",
            quest_title: "Follow our Facebook Page",
            quest_type: "Facebook Quest",
            link: "https://www.facebook.com/CryptoKnowSpace/",
            fields: [
              { name: "discord_username", label: "Discord Username", disabled: true },
              { name: "facebook_username", label: "Facebook Username", disabled: true },
            ],
          },
          {
            title: "Like, Reply, and Retweet",
            tableName: "required_quests_table",
            quest_title: "Like, Reply, and Retweet",
            quest_type: "Twitter Quest",
            link: "https://twitter.com/yourpost",
            fields: [
              { name: "discord_username", label: "Discord Username", disabled: true },
              { name: "twitter_username", label: "Twitter Username", disabled: true },
              { name: "reply_link", label: "Reply Link", placeholder: "Paste reply link", required: true },
              { name: "retweet_link", label: "Retweet Link", placeholder: "Paste retweet link", required: true },
            ],
          },
        ].map((quest, index) => (
          <QuestBox key={index} {...quest} />
        ))}
      </div>
    </div>
  );
};

export default Quests;
