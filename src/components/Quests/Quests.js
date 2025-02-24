import React from "react";
import QuestBox from "./QuestBox";

const Quests = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", textAlign: "center", color: "white" }}>
      
      {/* Main Page Header */}
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>Available Quests</h1>

      {/* Discord Quest */}
      <QuestBox
        title="Discord Quest"
        tableName="discord_quests"
        fields={[
          { name: "discord_username", label: "Discord Username", placeholder: "", disabled: true, required: true },
          { name: "answer", label: "Your Answer", placeholder: "Enter your answer", disabled: false, required: true },
        ]}
      />

      {/* Twitter Quest */}
      <QuestBox
        title="Twitter Quest"
        tableName="user_twitter_usernames"
        fields={[
          { name: "discord_username", label: "Discord Username", placeholder: "", disabled: true, required: true },
          { name: "twitter_username", label: "Twitter Username", placeholder: "Enter your Twitter username", disabled: false, required: true },
        ]}
      />

      {/* Other Quest */}
      <QuestBox
        title="Other Quest"
        tableName="other_quests"
        fields={[
          { name: "discord_username", label: "Discord Username", placeholder: "", disabled: true, required: true },
          { name: "task_input", label: "Task Details", placeholder: "Describe your task", disabled: false, required: true },
        ]}
      />
    </div>
  );
};

export default Quests;
