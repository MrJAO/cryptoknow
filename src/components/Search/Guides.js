import React, { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient';

function Guides() {
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    const { data, error } = await supabase.from("guides").select("*");
    if (error) {
      console.error("Error fetching guides:", error);
    } else {
      setGuides(data);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Guides</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#333", color: "#fff", textAlign: "left" }}>
            <th style={{ padding: "10px", width: "40%" }}>Title</th>
            <th style={{ padding: "10px", width: "40%" }}>Guide Link</th>
            <th style={{ padding: "10px", width: "20%" }}>Importance</th>
          </tr>
        </thead>
        <tbody>
          {guides.map((guide) => (
            <tr key={guide.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px", fontWeight: "bold" }}>{guide.title}</td>
              <td style={{ padding: "10px" }}>
                <a
                  href={guide.guide_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#007bff", textDecoration: "none" }}
                >
                  Open Guide
                </a>
              </td>
              <td style={{ padding: "10px", fontWeight: "bold", color: "#ff8800" }}>
                {guide.importance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Guides;
