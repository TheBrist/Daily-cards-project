import React from "react";
import "./DateSelector.css";

function DateSelector({ date = new Date() }) {
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="date-selector">
      <button className="arrow-button">◀</button>
      <div className="date-text">{formattedDate}</div>
      <button className="arrow-button">▶</button>
    </div>
  );
}

export default DateSelector;
