import React, { useEffect, useState, useRef } from "react";
import "./DailyCard.css";

const statusColors = {
    okay: "#c3f7c0",
    waiting: "#fff3b0",
    accepted: "#b0d8ff",
};

const statusLabels = {
    okay: "OKAY",
    waiting: "Waiting for Help",
    accepted: "Help Accepted",
};

function DailyCard({ user, yesterday, today, needsHelp, helperName, helpAccepted, currentUser, onHelpResponded }) {
    const [statusKey, setStatusKey] = useState("okay");
    const [showPopup, setShowPopup] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const cardRef = useRef(null);

    useEffect(() => {
        if (!needsHelp) {
            setStatusKey("okay");
        } else if (needsHelp && helpAccepted === null) {
            setStatusKey("waiting");
        } else if (needsHelp && helpAccepted) {
            setStatusKey("accepted");
        }
    }, [needsHelp, helpAccepted]);

    useEffect(() => {
        const checkOverflow = () => {
            if (cardRef.current) {
                const height = cardRef.current.scrollHeight;
                const baseHeight = 200; // Estimate of base height
                setIsOverflowing(height > baseHeight * 1.5);
            }
        };
        checkOverflow();
    }, [yesterday, today]);

    const handleAccept = () => {
        const fromAnyone = !helperName;
        setStatusKey("accepted");
        onHelpResponded(true, fromAnyone);
    };

    const handleDeny = () => {
        setStatusKey("waiting");
        onHelpResponded(false);
    };

    const isCurrentUserBeingAsked = needsHelp && currentUser === helperName;

    return (
        <>
            <div
                className={`card card-overflow"`}
                style={{ borderLeft: `6px solid ${statusColors[statusKey]}` }}
                onClick={() => setShowPopup(true)}
                ref={cardRef}
            >
                <div className="card-header">
                    <h3>{user}</h3>
                    <span className={`status status-${statusKey}`}>{statusLabels[statusKey]}</span>
                </div>

                <div className="card-section">
                    <strong>Yesterday:</strong>
                    <p>{yesterday}</p>
                </div>

                <div className="card-section">
                    <strong>Today:</strong>
                    <p>{today}</p>
                </div>

                {needsHelp && helperName && helpAccepted === null && (
                    <div className="card-section help">
                        <strong>Needs help from:</strong>
                        <p>{helperName}</p>
                    </div>
                )}


                {needsHelp && helperName && helpAccepted === null && (isCurrentUserBeingAsked || helperName === "Anybody") && (
                    <div className="help-actions-sticky">
                        <button className="accept-btn" onClick={handleAccept}>
                            Accept
                        </button>
                        <button className="deny-btn" onClick={handleDeny}>
                            Deny
                        </button>
                    </div>
                )}

                {isOverflowing && <div className="card-expand-overlay">Click to view full</div>}
            </div>

            {showPopup && (
                <div className="popup-overlay" onClick={() => setShowPopup(false)}>
                    <div className="popup-card" onClick={(e) => e.stopPropagation()}>
                        <h3>{user}</h3>
                        <p><strong>Yesterday:</strong> {yesterday}</p>
                        <p><strong>Today:</strong> {today}</p>
                        {needsHelp && <p><strong>Needs help from:</strong> {helperName}</p>}
                        <button onClick={() => setShowPopup(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default DailyCard;
