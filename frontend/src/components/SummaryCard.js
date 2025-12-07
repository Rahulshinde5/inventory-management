import React from "react";

const SummaryCard = ({ label, value, variant = "blue" }) => {
  return (
    <div className={`summary-card ${variant}`}>
      <div className="summary-card-label">{label}</div>
      <div className="summary-card-value">{value}</div>
    </div>
  );
};

export default SummaryCard;
