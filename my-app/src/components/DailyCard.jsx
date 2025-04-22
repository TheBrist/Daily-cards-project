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

function DailyCard({ username, yesterday, today, needs_help, helper_name, help_accepted, currentUser, onHelpResponded, denied_helpers, onEdit, onDelete }) {
    const [statusKey, setStatusKey] = useState("okay");
    const [showPopup, setShowPopup] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const cardRef = useRef(null);

    useEffect(() => {
        if (help_accepted) {
            setStatusKey("accepted");
        }
        else if (!needs_help) {
            setStatusKey("okay");
        }
        else if (needs_help && !help_accepted) {
            setStatusKey("waiting");
        }

    }, [needs_help, help_accepted]);

    useEffect(() => {
        const checkOverflow = () => {
            if (cardRef.current) {
                const height = cardRef.current.scrollHeight;
                const baseHeight = 200;
                setIsOverflowing(height > baseHeight * 1.5);
            }
        };
        checkOverflow();
    }, [yesterday, today]);

    const handleAccept = () => {
        const fromAnyone = helper_name === "Anybody";
        setStatusKey("accepted");
        onHelpResponded(true, fromAnyone, username);
    };

    const handleDeny = () => {
        setStatusKey("waiting");
        onHelpResponded(false);
    };

    const isCurrentUserBeingAsked = needs_help && ((helper_name === "Anybody" && currentUser !== username) || currentUser === helper_name);

    return (
        <>
            <div
                className={`card card-overflow"`}
                style={{ borderLeft: `6px solid ${statusColors[statusKey]}` }}
                onClick={() => setShowPopup(true)}
                ref={cardRef}
            >

                <div className="card-header">
                    <h3>{username}</h3>
                    <span className={`status status-${statusKey}`}>{statusLabels[statusKey]}</span>

                    {currentUser === username && (
                        <div className="edit-icon-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <button
                                className="edit-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                }}
                            >
                                ✏️ Edit
                            </button>

                            <button
                                className="delete-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                style={{
                                    marginTop: '5px',
                                    color: '#000',
                                    border: 'none',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    )}
                </div>

                <div className="card-section">
                    <strong>Yesterday:</strong>
                    <p>{yesterday}</p>
                </div>

                <div className="card-section">
                    <strong>Today:</strong>
                    <p>{today}</p>
                </div>

                {needs_help && !help_accepted && (
                    <div className="card-section help">
                        <strong>Needs help from:</strong>
                        <p>{helper_name}</p>
                    </div>
                )}

                {!needs_help && help_accepted && (
                    <div className="card-section help-accepted">
                        <strong>Being helped by:</strong>
                        <p>{helper_name}</p>
                    </div>
                )}


                {isCurrentUserBeingAsked && (
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
                        <h3>{username}</h3>
                        <p><strong>Yesterday:</strong> {yesterday}</p>
                        <p><strong>Today:</strong> {today}</p>
                        {needs_help && <p><strong>Needs help from:</strong> {helper_name}</p>}
                        <button onClick={() => setShowPopup(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default DailyCard;
