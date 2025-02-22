import React, { useState } from 'react';

function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { 
      question: "What is the To Do List?", 
      answer: "It's to maximize your daily crypto farming." 
    },
    { 
      question: "How do I add an airdrop to my To Do List?", 
      answer: "Simply click the 'Add to My List' button on the Available Airdrops page." 
    },
    { 
      question: "Can I remove a task from my To Do List?", 
      answer: "Currently, tasks cannot be removed once added, but we may add this feature in the future." 
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Frequently Asked Questions</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#333", color: "#fff", textAlign: "left" }}>
            <th style={{ padding: "10px", width: "80%" }}>Question</th>
            <th style={{ padding: "10px", width: "20%" }}>Expand</th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((faq, index) => (
            <React.Fragment key={index}>
              <tr 
                style={{ 
                  borderBottom: "1px solid #ddd", 
                  cursor: "pointer", 
                  background: openIndex === index ? "#f1f1f1" : "#fff"
                }}
                onClick={() => toggleFAQ(index)}
              >
                <td style={{ padding: "10px", fontWeight: "bold" }}>{faq.question}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {openIndex === index ? "▲" : "▼"}
                </td>
              </tr>
              {openIndex === index && (
                <tr>
                  <td colSpan="2" style={{ padding: "10px", background: "#444", color: "#fff", borderBottom: "1px solid #ddd" }}>
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
