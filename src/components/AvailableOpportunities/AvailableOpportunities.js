import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

function AvailableOpportunities() {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    const { data, error } = await supabase.from("available_opportunities").select("*");
    if (error) {
      console.error("Error fetching opportunities:", error);
    } else {
      setOpportunities(data);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Available Opportunities</h1>

      {/* Disclaimer */}
      <div
        style={{
          background: "#ffcc00",
          color: "#333",
          padding: "15px",
          fontSize: "18px",
          fontWeight: "bold",
          borderRadius: "5px",
          maxWidth: "800px",
          margin: "20px auto",
          textAlign: "center",
          border: "2px solid #ff9900",
        }}
      >
        ⚠️ Disclaimer: Investing or interacting with some of these opportunities comes with risk.
        Always do your own research. This is NOT financial advice.
      </div>

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
              <th style={{ padding: "12px", width: "20%" }}>Type</th>
              <th style={{ padding: "12px", width: "30%" }}>Link</th>			  
              <th style={{ padding: "12px", width: "20%" }}>End Date</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opportunity) => (
              <tr key={opportunity.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{opportunity.project_name}</td>
                <td style={{ padding: "12px" }}>{opportunity.type}</td>
                <td style={{ padding: "12px" }}>
                  <a
                    href={opportunity.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#007bff", textDecoration: "none", wordBreak: "break-word" }}
                  >
                    Visit
                  </a>
                </td>				
                <td style={{ padding: "12px", color: "#d9534f", fontWeight: "bold" }}>
                  {opportunity.end_date ? opportunity.end_date : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AvailableOpportunities;
