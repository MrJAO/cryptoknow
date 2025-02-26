import React from "react";
import { supabase } from "../../supabaseClient";
import "./NoticePage.css"; // Make sure to create a CSS file for styling

const NoticePage = () => {
  return (
    <div className="notice-container">
      <div className="warning-icon">⚠️</div>
      <p className="notice-text">
        The crypto space offers many opportunities, but success requires effort
        and learning. Keep in mind that it's still a gamble—we can’t guarantee
        earnings from our efforts. Sometimes, we might fail, be ineligible, or
        even get wrongly flagged as sybil, which could waste our efforts.
        However, I hope these setbacks won’t discourage you. Failure is a part
        of learning, and through persistence, we gain valuable experience.
      </p>
      <p className="notice-text">
        I will do my best to help and guide everyone, but I also hope that we
        can support each other on this journey. Let’s contribute, grow
        together, and achieve our goals as a community.
      </p>
      <p className="signature">Sincerely yours,<br />
      JAO 🌻</p>
    </div>
  );
};

export default NoticePage;
