const BASE = "http://127.0.0.1:8000";

export const getAllSchemes = () =>
  fetch(`${BASE}/schemes`).then(r => r.json());

export const getSchemeById = (id) =>
  fetch(`${BASE}/schemes/${id}`).then(r => r.json());

export const saveProfile = (data) =>
  fetch(`${BASE}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(r => r.json());

export const getRecommendations = (data) =>
  fetch(`${BASE}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(r => r.json());