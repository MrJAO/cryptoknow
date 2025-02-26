import React, { useState, useEffect } from "react";
import QuestBox from "./QuestBox";
import { supabase } from "../../supabaseClient";

const Quests = () => {
  const [formData, setFormData] = useState({
    discord_username: "",
    twitter_username: "",
    facebook_username: "",
  });
  const [completedQuests, setCompletedQuests] = useState([]); // Tracks completed required quests
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

        // Fetch Twitter username if linked
        const { data: twitterData } = await supabase
          .from("user_twitter_usernames")
          .select("twitter_username")
          .eq("discord_username", discordUsername)
          .maybeSingle();

        if (twitterData) {
          setFormData((prevData) => ({
            ...prevData,
            twitter_username: twitterData.twitter_username,
          }));
        }

        // Fetch Facebook username if linked
        const { data: facebookData } = await supabase
          .from("user_facebook_usernames")
          .select("facebook_username")
          .eq("discord_username", discordUsername)
          .maybeSingle();

        if (facebookData) {
          setFormData((prevData) => ({
            ...prevData,
            facebook_username: facebookData.facebook_username,
          }));
        }
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitTwitter = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { discord_username, twitter_username } = formData;
    if (!twitter_username.trim()) {
      setMessage("⚠️ Please enter your Twitter username.");
      setLoading(false);
      return;
    }

    try {
      const { data: existingUser } = await supabase
        .from("user_twitter_usernames")
        .select("*")
        .eq("discord_username", discord_username)
        .maybeSingle();

      if (existingUser) {
        setMessage("⚠️ You have already linked a Twitter username!");
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from("user_twitter_usernames")
        .insert([{ discord_username, twitter_username }]);

      if (insertError) throw insertError;

      setMessage("✅ Twitter username linked successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      setMessage("❌ Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFacebook = async (e) => {
    e.preventDefault();
    setFbLoading(true);
    setFbMessage("");

    const { discord_username, facebook_username } = formData;
    if (!facebook_username.trim()) {
      setFbMessage("⚠️ Please enter your Facebook username.");
      setFbLoading(false);
      return;
    }

    try {
      const { data: existingUser } = await supabase
        .from("user_facebook_usernames")
        .select("*")
        .eq("discord_username", discord_username)
        .maybeSingle();

      if (existingUser) {
        setFbMessage("⚠️ You have already linked a Facebook username!");
        setFbLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from("user_facebook_usernames")
        .insert([{ discord_username, facebook_username }]);

      if (insertError) throw insertError;

      setFbMessage("✅ Facebook username linked successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      setFbMessage("❌ Failed to save. Please try again.");
    } finally {
      setFbLoading(false);
    }
  };

  return (
    <div className="quests-container">
      {/* Important - Twitter Username */}
      <div className="important-box">Important - Twitter Username</div>
      <div className="quest-container">
        <form>
          <label>Discord Username</label>
          <input type="text" name="discord_username" value={formData.discord_username} disabled className="input-field" />
          <label>Twitter Username (without @)</label>
          <input type="text" name="twitter_username" value={formData.twitter_username} placeholder="e.g CryptoModJAO" required className="input-field" />
          <button type="submit" disabled={loading} className="submit-button">{loading ? "Submitting..." : "Submit"}</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>

      {/* Important - Facebook Username */}
      <div className="important-box">Important - Facebook Username</div>
      <div className="quest-container">
        <form>
          <label>Discord Username</label>
          <input type="text" name="discord_username" value={formData.discord_username} disabled className="input-field" />
          <label>Facebook Username</label>
          <input type="text" name="facebook_username" value={formData.facebook_username} placeholder="e.g Juan Dela Cruz" required className="input-field" />
          <button type="submit" disabled={fbLoading} className="submit-button">{fbLoading ? "Submitting..." : "Submit"}</button>
        </form>
        {fbMessage && <p className="message">{fbMessage}</p>}
      </div>

      {/* Required Quests */}
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
        ]
          .filter((quest) => !completedQuests.includes(quest.quest_title)) // Hide completed quests
          .map((quest, index) => (
            <QuestBox key={index} {...quest} />
          ))}
      </div>

      {/* Available Quests */}
      <h2 className="quests-title">Available Quests</h2>
      <div className="quest-container">
        <QuestBox
          title="Follow the Dev"
          tableName="twitter_pending_submissions"
          quest_title="Follow the Dev"
          quest_type="Twitter Quest"
          link="https://x.com/CryptoModJAO"
          fields={[
            { name: "discord_username", label: "Discord Username", disabled: true },
            { name: "twitter_username", label: "Twitter Username", disabled: true },
          ]}
        />

        <QuestBox
          title="Follow our Facebook Page"
          tableName="facebook_pending_submissions"
          quest_title="Follow our Facebook Page"
          quest_type="Facebook Quest"
          link="https://www.facebook.com/CryptoKnowSpace/"
          fields={[
            { name: "discord_username", label: "Discord Username", disabled: true },
            { name: "facebook_username", label: "Facebook Username", disabled: true },
          ]}
        />

        <QuestBox
          title="Like, Reply, and Retweet"
          tableName="twitter_pending_submissions"
          quest_title="Like, Reply, and Retweet"
          quest_type="Twitter Quest"
          link="https://twitter.com/yourpost"
          fields={[
            { name: "discord_username", label: "Discord Username", disabled: true },
            { name: "twitter_username", label: "Twitter Username", disabled: true },
            { name: "reply_link", label: "Reply Link", placeholder: "Paste reply link", required: true },
            { name: "retweet_link", label: "Retweet Link", placeholder: "Paste retweet link", required: true },
          ]}
        />
      </div>
    </div>
  );
};

export default Quests;
