import React, { useState } from "react";
import DateSelector from "./DateSelector";
import DailyCard from "./DailyCard";
import "./Dashboard.css";
import PostDailyCardForm from "./PostDailyCardForm";


const initialCards = [
    { id: 1, user: "Fentanetanel", needsHelp: false, helpAccepted: null, helperName: "", yesterday:"cummed", today: "raped" },
    { id: 2, user: "Ori Ramos", needsHelp: true, helpAccepted: null, helperName: "Fentanetanel", yesterday:"cummed", today: "raped"  },
    { id: 3, user: "Ori The Cool", needsHelp: true, helpAccepted: true, helperName: "Yeskin the king" },
    { id: 4, user: "Yeskin the king", needsHelp: false, helpAccepted: null, helperName: "" },
    { id: 5, user: "Grandpa", needsHelp: true, helpAccepted: true, helperName: "Yeskin the king" },
    { id: 6, user: "Matan", needsHelp: true, helpAccepted: null, helperName: "Anybody" },
];

function Dashboard({ user, onLogout }) {
    const [cards, setCards] = useState(initialCards);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleHelpResponse = (cardId, accepted, fromAnyone = false) => {
        setCards((prevCards) =>
            prevCards.map((card) =>
                card.id === cardId
                    ? {
                        ...card,
                        helpAccepted: accepted,
                        needsHelp: accepted ? false : card.needsHelp,
                        helperName: accepted
                            ? fromAnyone
                                ? user
                                : card.helperName
                            : "",
                    }
                    : card
            )
        );
    };

    const handleSaveCard = (newCard) => {
        setCards([...cards, newCard]);
        setIsFormOpen(false);
    };

    const handleDiscardCard = () => {
        setIsFormOpen(false);
    };

    return (
        <div>
            <div style={{ textAlign: "right", padding: "10px 20px" }}>
                <span style={{ marginRight: "10px" }}>
                    Logged in as: <b>{user}</b>
                </span>
                <button onClick={onLogout}>Logout</button>
            </div>

            <div className="dashboard-container">
                <DateSelector />
                <button className="post-card-btn" onClick={() => setIsFormOpen(true)}>
                    Post Daily Card
                </button>

                {isFormOpen && (
                    <PostDailyCardForm
                        onSave={handleSaveCard}
                        onDiscard={handleDiscardCard}
                        user={user}
                    />
                )}

                <div className="card-grid">
                    {cards.map((card) => (
                        <DailyCard
                            key={card.id}
                            user={card.user}
                            needsHelp={card.needsHelp}
                            helpAccepted={card.helpAccepted}
                            helperName={card.helperName}
                            currentUser={user}
                            onHelpResponded={(accepted, fromAnyone) =>
                                handleHelpResponse(card.id, accepted, fromAnyone)
                            }
                            yesterday={card.yesterday}
                            today={card.today}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;