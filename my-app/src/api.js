const token = localStorage.getItem('token');
const API_BASE = import.meta.env.VITE_API_BASE ;

export const login = async (credentials) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) throw new Error("Login failed");

  const data = await res.json();
  return data;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getUsernames = async () => {
  const res = await fetch(`${API_BASE}/usernames`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch entries");
  return await res.json();
}

export const getEntriesByDate = async (dateObj) => {
  const date = dateObj.toISOString().split('T')[0];
  const token = getToken();
  const res = await fetch(`${API_BASE}/entries/${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch entries");
  return await res.json();
};

export const getEntriesByUserAndDate = async (userName, date) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/entries?userName=${userName}&date=${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch entries by user and date");
  return await res.json();
};

export const postEntry = async (entry) => {
  entry.date = new Date().toISOString().split('T')[0];
  const token = getToken();
  const res = await fetch(`${API_BASE}/entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(entry),
  });

  if (!res.ok) throw new Error("Failed to post entry");
  return await res.json();
};

export const editEntry = async (entryId, updatedEntry) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/entries/${entryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedEntry),
  });

  if (!res.ok) throw new Error("Failed to update entry");
  return await res.json();
};

export const deleteEntry = async (entryId) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/entries/${entryId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete entry");
};