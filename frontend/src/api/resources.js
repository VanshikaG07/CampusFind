const API_BASE_URL = "http://127.0.0.1:8000";

export async function getResources() {
  const response = await fetch(`${API_BASE_URL}/resources`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load resources");
  }

  return data.resources;
}