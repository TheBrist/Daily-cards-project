import React from "react";
import "./DateSelector.css";

function DateSelector({ date, onPrev, onNext }) {
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString(); // Compare date without time

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="date-selector">
      <button className="arrow-button" onClick={onPrev}>◀</button>
      <div className="date-text">{formattedDate}</div>
      <button
        className="arrow-button"
        onClick={onNext}
        disabled={isToday}  // Disable the 'next' button if the date is today
      >
        ▶
      </button>
    </div>
  );
}

export default DateSelector;
