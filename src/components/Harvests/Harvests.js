import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

function Harvests() {
  const [harvests, setHarvests] = useState([]);

  useEffect(() => {
    fetchHarvests();
  }, []);

  const fetchHarvests = async () => {
    const { data, error } = await supabase.from("harvests").select("*");
    if (error) {
      console.error("Error fetching harvests:", error);
    } else {
      setHarvests(data);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Harvests</h1>

      <div
        style={{
          width: "100%",
          overflowX: "auto",
          padding: "20px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "600px",
          }}
        >
          <thead>
            <tr style={{ background: "#333", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: "12px", width: "30%" }}>Project Name</th>
              <th style={{ padding: "12px", width: "20%" }}>Ended Date</th>
              <th style={{ padding: "12px", width: "15%" }}>Eligible Knowers</th>
              <th style={{ padding: "12px", width: "15%" }}>Not Eligible</th>
              <th style={{ padding: "12px", width: "20%" }}>Total Knowers Participants</th>
            </tr>
          </thead>
          <tbody>
            {harvests.map((harvest) => (
              <tr key={harvest.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{harvest.project_name}</td>
                <td style={{ padding: "12px" }}>{harvest.ended_date}</td>
                <td style={{ padding: "12px" }}>{harvest.eligible_knowers}</td>
                <td style={{ padding: "12px" }}>{harvest.not_eligible}</td>
                <td style={{ padding: "12px" }}>{harvest.total_knowers_participants}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Harvests;
