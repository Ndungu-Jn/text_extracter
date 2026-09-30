import { useState } from "react";

export default function ResultBox({ text, onChange, fileName }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function download() {
    const name = fileName ? fileName.replace(/\.[^.]+$/, "") : "extracted-text";
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${name}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section>
      <div className="result-head">
        <h2>Extracted text</h2>
        <div className="result-actions">
          <button className="btn" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
          <button className="btn" onClick={download}>Download .txt</button>
        </div>
      </div>
      <textarea value={text} onChange={(e) => onChange(e.target.value)} rows={10} />
    </section>
  );
}