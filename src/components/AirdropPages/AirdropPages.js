import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./AirdropPages.css";

const AirdropPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [airdrop, setAirdrop] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchAirdrop = async () => {
      const { data, error } = await supabase
        .from("available_airdrops")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) {
        console.error("❌ Error fetching airdrop:", error);
      } else {
        setAirdrop(data);
      }
    };

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("airdrop_comments")
        .select("discord_username, comment, created_at")
        .eq("airdrop_slug", slug)
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

    fetchAirdrop();
    fetchComments();
    fetchUser();
  }, [slug]);

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;

    const discord_username =
      user.user_metadata?.user_name || user.user_metadata?.full_name || "";

    const { error } = await supabase
      .from("airdrop_comments")
      .insert([{ airdrop_slug: slug, discord_username, comment: newComment }]);

    if (error) {
      console.error("❌ Error adding comment:", error);
    } else {
      setComments([{ discord_username, comment: newComment, created_at: new Date() }, ...comments]);
      setNewComment("");
    }
  };

  return (
    <div className="airdrop-page">
      <button className="back-button" onClick={() => navigate("/available-airdrops")}>← Back to Available Airdrops</button>

      {airdrop ? (
        <>
          <h1 className="airdrop-title">{airdrop.project_name}</h1>
          <p><strong>Chain:</strong> {airdrop.chain}</p>
          <p><strong>Airdrop Type:</strong> {airdrop.airdrop_type}</p>
          <p><strong>Device Needed:</strong> {airdrop.device_needed}</p>
          <p><strong>Status:</strong> {airdrop.status ? "🟢 Ongoing" : "🔴 Ended"}</p>

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
        <p>Loading airdrop details...</p>
      )}
    </div>
  );
};

export default AirdropPage;
