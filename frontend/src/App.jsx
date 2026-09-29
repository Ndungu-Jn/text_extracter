import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Create and clean up the preview URL
  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function pick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setText("");
    setError("");
  }

  async function extract() {
    setLoading(true);
    setError("");
    setText("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch(`${API_URL}/api/ocr`, { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Something went wrong.");
      setText(data.text || "");
      if (!data.text) setError("No text found in this image. Try a sharper, well-lit photo.");
    } catch (err) {
      setError(err.message || "Can't reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main>
      <h1>Image to text</h1>
      <p className="lead">Upload a photo or take one. We'll read the text in it.</p>

      <div className="actions">
        <label className="btn">
          Choose image
          <input type="file" accept="image/*" onChange={pick} hidden />
        </label>
        <label className="btn">
          Take photo
          <input type="file" accept="image/*" capture="environment" onChange={pick} hidden />
        </label>
      </div>

      {preview && <img className="preview" src={preview} alt="Selected upload" />}

      {file && (
        <button className="btn primary" onClick={extract} disabled={loading}>
          {loading ? "Reading text…" : "Extract text"}
        </button>
      )}

      {error && <p className="error" role="alert">{error}</p>}

      {text && (
        <section>
          <div className="result-head">
            <h2>Extracted text</h2>
            <button className="btn" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
          </div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} />
        </section>
      )}
    </main>
  );
}
