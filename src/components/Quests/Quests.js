import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const TwitterQuestForm = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    discord_username: "",
    twitter_username: "",
    quest_details: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        setMessage("⚠️ Failed to fetch user. Please log in again.");
      } else if (data?.user) {
        const discordUsername = data.user.user_metadata?.user_name || data.user.user_metadata?.full_name || "";
        setUser(data.user);
        setFormData((prevData) => ({
          ...prevData,
          discord_username: discordUsername,
        }));

        if (discordUsername) {
          fetchTwitterUsername(discordUsername);
        }
      }
    };

    fetchUser();
  }, []);

  const fetchTwitterUsername = async (discordUsername) => {
    try {
      const { data, error } = await supabase
        .from("user_twitter_usernames")
        .select("twitter_username")
        .eq("discord_username", discordUsername)
        .single();

      if (error) {
        console.error("Error fetching Twitter username:", error);
        setMessage("⚠️ Could not retrieve Twitter username.");
        return;
      }

      if (data) {
        setFormData((prevData) => ({
          ...prevData,
          twitter_username: data.twitter_username,
        }));
      }
    } catch (error) {
      console.error("Unexpected error fetching Twitter username:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.discord_username) {
      setMessage("⚠️ Discord username is missing. Please log in again.");
      return;
    }

    if (!formData.twitter_username) {
      setMessage("⚠️ Please set up your Twitter username first.");
      return;
    }

    console.log("Submitting data:", formData); // Debugging step

    const { error } = await supabase.from("twitter_quests").insert([
      {
        discord_username: formData.discord_username,
        twitter_username: formData.twitter_username,
        quest_details: formData.quest_details,
      },
    ]);

    if (error) {
      console.error("Error submitting quest:", error);
      setMessage("❌ Failed to submit. Please try again.");
    } else {
      setMessage("✅ Submission successful!");
      setFormData({ ...formData, quest_details: "" });
    }
  };

  return (
    <div>
      <h2>Twitter Quest Submission</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Quest Details:</label>
        <input
          type="text"
          value={formData.quest_details}
          onChange={(e) => setFormData({ ...formData, quest_details: e.target.value })}
          required
        />
        <button type="submit">Submit Quest</button>
      </form>
    </div>
  );
};

export default TwitterQuestForm;
