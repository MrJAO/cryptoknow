import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./GuidePage.css";

const GuidePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    const fetchGuide = async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching guide:", error);
        setError("Guide not found.");
      } else {
        setGuide(data);
      }
      setLoading(false);
    };

    fetchGuide();
  }, [slug]);

	const handleMarkAsRead = async () => {
	  if (!guide) return;

	  const user = await supabase.auth.getUser();
	  if (!user.data.user) {
		alert("You need to be logged in to track progress.");
		return;
	  }

	  const discord_username = user.data.user?.user_metadata?.user_name || user.data.user?.user_metadata?.full_name || "";

	  const { error } = await supabase
		.from("guide_progress")
		.upsert([{ discord_username, guide_slug: slug }]);

	  if (error) {
		console.error("Error marking as read:", error);
	  } else {
		setProgress(true);
	  }
	};

  if (loading) return <p>Loading guide...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="guide-container">
      <h1>{guide.title}</h1>
      <p className="category">Category: {guide.category}</p>
      <p className="tags">Tags: {guide.tags?.join(", ") || "No tags"}</p>

      <div className="guide-content" dangerouslySetInnerHTML={{ __html: guide.content }} />

      <button className={`mark-read ${progress ? "completed" : ""}`} onClick={handleMarkAsRead}>
        {progress ? "✅ Marked as Read" : "Mark as Read"}
      </button>

      <div className="navigation">
        {guide.previous_slug && (
          <button onClick={() => navigate(`/guides/${guide.previous_slug}`)}>← Previous</button>
        )}
        {guide.next_slug && (
          <button onClick={() => navigate(`/guides/${guide.next_slug}`)}>Next →</button>
        )}
      </div>
    </div>
  );
};

export default GuidePage;
