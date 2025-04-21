import React, { useState, useEffect } from "react"; 
import users from "../users.js";
import "./PostDailyCardForm.css";

function PostDailyCardForm({ onSave, onDiscard, user }) {
    const [formData, setFormData] = useState({
        yesterday: "",
        today: "",
        needsHelp: false,
        helperName: "",
    });

    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const isTextValid =
            formData.yesterday.trim().length >= 5 &&
            formData.today.trim().length >= 5;
        const isHelperValid = !formData.needsHelp || (formData.needsHelp && formData.helperName);
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
            needsHelp: !prevData.needsHelp,
        }));
    };

    const handleSelectHelper = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            helperName: e.target.value,
        }));
    };

    const handleSave = () => {
        const newCard = {
            id: Date.now(),
            user: user,
            needsHelp: formData.needsHelp,
            helpAccepted: null,
            helperName: formData.helperName,
            yesterday: formData.yesterday,
            today: formData.today,
        };

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
                        checked={formData.needsHelp}
                        onChange={handleCheckboxChange}
                    />
                    Need help?
                </label>
            </div>

            {formData.needsHelp && (
                <div className="form-group">
                    <label>Select a Helper:</label>
                    <select
                        name="helperName"
                        value={formData.helperName}
                        onChange={handleSelectHelper}
                    >
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user.name} value={user.name}>
                                {user.name}
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
