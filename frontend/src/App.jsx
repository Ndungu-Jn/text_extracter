import { useState } from "react";
import { extractText } from "./api";
import ImagePicker from "./components/ImagePicker";
import ImagePreview from "./components/ImagePreview";
import ResultBox from "./components/ResultBox";

export default function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handlePick(picked) {
    setFile(picked);
    setText("");
    setError("");
  }

  async function extract() {
    setLoading(true);
    setError("");
    setText("");
    try {
      const result = await extractText(file);
      setText(result);
      if (!result) setError("No text found in this image. Try a sharper, well-lit photo.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Image to text</h1>
      <p className="lead">Upload a photo or take one. We'll read the text in it.</p>

      <ImagePicker onPick={handlePick} />
      <ImagePreview file={file} />

      {file && (
        <button className="btn primary" onClick={extract} disabled={loading}>
          {loading ? "Reading text…" : "Extract text"}
        </button>
      )}

      {error && <p className="error" role="alert">{error}</p>}

      {text && <ResultBox text={text} onChange={setText} fileName={file?.name} />}
    </main>
  );
}