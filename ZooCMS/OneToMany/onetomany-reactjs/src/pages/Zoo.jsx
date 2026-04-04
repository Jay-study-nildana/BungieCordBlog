import React, { useEffect, useState } from "react";

const GET_ZOOS_URL = "https://localhost:7226/api/Practice/GetZoos";
const CREATE_ZOO_URL = "https://localhost:7226/api/Practice/CreateZoo";

export default function Zoo() {
  const [zoos, setZoos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nameOfZoo: "", locationOfZoo: "" });
  const [creating, setCreating] = useState(false);

  const fetchZoos = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(GET_ZOOS_URL, {
        headers: { accept: "text/plain" },
      });
      if (!response.ok) throw new Error("Failed to fetch zoos");
      const data = await response.json();
      setZoos(data);
    } catch (err) {
      setError("Error loading zoos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZoos();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateZoo = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const response = await fetch(CREATE_ZOO_URL, {
        method: "POST",
        headers: {
          accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to create zoo");
      await response.json();
      setForm({ nameOfZoo: "", locationOfZoo: "" });
      fetchZoos();
    } catch (err) {
      setError("Error creating zoo.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="main-content">
      <h2>Zoo Page</h2>
      <form className="mb-4" onSubmit={handleCreateZoo}>
        <div className="mb-2">
          <label className="form-label">Name of Zoo</label>
          <input
            type="text"
            name="nameOfZoo"
            className="form-control"
            value={form.nameOfZoo}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Location of Zoo</label>
          <input
            type="text"
            name="locationOfZoo"
            className="form-control"
            value={form.locationOfZoo}
            onChange={handleInputChange}
            required
          />
        </div>
        <button className="btn btn-success" type="submit" disabled={creating}>
          {creating ? "Creating..." : "Create Zoo"}
        </button>
      </form>
      <button className="btn btn-primary mb-3" onClick={fetchZoos} disabled={loading}>
        {loading ? "Loading..." : "Reload Zoos"}
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name of Zoo</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {zoos.map((zoo) => (
            <tr key={zoo.id}>
              <td>{zoo.id}</td>
              <td>{zoo.nameOfZoo}</td>
              <td>{zoo.locationOfZoo}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {zoos.length === 0 && !loading && <div>No zoos found.</div>}
    </div>
  );
}