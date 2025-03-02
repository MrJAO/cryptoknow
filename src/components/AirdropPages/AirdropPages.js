import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./AirdropPages.css";

const AirdropPages = ({ user }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [airdrop, setAirdrop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      console.error("❌ Error: Slug is undefined");
      return;
    }

    const fetchAirdrop = async () => {
      setLoading(true);
      let airdropData = null;
      let error = null;
      
      if (location.pathname.includes("to-do-list") && user) {
        // If user is logged in & viewing from To-Do List, fetch their saved slug
        const { data: userAirdrop, error: userError } = await supabase
          .from("to_do_list")
          .select("slug")
          .eq("discord_username", user.discord_username)
          .eq("slug", slug)
          .single();

        if (userError || !userAirdrop) {
          console.error("❌ Error fetching user's saved airdrop:", userError?.message);
          setLoading(false);
          return;
        }
      }

      // Fetch airdrop details from available_airdrops
      const { data, error: fetchError } = await supabase
        .from("available_airdrops")
        .select("project_name, chain, airdrop_type, device_needed, status, content")
        .eq("slug", slug)
        .single();

      if (fetchError) {
        console.error("❌ Error fetching airdrop:", fetchError.message);
      } else {
        airdropData = data;
      }

      setAirdrop(airdropData);
      setLoading(false);
    };

    fetchAirdrop();
  }, [slug, user, location.pathname]);

  return (
    <div className="airdrop-page">
      {loading ? (
        <p>Loading airdrop details...</p>
      ) : airdrop ? (
        <>
          <h1 className="airdrop-title">{airdrop.project_name}</h1>
          <p><strong>Chain:</strong> {airdrop.chain}</p>
          <p><strong>Airdrop Type:</strong> {airdrop.airdrop_type}</p>
          <p><strong>Device Needed:</strong> {airdrop.device_needed}</p>
          <p><strong>Status:</strong> {airdrop.status ? "🟢 Ongoing" : "🔴 Ended"}</p>

          {/* ✅ Display Content as HTML */}
          {airdrop.content ? (
            <div className="airdrop-content">
              <h2>Details & Instructions</h2>
              <div dangerouslySetInnerHTML={{ __html: airdrop.content }} />
            </div>
          ) : (
            <p>ℹ️ No additional details available.</p>
          )}
        </>
      ) : (
        <p>❌ No airdrop found for this slug.</p>
      )}

      {/* ✅ Move Back Button to the Bottom */}
      <button 
        className="back-button" 
        onClick={() => navigate(location.pathname.includes("to-do-list") ? "/to-do-list" : "/available-airdrops")}
      >
        ← Back
      </button>
    </div>
  );
};

export default AirdropPages;
