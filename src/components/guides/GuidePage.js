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
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
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
        checkUserProgress();
      }
    };

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("guide_comments")
        .select("discord_username, comment, created_at")
        .eq("guide_slug", slug)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching comments:", error);
      } else {
        setComments(data);
      }
    };

    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchGuide();
    fetchComments();
    fetchUser();
  }, [slug]);

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

  const checkUserProgress = async () => {
    if (!user) return;

    const discord_username =
      user.user_metadata?.user_name || user.user_metadata?.full_name || "";

    const { data, error } = await supabase
      .from("guide_progress")
      .select("guide_slug")
      .eq("discord_username", discord_username)
      .eq("guide_slug", slug)
      .maybeSingle();

    if (error) {
      console.error("❌ Error checking progress:", error);
    } else if (data) {
      setProgress(true);
    }
  };

  const handleMarkAsRead = async () => {
    if (!guide || progress) return;

    if (!user) {
      alert("⚠️ You need to be logged in to track progress.");
      return;
    }

    const discord_username =
      user.user_metadata?.user_name || user.user_metadata?.full_name || "";

    const { error } = await supabase
      .from("guide_progress")
      .upsert([{ discord_username, guide_slug: slug }]);

    if (error) {
      console.error("❌ Error marking as read:", error);
    } else {
      setProgress(true);
    }
  };

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;

    const discord_username =
      user.user_metadata?.user_name || user.user_metadata?.full_name || "";

    const { error } = await supabase
      .from("guide_comments")
      .insert([{ guide_slug: slug, discord_username, comment: newComment }]);

    if (error) {
      console.error("❌ Error adding comment:", error);
    } else {
      setComments([{ discord_username, comment: newComment, created_at: new Date() }, ...comments]);
      setNewComment("");
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

          <div className="comments-section">
            <h2>Comments</h2>
            {user ? (
              <>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                />
                <button onClick={handleAddComment}>Post Comment</button>
              </>
            ) : (
              <p>Log in to post a comment.</p>
            )}

            <ul>
              {comments.map((comment, index) => (
                <li key={index}>
                  <strong>{comment.discord_username}:</strong> {comment.comment}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p>Loading guide...</p>
      )}
    </div>
  );
};

export default GuidePage;
