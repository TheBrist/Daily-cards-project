const API_BASE = 'http://localhost:8080/api';

// Get all users
export const getUsers = async () => {
  const res = await fetch(`${API_BASE}/users`);
  return await res.json();
};

// Get entries by date
export const getEntriesByDate = async (date) => {
  const res = await fetch(`${API_BASE}/entries?date=${date}`);
  return await res.json();
};

// Get entries by user and date
export const getEntriesByUserAndDate = async (userName, date) => {
  const res = await fetch(`${API_BASE}/entries?userName=${userName}&date=${date}`);
  return await res.json();
};