import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import '../../App.css';

function ContributeSubmissionForm({ discordUser }) {
  const [formData, setFormData] = useState({
    discord_username: "",
    project_name: "",
    link: "",
    airdrop_type: "",
    custom_airdrop_type: "",
    chain: "",
    custom_chain: "",
  });

  const [message, setMessage] = useState("");

  // Auto-fill Discord username when the component loads
  useEffect(() => {
    if (discordUser) {
      setFormData((prevData) => ({
        ...prevData,
        discord_username: discordUser,
      }));
    }
  }, [discordUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine final values: Use custom input if "Other" is selected
    const finalAirdropType = formData.airdrop_type === "Other" ? formData.custom_airdrop_type : formData.airdrop_type;
    const finalChain = formData.chain === "Other" ? formData.custom_chain : formData.chain;

    // Validation: Ensure required fields are filled
    if (!formData.project_name || !formData.link || !finalAirdropType || !finalChain) {
      setMessage("⚠️ Please fill in all required fields.");
      return;
    }

    const { error } = await supabase.from("contribute_submission").insert([
      {
        discord_username: formData.discord_username,
        project_name: formData.project_name,
        link: formData.link,
        airdrop_type: finalAirdropType,
        chain: finalChain,
      },
    ]);

    if (error) {
      console.error("Submission Error:", error);
      setMessage("❌ Submission failed. Please try again.");
    } else {
      setMessage("✅ Submission successful!");
      setFormData({
        discord_username: discordUser,
        project_name: "",
        link: "",
        airdrop_type: "",
        custom_airdrop_type: "",
        chain: "",
        custom_chain: "",
      });
    }
  };

  return (
    <div className="form-container">
      {/* Green Info Banner */}
      <div className="info-banner">
        ✅ Submissions are **first-come, first-served**. I will check from **oldest to newest** for fairness.
      </div>

      <h2 className="form-title">📩 Submit a Contribution</h2>

      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit} className="submission-form">
        {/* Auto-filled Discord Username */}
        <div className="form-group">
          <label>👤 Discord Username:</label>
          <input type="text" value={formData.discord_username} disabled className="input-field disabled" />
        </div>

        {/* Project Name */}
        <div className="form-group">
          <label>📌 Project Name: *</label>
          <input
            type="text"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Enter project name"
          />
        </div>

        {/* Airdrop Type */}
        <div className="form-group">
          <label>💰 Airdrop Type: *</label>
          <select name="airdrop_type" value={formData.airdrop_type} onChange={handleChange} required className="input-field">
            <option value="">Select Airdrop Type</option>
            <option value="Token">Token</option>
            <option value="NFT">NFT</option>
            <option value="Points">Points</option>
            <option value="Other">Other</option>
          </select>
          {formData.airdrop_type === "Other" && (
            <input
              type="text"
              name="custom_airdrop_type"
              value={formData.custom_airdrop_type}
              onChange={handleChange}
              placeholder="Enter custom Airdrop Type"
              className="input-field custom-input"
            />
          )}
        </div>

        {/* Chain */}
        <div className="form-group">
          <label>🔗 Chain: *</label>
          <select name="chain" value={formData.chain} onChange={handleChange} required className="input-field">
            <option value="">Select Chain</option>
            <option value="Ethereum">Ethereum</option>
            <option value="BSC">BSC</option>
            <option value="Polygon">Polygon</option>
            <option value="Solana">Solana</option>
            <option value="Other">Other</option>
          </select>
          {formData.chain === "Other" && (
            <input
              type="text"
              name="custom_chain"
              value={formData.custom_chain}
              onChange={handleChange}
              placeholder="Enter custom Chain"
              className="input-field custom-input"
            />
          )}
        </div>

        {/* Link */}
        <div className="form-group">
          <label>🔗 Submission Link: *</label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Paste your contribution link"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">🚀 Submit</button>
      </form>
    </div>
  );
}

export default ContributeSubmissionForm;
