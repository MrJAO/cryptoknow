import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Ensure this file exists
import "./QuestBox.css"; // Import external CSS file

const QuestBox = ({ title, fields = [], tableName, quest_title, quest_type, link }) => {
  const [formData, setFormData] = useState(() =>
    (fields || []).reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        setMessage("⚠️ Failed to fetch user. Please log in again.");
        return;
      }

      if (data?.user) {
        const discordUsername =
          data.user.user_metadata?.user_name ||
          data.user.user_metadata?.full_name ||
          "";

        setFormData((prevData) => ({
          ...prevData,
          discord_username: discordUsername,
        }));

        if (discordUsername) {
          // Auto-fill Twitter username if required
          if (fields.some((field) => field.name === "twitter_username")) {
            const fetchTwitter = async () => {
              const { data: twitterData, error: twitterError } = await supabase
                .from("user_twitter_usernames")
                .select("twitter_username")
                .eq("discord_username", discordUsername)
                .maybeSingle();

              if (twitterError) {
                console.error("Error fetching Twitter username:", twitterError);
              } else if (twitterData?.twitter_username) {
                setFormData((prevData) => ({
                  ...prevData,
                  twitter_username: twitterData.twitter_username,
                }));
              }
            };
            fetchTwitter();
          }

          // Auto-fill Facebook username if required
          if (fields.some((field) => field.name === "facebook_username")) {
            const fetchFacebook = async () => {
              const { data: facebookData, error: facebookError } = await supabase
                .from("user_facebook_usernames")
                .select("facebook_username")
                .eq("discord_username", discordUsername)
                .maybeSingle();

              if (facebookError) {
                console.error("Error fetching Facebook username:", facebookError);
              } else if (facebookData?.facebook_username) {
                setFormData((prevData) => ({
                  ...prevData,
                  facebook_username: facebookData.facebook_username,
                }));
              }
            };
            fetchFacebook();
          }
        }
      }
    };

    fetchUserData();
  }, [fields]); // Runs only when fields change

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { discord_username } = formData;

    if (!discord_username) {
      setMessage("⚠️ Discord username is required.");
      setLoading(false);
      return;
    }

    // Check for duplicate submission
    const { data: existingSubmission, error: checkError } = await supabase
      .from(tableName)
      .select("id") // Ensure ID column exists in the table
      .eq("discord_username", discord_username)
      .eq("quest_title", quest_title)
      .eq("quest_type", quest_type)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking for existing submission:", checkError);
      setMessage("⚠️ An error occurred. Please try again.");
      setLoading(false);
      return;
    }

    if (existingSubmission) {
      setMessage("⚠️ This quest is already in the pending list and waiting for approval.");
      setLoading(false);
      return;
    }

    // Dynamic submission filtering: Only include necessary fields
    const submissionData = {
      discord_username,
      quest_title: quest_title || "",
      quest_type: quest_type || "",
    };

    if (quest_type === "Twitter Quest") {
      if (formData.twitter_username) submissionData.twitter_username = formData.twitter_username;
      if (formData.reply_link) submissionData.reply_link = formData.reply_link;
      if (formData.retweet_link) submissionData.retweet_link = formData.retweet_link;
    }

    if (quest_type === "Facebook Quest") {
      if (formData.facebook_username) submissionData.facebook_username = formData.facebook_username;
    }

    try {
      const { error } = await supabase.from(tableName).insert([submissionData]);

      if (error) {
        console.error("Error submitting form:", error);
        setMessage("⚠️ Submission failed. Please try again.");
      } else {
        setMessage("✅ Submission successful!");
        setFormData((fields || []).reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}));
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setMessage("⚠️ An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quest-box">
      <h2>{title}</h2>

      {/* Display link if provided */}
      {link && (
        <p className="quest-link">
          <a href={link} target="_blank" rel="noopener noreferrer">
            Click here to view
          </a>
        </p>
      )}

      <form onSubmit={handleSubmit} className="quests-form">
        {(fields || []).map((field) => (
          <div key={field.name} className="form-group">
            <label>{field.label}</label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
              className="quest-input"
            />
          </div>
        ))}
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default QuestBox;
