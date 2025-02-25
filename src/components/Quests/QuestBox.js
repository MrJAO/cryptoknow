import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./QuestBox.css";

const QuestBox = ({ title, fields, tableName }) => {
  const [formData, setFormData] = useState(() =>
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

    try {
      const { error } = await supabase.from(tableName).insert([formData]);
      if (error) {
        setMessage("⚠️ Submission failed. Please try again.");
      } else {
        setMessage("✅ Submission successful!");
      }
    } catch (error) {
      setMessage("⚠️ An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quest-box">
      <h2>{title}</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <input key={field.name} {...field} onChange={handleChange} />
        ))}
        <button type="submit">{loading ? "Submitting..." : "Submit"}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default QuestBox;
