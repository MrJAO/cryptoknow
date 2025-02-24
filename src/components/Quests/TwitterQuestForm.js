import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

function TwitterQuestForm({ discordUser, twitterUsername }) {
  const [taskLink, setTaskLink] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskLink.trim()) {
      setMessage("⚠️ Please enter the task link.");
      return;
    }

    setMessage("⏳ Submitting...");

    const { error } = await supabase
      .from("twitter_quests")
      .insert({ discord_username: discordUser, twitter_username: twitterUsername, task_link: taskLink });

    if (error) {
      setMessage("❌ Failed to submit. Please try again.");
    } else {
      setMessage("✅ Submission successful!");
      setTaskLink(""); // Clear input field after successful submission
    }
  };

  return (
    <div>
      <h2>Twitter Quest</h2>
      <p>Twitter Username: <strong>{twitterUsername}</strong></p>
      <form onSubmit={handleSubmit}>
        <label>Enter Task Link:</label>
        <input
          type="text"
          value={taskLink}
          onChange={(e) => setTaskLink(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default TwitterQuestForm;
