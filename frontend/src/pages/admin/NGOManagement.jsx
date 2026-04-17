import { useEffect, useState } from "react";
import API from "../../services/api";

export default function NGOManagement() {
  const [ngos, setNgos] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });

  const fetchNGOs = async () => {
    const res = await API.get("/admin/ngos");
    setNgos(res.data);
  };

  const addNGO = async (e) => {
    e.preventDefault();
    await API.post("/admin/ngos", form);
    setForm({ name: "", email: "" });
    fetchNGOs();
  };

  useEffect(() => {
    fetchNGOs();
  }, []);

  return (
    <div className="p-5">
      <h2>NGO Management</h2>

      <form onSubmit={addNGO} className="mb-4">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button>Add NGO</button>
      </form>

      {ngos.map((ngo) => (
        <div key={ngo._id} className="border p-2 my-2">
          <p>{ngo.name}</p>
          <p>{ngo.email}</p>
        </div>
      ))}
    </div>
  );
}