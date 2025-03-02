import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./AirdropPages.css";

const AirdropPages = () => {  // ✅ Name matches App.js
  const { slug } = useParams();
  const navigate = useNavigate();
  const [airdrop, setAirdrop] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  useEffect(() => {
    console.log("🔍 Checking slug:", slug);
    if (!slug) {
      console.error("❌ Error: Slug is undefined");
      return;
    }

    const fetchAirdrop = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("available_airdrops")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("❌ Error fetching airdrop:", error.message);
      } else {
        console.log("✅ Airdrop data received:", data);
        setAirdrop(data);
      }
      setLoading(false);
    };

    fetchAirdrop();
  }, [slug]);

  return (
    <div className="airdrop-page">
      <button className="back-button" onClick={() => navigate("/available-airdrops")}>
        ← Back to Available Airdrops
      </button>

      {loading ? (
        <p>Loading airdrop details...</p>
      ) : airdrop ? (
        <>
          <h1 className="airdrop-title">{airdrop.project_name}</h1>
          <p><strong>Chain:</strong> {airdrop.chain}</p>
          <p><strong>Airdrop Type:</strong> {airdrop.airdrop_type}</p>
          <p><strong>Device Needed:</strong> {airdrop.device_needed}</p>
          <p><strong>Status:</strong> {airdrop.status ? "🟢 Ongoing" : "🔴 Ended"}</p>
        </>
      ) : (
        <p>❌ No airdrop found for this slug.</p> // ✅ Error message if no data
      )}
    </div>
  );
};

export default AirdropPages;
