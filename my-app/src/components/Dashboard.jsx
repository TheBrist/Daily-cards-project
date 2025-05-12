import React, { useEffect, useState } from "react";
import DateSelector from "./DateSelector";
import DailyCard from "./DailyCard";
import "./Dashboard.css";
import PostDailyCardForm from "./PostDailyCardForm"; ``
import { deleteEntry, editEntry, getEntriesByDate, postEntry, getUsernames } from "../api";

function Dashboard({ onLogout }) {
    const [cards, setCards] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editingCard, setEditingCard] = useState(null);
    const [usernames, setUsernames] = useState(null)
    const [user, setuser] = useState(null);

    const fetchUsers = async () => {
        const usernames = await getUsernames()
        setUsernames(usernames)
    }
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            setuser(stored);
        } else {
            googleLogin();
        }
    }, []);

    const googleLogin = async () => {
        const username = await newLogin();
        if (username) {
            setuser(username);
        }
    }

    useEffect(() => {
        fetchUsers()
    }, []);

    const fetchEntriesByDate = async () => {
        const cards = await getEntriesByDate(selectedDate)
        setCards(cards)
    }

    const deleteEntryById = async (entryId) => {
        deleteEntry(entryId);
        setCards((prev) => prev.filter((c) => c.id !== entryId));
    }

    useEffect(() => {
        fetchEntriesByDate()
    }, [selectedDate]);

    const goToPreviousDay = () => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() - 1);
            return newDate;
        });
    };

    const goToNextDay = () => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + 1);
            return newDate;
        });
    };

    const handleHelpResponse = async (cardId, accepted, fromAnyone = false, actual_helper) => {
        const originalCard = cards.find((c) => c.id === cardId);
        if (!originalCard) return;

        const { id, ...cardDataWithoutId } = originalCard;

        const updatedCard = {
            ...cardDataWithoutId,
            help_accepted: accepted,
            needs_help: accepted ? false : true,
            helper_name: actual_helper
                ? (fromAnyone ? user : originalCard.helper_name)
                : "Anybody",
            denied_helpers: accepted
                ? originalCard.denied_helpers || []
                : [...(originalCard.denied_helpers || []), user],
        };



        try {
            await editEntry(cardId, updatedCard);
            setCards((prevCards) =>
                prevCards.map((card) =>
                    card.id === cardId ? { ...card, ...updatedCard } : card
                )
            );
        } catch (err) {
            console.error("Failed to update help status:", err);
        }
    };

    const handleSaveCard = async (newEntry) => {
        if (editingCard) {
            await editEntry(editingCard.id, newEntry);
        } else {
            await postEntry(newEntry);
        }
        setEditingCard(null);
        setIsFormOpen(false);
        fetchEntriesByDate();
    };


    const handleDiscardCard = () => {
        setIsFormOpen(false);
        setEditingCard(null);
    };

    return (
        <div>
            <div style={{ textAlign: "right", padding: "10px 20px" }}>
                <span style={{ marginRight: "10px" }}>
                    Logged in as: <b>{user}</b>
                </span>
                <button onClick={googleLogin()}>Refresh session</button>
                <button onClick={onLogout}>Logout</button>
            </div>

            <div className="dashboard-container">
                <DateSelector
                    date={selectedDate}
                    onPrev={goToPreviousDay}
                    onNext={goToNextDay}
                />
                {new Date().toDateString() === selectedDate.toDateString() &&
                    (<button className="post-card-btn" onClick={() => setIsFormOpen(true)}>
                        Post Daily Card
                    </button>)}

                {isFormOpen && (
                    <PostDailyCardForm
                        onSave={handleSaveCard}
                        onDiscard={handleDiscardCard}
                        user={user}
                        usernames={usernames}
                        card={editingCard}
                    />
                )}

                <div className="card-grid">
                    {cards?.map((card) => (
                        <DailyCard
                            key={card.id}
                            username={card.username}
                            needs_help={card.needs_help}
                            help_accepted={card.help_accepted}
                            helper_name={card.helper_name}
                            user={user}
                            onHelpResponded={(accepted, fromAnyone, actual_helper) =>
                                handleHelpResponse(card.id, accepted, fromAnyone, actual_helper)
                            }
                            yesterday={card.yesterday}
                            today={card.today}
                            denied_helpers={card.denied_helpers}
                            onEdit={() => {
                                setEditingCard(card);
                                setIsFormOpen(true);
                            }}
                            onDelete={() => {
                                deleteEntryById(card.id)
                            }}

                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;