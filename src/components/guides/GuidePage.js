import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./GuidePage.css";

const GuidePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("title, content, importance, category")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching guide:", error);
      } else {
        setGuide(data);
      }
      setLoading(false);
    };

    fetchGuide();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!guide) return <p>Guide not found.</p>;

  // Extract headings for Table of Contents
  const extractHeadings = (htmlContent) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const headings = tempDiv.querySelectorAll("h2, h3");
    return Array.from(headings).map((heading) => ({
      id: heading.innerText.replace(/\s+/g, "-").toLowerCase(),
      text: heading.innerText,
      tag: heading.tagName,
    }));
  };

  const headings = extractHeadings(guide.content);

  return (
    <div className="guide-container">
      {/* Back Button */}
      <button onClick={() => navigate("/search")} className="back-button">
        ← Back to Guides
      </button>
      
      {/* Title & Importance */}
      <h1 className="guide-title">{guide.title}</h1>
      <p className="guide-importance">Importance: {guide.importance}</p>
      
      {/* Table of Contents */}
      {headings.length > 0 && (
        <div className="table-of-contents">
          <h3>Table of Contents</h3>
          <ul>
            {headings.map((heading) => (
              <li key={heading.id} className={heading.tag.toLowerCase()}>
                <a href={`#${heading.id}`}>{heading.text}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Guide Content */}
      <div className="guide-content" dangerouslySetInnerHTML={{ __html: guide.content }}></div>
    </div>
  );
};

export default GuidePage;
