import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./AirdropPages.css";

const AirdropPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [airdrop, setAirdrop] = useState(null);

  useEffect(() => {
    console.log("🔍 Checking slug:", slug); // Debugging
    if (!slug) {
      console.error("❌ Error: Slug is undefined");
      return;
    }

    const fetchAirdrop = async () => {
      const { data, error } = await supabase
        .from("available_airdrops")
        .select("*")
        .eq("slug", slug)
        .single(); // Ensure it always returns an object

      if (error) {
        console.error("❌ Error fetching airdrop:", error.message);
      } else {
        setAirdrop(data);
      }
    };

    fetchAirdrop();
  }, [slug]);

  return (
    <div className="airdrop-page">
      <button className="back-button" onClick={() => navigate("/available-airdrops")}>
        ← Back to Available Airdrops
      </button>

      {airdrop ? (
        <>
          <h1 className="airdrop-title">{airdrop.project_name}</h1>
          <p><strong>Chain:</strong> {airdrop.chain}</p>
          <p><strong>Airdrop Type:</strong> {airdrop.airdrop_type}</p>
          <p><strong>Device Needed:</strong> {airdrop.device_needed}</p>
          <p><strong>Status:</strong> {airdrop.status ? "🟢 Ongoing" : "🔴 Ended"}</p>
        </>
      ) : (
        <p>Loading airdrop details...</p>
      )}
    </div>
  );
};

export default AirdropPage;