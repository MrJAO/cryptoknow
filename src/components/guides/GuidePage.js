import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./GuidePage.css"; // Ensure you create a CSS file for styling

const GuidePage = () => {
  const { slug } = useParams(); // Get the slug from the URL
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("title, content, importance")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        console.error("Error fetching guide:", error);
      } else {
        setGuide(data);
      }
      setLoading(false);
    };

    fetchGuide();
  }, [slug]);

  if (loading) return <div className="loading">Loading guide...</div>;
  if (!guide) return <div className="error">Guide not found.</div>;

  return (
    <div className="guide-container">
      <h1 className="guide-title">{guide.title}</h1>
      <p className="guide-importance">Importance: {guide.importance}</p>
      <div className="guide-content" dangerouslySetInnerHTML={{ __html: guide.content }} />
    </div>
  );
};

export default GuidePage;
