const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function extractText(file) {
  const body = new FormData();
  body.append("file", file);

  let res;
  try {
    res = await fetch(`${API_URL}/api/ocr`, { method: "POST", body });
  } catch {
    throw new Error("Can't reach the server. Is the backend running?");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Something went wrong.");
  return data.text || "";
}