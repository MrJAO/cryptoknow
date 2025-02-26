import React, { useState } from 'react';

function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { 
      question: "Search Tab", 
      answer: (
        <>
          <p><strong>Beginner Guides:</strong> Contains a list of basic requirements for starting in crypto, including step-by-step guides.</p>
          <p><strong>Crypto Files:</strong> A section for requested crypto-related resources such as social accounts, tokenomics, airdrop checkers, and more.</p>
        </>
      )
    },
    { 
      question: "To Do List", 
      answer: (
        <>
          <p>This tab displays all the airdrops you added from the Available Airdrops tab.</p>
          <p>It also helps you track completed airdrops by allowing you to check them off and submit finished tasks.</p>
        </>
      )
    },
    { 
      question: "Can I remove an airdrop from my To Do List?", 
      answer: "Yes, just click the 'X' button in the Actions column."
    },
    { 
      question: "Available Airdrops Tab", 
      answer: (
        <>
          <p>This tab lists all ongoing airdrops. Users can add an airdrop to their To Do List by clicking the 'Add' button in the Actions column.</p>
          <p>Airdrops listed here are either added by the developer or contributed by the community.</p>
        </>
      )
    },
    { 
      question: "Contribute Tab", 
      answer: (
        <>
          <p>Here, community members can submit ongoing airdrops that are not yet listed in the Available Airdrops tab.</p>
          <p>Contributors will receive credit, and if a referral link is included, it will be used.</p>
          <p>Credits will also be displayed in the Airdrop Guide for that specific project.</p>
        </>
      )
    },
    { 
      question: "Quests and Leaderboard", 
      answer: (
        <>
          <p>The Quests and Leaderboard system is mainly for fun, but more details will be revealed in the future.</p>
          <p>There will be future raffle rewards based on the points system, but the execution method is still being finalized.</p>
        </>
      )
    },
    { 
      question: "Harvests Tab", 
      answer: "This tab helps track completed airdrops. Once an airdrop from the Available Airdrops list ends, we will gather community feedback via Quests to determine how many members were eligible."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "auto", padding: "20px" }}>
      <div style={{
        background: "#ffcc00",
        padding: "15px",
        borderRadius: "5px",
        textAlign: "center",
        fontSize: "1.2em",
        fontWeight: "bold",
        marginBottom: "20px",
        color: "#000"
      }}>
        ⚠️ DISCLAIMER: The information provided here is for educational purposes only and should not be considered financial advice. Always do your own research and proceed with caution. Your results depend on your own actions and decisions. ⚠️
      </div>
      <h1 style={{ textAlign: "center", marginBottom: "20px", fontSize: "2em" }}>Frequently Asked Questions</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.2em" }}>
        <thead>
          <tr style={{ background: "#333", color: "#fff", textAlign: "left" }}>
            <th style={{ padding: "15px", width: "80%" }}>Question</th>
            <th style={{ padding: "15px", width: "20%" }}>Expand</th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((faq, index) => (
            <React.Fragment key={index}>
              <tr 
                style={{ 
                  borderBottom: "1px solid #ddd", 
                  cursor: "pointer", 
                  background: openIndex === index ? "#666" : "#444",
                  color: "#fff"
                }}
                onClick={() => toggleFAQ(index)}
              >
                <td style={{ padding: "15px", fontWeight: "bold" }}>{faq.question}</td>
                <td style={{ padding: "15px", textAlign: "center" }}>
                  {openIndex === index ? "▲" : "▼"}
                </td>
              </tr>
              {openIndex === index && (
                <tr>
                  <td colSpan="2" style={{ padding: "15px", background: "#222", color: "#fff", borderBottom: "1px solid #ddd" }}>
                    {faq.answer}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FAQs;
