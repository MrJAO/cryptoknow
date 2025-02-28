import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./GuidePage.css";

const GuidePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [progress, setProgress] = useState(false);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const fetchGuide = async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) {
        console.error("Error fetching guide:", error);
      } else {
        setGuide(data);
        extractHeadings(data.content);
      }
    };

    fetchGuide();
  }, [slug]);

  // Extract headings (h2, h3) for Table of Contents
  const extractHeadings = (content) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    const extractedHeadings = Array.from(tempDiv.querySelectorAll("h2, h3")).map(
      (heading) => ({
        text: heading.innerText,
        id: heading.id || heading.innerText.toLowerCase().replace(/\s+/g, "-"),
        level: heading.tagName === "H2" ? "h2" : "h3",
      })
    );

    setHeadings(extractedHeadings);
  };

  const handleMarkAsRead = async () => {
    if (!guide) return;

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      alert("You need to be logged in to track progress.");
      return;
    }

    const discord_username =
      user.data.user?.user_metadata?.user_name ||
      user.data.user?.user_metadata?.full_name ||
      "";

    const { error } = await supabase
      .from("guide_progress")
      .upsert([{ discord_username, guide_slug: slug }]);

    if (error) {
      console.error("Error marking as read:", error);
    } else {
      setProgress(true);
    }
  };

  const scrollToHeading = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="guide-page">
      <button className="back-button" onClick={() => navigate("/search")}>
        ← Back to Guides
      </button>

      {guide ? (
        <>
          <h1 className="guide-title">{guide.title}</h1>

          {/* Table of Contents */}
          <div className="table-of-contents">
            <h2>Table of Contents</h2>
            <ul>
              {headings.map((heading, index) => (
                <li
                  key={index}
                  className={heading.level}
                  onClick={() => scrollToHeading(heading.id)}
                >
                  {heading.text}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="guide-content"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />

          <button className="mark-as-read" onClick={handleMarkAsRead} disabled={progress}>
            {progress ? "✅ Marked as Read" : "📖 Mark as Read"}
          </button>
        </>
      ) : (
        <p>Loading guide...</p>
      )}
    </div>
  );
};

export default GuidePage;
