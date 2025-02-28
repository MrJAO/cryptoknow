import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./GuidePage.css";

const GuidePage = ({ user }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [progress, setProgress] = useState(false);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    fetchGuide();
  }, [slug]);

  useEffect(() => {
    if (user && guide) {
      checkUserProgress();
    }
  }, [user, guide]);

  // Fetch Guide Data
  const fetchGuide = async () => {
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      console.error("❌ Error fetching guide:", error);
    } else {
      setGuide(data);
      extractHeadings(data.content);
    }
  };

  // Extract headings (h2, h3) for Table of Contents
  const extractHeadings = (content) => {
    if (!content) return;

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

  // Check if user has already marked this guide as read
  const checkUserProgress = async () => {
    if (!user || !guide) return;

    const { data } = await supabase
      .from("guide_progress")
      .select("completed")
      .eq("user_id", user.id)
      .eq("guide_slug", slug)
      .maybeSingle();

    if (data) {
      setProgress(data.completed);
    }
  };

  // Mark Guide as Read
  const handleMarkAsRead = async () => {
    if (!user) {
      alert("⚠️ Please log in to track your progress.");
      return;
    }

    const { error } = await supabase
      .from("guide_progress")
      .upsert([{ user_id: user.id, guide_slug: slug, completed: true }]);

    if (error) {
      console.error("❌ Error marking as read:", error);
    } else {
      setProgress(true);
    }
  };

  // Scroll to heading from TOC
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
          {headings.length > 0 && (
            <div className="table-of-contents">
              <h2>Table of Contents</h2>
              <ul>
                {headings.map((heading, index) => (
                  <li
                    key={index}
                    className={heading.level}
                    onClick={() => scrollToHeading(heading.id)}
                    style={{ cursor: "pointer", color: "#007bff" }}
                  >
                    {heading.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

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
