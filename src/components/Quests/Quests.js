import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const OnboardingQuest = () => {
  const [formData, setFormData] = useState({
    discord_username: "",
    twitter_username: "",
    user_status: "",
  });
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  // Fetch logged-in user from Supabase Auth
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        setMessage("⚠️ Failed to fetch user. Please log in again.");
      } else if (data?.user) {
        const discordUsername = data.user.user_metadata?.user_name || data.user.user_metadata?.full_name || "";
        setUser(data.user);
        setFormData((prevData) => ({
          ...prevData,
          discord_username: discordUsername,
        }));
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("🔍 Checking for duplicate submission...");

    if (!formData.twitter_username || !formData.user_status) {
      setMessage("⚠ Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("https://jupcatdemy.vercel.app/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quest_id: "Onboarding",
          quest_types: 3,
          submissionData: formData,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(`❌ Error: ${data.error || "Something went wrong"}`);
      } else {
        setMessage("✅ Submitted for review!");
      }
    } catch (error) {
      console.error("❌ Submission Error:", error);
      setMessage("⚠ Network error! Please try again.");
    }
  };

  return (
    <div style={{ border: "2px solid #444", padding: "15px", borderRadius: "10px", width: "400px", background: "#1a1a1a", color: "white", textAlign: "center" }}>
      <h2>Onboarding Quest</h2>
      <form onSubmit={handleSubmit}>
        {/* Discord Username (Auto-filled) */}
        <div style={{ margin: "5px 0" }}>
          <label>Enter your Discord Username:</label>
          <input type="text" name="discord_username" value={formData.discord_username} readOnly style={{ width: "90%", padding: "5px", background: "#ccc" }} />
        </div>
        {/* Twitter Username */}
        <div style={{ margin: "5px 0" }}>
          <label>Enter your Twitter Username (without @):</label>
          <input type="text" name="twitter_username" value={formData.twitter_username} onChange={handleChange} placeholder="e.g. User123" style={{ width: "90%", padding: "5px" }} />
        </div>
        {/* Are you new to the Jupiverse? */}
        <div style={{ margin: "5px 0" }}>
          <label>Are you new to the Jupiverse?</label>
          <select name="user_status" value={formData.user_status} onChange={handleChange} style={{ width: "95%", padding: "5px" }}>
            <option value="">Select an option</option>
            <option value="New">New</option>
            <option value="Existing Cat">Existing Cat</option>
          </select>
        </div>
        <button type="submit" style={{ background: "#28a745", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}>Submit</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default OnboardingQuest;
