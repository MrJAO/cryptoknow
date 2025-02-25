import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const QuestBox = ({ title, fields, tableName }) => {
  const [formData, setFormData] = useState(() =>
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch logged-in user from Supabase Auth
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
          discord_username: discordUsername, // Auto-fill Discord username
        }));
      }
    };

    fetchUser();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Ensure discord_username exists before submitting
      if (!formData.discord_username) {
        setMessage("⚠️ Discord username is missing. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from(tableName).insert([formData]); // Insert data into the specified table

      if (error) throw error;

      setMessage("✅ Quest submitted successfully!");
      setFormData((prevData) =>
        fields.reduce((acc, field) => ({ ...acc, [field.name]: field.disabled ? prevData[field.name] : "" }), {})
      );
    } catch (error) {
      console.error("Error saving data:", error);
      setMessage("❌ Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#1a1a1a",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "left",
        width: "100%",
        maxWidth: "350px", // Matches your form layout
        minHeight: "250px", // Ensures consistent height
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <h2 style={{ color: "#ffcc00", marginBottom: "10px", fontSize: "20px" }}>{title}</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Render Form Fields Dynamically */}
        {fields.map((field) => (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              disabled={field.disabled}
              required={field.required}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                background: "#333",
                color: "white",
                border: "1px solid #555",
              }}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "10px", color: message.includes("⚠️") || message.includes("❌") ? "red" : "green" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default QuestBox;
