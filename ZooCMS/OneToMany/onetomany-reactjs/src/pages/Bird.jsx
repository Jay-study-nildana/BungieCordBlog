import React, { useEffect, useState } from "react";

const GET_BIRDS_URL = "https://localhost:7226/api/Practice/GetBirds";
const CREATE_BIRD_URL = "https://localhost:7226/api/Practice/CreateBird";
const GET_ZOOS_URL = "https://localhost:7226/api/Practice/GetZoos";

export default function Bird() {
  const [birds, setBirds] = useState([]);
  const [zoos, setZoos] = useState([]);
  const [loadingBirds, setLoadingBirds] = useState(false);
  const [loadingZoos, setLoadingZoos] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ birdName: "", zooId: "" });
  const [creating, setCreating] = useState(false);

  const fetchBirds = async () => {
    setLoadingBirds(true);
    setError("");
    try {
      const response = await fetch(GET_BIRDS_URL, {
        headers: { accept: "text/plain" },
      });
      if (!response.ok) throw new Error("Failed to fetch birds");
      const data = await response.json();
      setBirds(data);
    } catch (err) {
      setError("Error loading birds.");
    } finally {
      setLoadingBirds(false);
    }
  };

  const fetchZoos = async () => {
    setLoadingZoos(true);
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
      setLoadingZoos(false);
    }
  };

  useEffect(() => {
    fetchBirds();
    fetchZoos();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateBird = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const response = await fetch(CREATE_BIRD_URL, {
        method: "POST",
        headers: {
          accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          birdName: form.birdName,
          zooId: parseInt(form.zooId, 10),
        }),
      });
      if (!response.ok) throw new Error("Failed to create bird");
      await response.json();
      setForm({ birdName: "", zooId: "" });
      fetchBirds();
    } catch (err) {
      setError("Error creating bird.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="main-content">
      <h2>Bird Page</h2>
      <form className="mb-4" onSubmit={handleCreateBird}>
        <div className="mb-2">
          <label className="form-label">Bird Name</label>
          <input
            type="text"
            name="birdName"
            className="form-control"
            value={form.birdName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Select Zoo</label>
          <select
            name="zooId"
            className="form-select"
            value={form.zooId}
            onChange={handleInputChange}
            required
            disabled={loadingZoos}
          >
            <option value="">-- Select Zoo --</option>
            {zoos.map((zoo) => (
              <option key={zoo.id} value={zoo.id}>
                {zoo.nameOfZoo} ({zoo.locationOfZoo})
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-success" type="submit" disabled={creating || loadingZoos}>
          {creating ? "Creating..." : "Create Bird"}
        </button>
      </form>
      <button className="btn btn-primary mb-3" onClick={fetchBirds} disabled={loadingBirds}>
        {loadingBirds ? "Loading..." : "Reload Birds"}
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Bird Name</th>
            <th>Zoo ID</th>
          </tr>
        </thead>
        <tbody>
          {birds.map((bird) => (
            <tr key={bird.id}>
              <td>{bird.id}</td>
              <td>{bird.birdName}</td>
              <td>{bird.zooId}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {birds.length === 0 && !loadingBirds && <div>No birds found.</div>}
    </div>
  );
}