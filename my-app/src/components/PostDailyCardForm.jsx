import React, { useState, useEffect } from "react"; 
import "./PostDailyCardForm.css";

function PostDailyCardForm({ onSave, onDiscard, user, users, card }) {
    const [formData, setFormData] = useState({
        yesterday: "",
        today: "",
        needs_help: false,
        helper_name: "",
    });

    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        if (card) {
            setFormData({
                yesterday: card.yesterday || "",
                today: card.today || "",
                needs_help: card.needs_help || false,
                helper_name: card.helper_name || "",
            });
        }
    }, [card]);

    useEffect(() => {
        const isTextValid =
            formData.yesterday.trim().length >= 5 &&
            formData.today.trim().length >= 5;
        const isHelperValid = !formData.needs_help || (formData.needs_help && formData.helper_name);
        setIsFormValid(isTextValid && isHelperValid);
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = () => {
        setFormData((prevData) => ({
            ...prevData,
            needs_help: !prevData.needs_help,
        }));
    };

    const handleSelectHelper = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            helper_name: e.target.value,
        }));
    };

    const handleSave = () => {
        const newCard = {
            username: user,
            yesterday: formData.yesterday,
            today: formData.today,
            needs_help: formData.needs_help,
            help_accepted: false,
            helper_name: formData.helper_name,
        }
        onSave(newCard);
    };

    const handleDiscard = () => {
        onDiscard();
    };

    return (
        <div className="popup-form">
            <h2>Post a Daily Card</h2>
            <div className="form-group">
                <label>Yesterday's Progress:</label>
                <textarea
                    name="yesterday"
                    value={formData.yesterday}
                    onChange={handleInputChange}
                    placeholder="What did you do yesterday?"
                />
            </div>
            <div className="form-group">
                <label>Today's Plan:</label>
                <textarea
                    name="today"
                    value={formData.today}
                    onChange={handleInputChange}
                    placeholder="What is your plan for today?"
                />
            </div>

            <div className="form-group">
                <label>
                    <input
                        type="checkbox"
                        checked={formData.needs_help}
                        onChange={handleCheckboxChange}
                    />
                    Need help?
                </label>
            </div>

            {formData.needs_help && (
                <div className="form-group">
                    <label>Select a Helper:</label>
                    <select
                        name="helperName"
                        value={formData.helper_name}
                        onChange={handleSelectHelper}
                    >
                        <option value="">Select User</option>
                        {users?.map((user) => (
                            <option key={user} value={user}>
                                {user}
                            </option>
                        ))}
                        <option key="Anybody" value="Anybody">Anybody</option >
                    </select>
                </div>
            )}

            <div className="form-actions">
                <button
                    className="save-btn"
                    onClick={handleSave}
                    disabled={!isFormValid}
                >
                    Save
                </button>
                <button className="discard-btn" onClick={handleDiscard}>
                    Discard
                </button>
            </div>
        </div>
    );
}

export default PostDailyCardForm;
