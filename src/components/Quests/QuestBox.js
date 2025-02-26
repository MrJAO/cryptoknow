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

        // Auto-fill Twitter username if required
        if (Array.isArray(fields) && fields.some((field) => field.name === "twitter_username")) {
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
        }

        // Auto-fill Facebook username if required
        if (Array.isArray(fields) && fields.some((field) => field.name === "facebook_username")) {
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
        }
      }
    };

    fetchUserData();
  }, [fields]); // Runs when fields change

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

    // Include quest_title and quest_type in the submission
    const submissionData = {
      ...formData,
      quest_title: quest_title || "", // Default to empty string if missing
      quest_type: quest_type || "",   // Default to empty string if missing
    };

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
              disabled={field.disabled}
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
