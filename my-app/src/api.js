const API_BASE = import.meta.env.VITE_API_BASE ;

export const getUsernames = async () => {
  console.log(`${API_BASE} API_BASE IS`)
  const res = await fetch(`${API_BASE}/usernames`);
  return await res.json();
};

export const getUsersPass = async () => {
  const res = await fetch(`${API_BASE}/userspass`)
  return await res.json();
}

export const getEntriesByDate = async (dateObj) => {
  const date = dateObj.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  const res = await fetch(`${API_BASE}/entries/${date}`);
  return await res.json();
};

export const getEntriesByUserAndDate = async (userName, date) => {
  const res = await fetch(`${API_BASE}/entries?userName=${userName}&date=${date}`);
  return await res.json();
};

export const postEntry = async (entry) => {
  entry.date = new Date().toISOString().split('T')[0];
  const res = await fetch(`${API_BASE}/entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entry)
  })

  if (!res.ok) {
    throw new Error("Failed to post entry");
  }

  return await res.json();
};

export const editEntry = async (entryId, updatedEntry) => {
  const res = await fetch(`${API_BASE}/entries/${entryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedEntry),
  });
  if(!res.ok) throw new Error("Failed to update entry");
  return await res.json();
}

export const deleteEntry = async (entryId) => {
  const res = await fetch(`${API_BASE}/entries/${entryId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error("Failed to delete entry");
};