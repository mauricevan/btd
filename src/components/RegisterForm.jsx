import { useState } from "react";

export default function RegisterForm({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!email || !password || !confirm) {
      setError("Vul alle velden in.");
      return;
    }
    if (password !== confirm) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }
    setError("");
    onRegister(email, password, setError);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">E-mail</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Wachtwoord</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Bevestig wachtwoord</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Registreren</button>
    </form>
  );
} 