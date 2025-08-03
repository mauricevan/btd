import { useState } from "react";

export default function AdminForm({ onAdd }) {
  const [form, setForm] = useState({ name: "", articleNumber: "", price: "", image: "" });
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.articleNumber || !form.price || !form.image) {
      setError("Vul alle velden in.");
      return;
    }
    setError("");
    onAdd({ ...form, price: parseFloat(form.price) });
    setForm({ name: "", articleNumber: "", price: "", image: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <div>
        <label className="block mb-1 font-medium">Naam</label>
        <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Artikelnummer</label>
        <input name="articleNumber" value={form.articleNumber} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Prijs (€)</label>
        <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Afbeelding URL</label>
        <input name="image" value={form.image} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Toevoegen</button>
    </form>
  );
} 