import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./QuestBox.css"; // Import external CSS file

const QuestBox = ({ title, fields, tableName }) => {
  const [formData, setFormData] = useState(() =>
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
    setMessage("");

    try {
      if (!formData.discord_username) {
        setMessage("⚠️ Discord username is missing. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from(tableName).insert([formData]);

      if (error) throw error;

      setMessage("✅ Quest submitted successfully!");
      setFormData((prevData) =>
        fields.reduce((acc, field) => ({
          ...acc,
          [field.name]: field.disabled ? prevData[field.name] : "",
        }), {})
      );
    } catch (error) {
      console.error("Error saving data:", error);
      setMessage("❌ Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quest-box">
      <h2 className="quest-title">{title}</h2>
      <form onSubmit={handleSubmit} className="quests-form">
        {fields.map((field) => (
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
        <button type="submit" disabled={loading} className="quest-submit">
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {message && <p className={`quest-message ${message.includes("⚠️") || message.includes("❌") ? "error" : "success"}`}>{message}</p>}
    </div>
  );
};

export default QuestBox;
