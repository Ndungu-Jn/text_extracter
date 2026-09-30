export default function ImagePicker({ onPick }) {
  function handleChange(e) {
    const f = e.target.files?.[0];
    if (f) onPick(f);
    e.target.value = ""; // lets you pick the same file again
  }

  return (
    <div className="actions">
      <label className="btn">
        Choose image
        <input type="file" accept="image/*" onChange={handleChange} hidden />
      </label>
      <label className="btn">
        Take photo
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          hidden
        />
      </label>
    </div>
  );
}