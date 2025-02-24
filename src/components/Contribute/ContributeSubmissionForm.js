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

    const finalAirdropType = formData.airdrop_type === "Other" ? formData.custom_airdrop_type : formData.airdrop_type;
    const finalChain = formData.chain === "Other" ? formData.custom_chain : formData.chain;

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
      <div className="info-banner">
        ✅ Submissions are **first-come, first-served**. I will check from **oldest to newest** for fairness.
      </div>

      <h2 className="form-title">📩 Submit a Contribution</h2>

      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit} className="submission-form">
        <div className="form-group">
          <label>👤 Discord Username:</label>
          <input type="text" value={formData.discord_username} disabled className="disabled" />
        </div>

        <div className="form-group">
          <label>📌 Project Name: *</label>
          <input
            type="text"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
            required
            placeholder="Enter project name"
          />
        </div>

        <div className="form-group">
          <label>💰 Airdrop Type: *</label>
          <select name="airdrop_type" value={formData.airdrop_type} onChange={handleChange} required>
            <option value="">Select Airdrop Type</option>
            <option value="Retroactive">Token</option>
            <option value="Testnet">NFT</option>
            <option value="PlayToAirdrop">Points</option>
            <option value="Other">Other</option>
          </select>
          {formData.airdrop_type === "Other" && (
            <input
              type="text"
              name="custom_airdrop_type"
              value={formData.custom_airdrop_type}
              onChange={handleChange}
              placeholder="Enter custom Airdrop Type"
            />
          )}
        </div>

        <div className="form-group">
          <label>🔗 Chain: *</label>
          <select name="chain" value={formData.chain} onChange={handleChange} required>
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
            />
          )}
        </div>

        <div className="form-group">
          <label>🔗 Submission Link: *</label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            required
            placeholder="Enter the project link"
          />
        </div>

        <button type="submit">🚀 Submit</button>
      </form>
    </div>
  );
}

export default ContributeSubmissionForm;
