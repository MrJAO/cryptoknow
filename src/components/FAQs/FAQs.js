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
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Frequently Asked Questions</h1>
      <div>
        {faqs.map((faq, index) => (
          <div key={index} style={{ marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
            <button 
              onClick={() => toggleFAQ(index)} 
              style={{ 
                width: "100%", 
                textAlign: "left", 
                background: "none", 
                border: "none", 
                fontSize: "18px", 
                cursor: "pointer", 
                padding: "10px",
                fontWeight: "bold" 
              }}
            >
              {faq.question} {openIndex === index ? "▲" : "▼"}
            </button>
            {openIndex === index && (
              <p style={{ padding: "10px", background: "#f9f9f9", borderRadius: "5px" }}>
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQs;

