import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

const SuggestGuideForm = ({ onClose, user }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: "",
    guide_link: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formData.title.trim()) {
      setMessage("⚠️ Title is required!");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("guide_suggestions").insert([
        {
          title: formData.title,
          category: formData.category || null,
          tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
          guide_link: formData.guide_link || null,
          description: formData.description || null,
          submitted_by: user?.user_metadata?.user_name || "Anonymous",
        },
      ]);

      if (error) throw error;
      setMessage("✅ Guide suggestion submitted successfully!");
      setFormData({ title: "", category: "", tags: "", guide_link: "", description: "" });
    } catch (error) {
      setMessage("❌ Submission failed. Please try again.");
      console.error("Error submitting guide suggestion:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="modal">
        <h2>Suggest a Guide</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Guide Title (Required)" value={formData.title} onChange={handleChange} required />
          <input type="text" name="category" placeholder="Category (e.g., Wallets, DeFi)" value={formData.category} onChange={handleChange} />
          <input type="text" name="tags" placeholder="Tags (comma-separated)" value={formData.tags} onChange={handleChange} />
          <input type="text" name="guide_link" placeholder="Guide Link (if available)" value={formData.guide_link} onChange={handleChange} />
          <textarea name="description" placeholder="Description (optional)" value={formData.description} onChange={handleChange} />
          <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default SuggestGuideForm;
