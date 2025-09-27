import React, { useEffect, useState } from "react";

export default function WriterPanelStock() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stock, setStock] = useState(null);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockError, setStockError] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [updateFields, setUpdateFields] = useState({
    unitPrice: "",
    quantity: "",
    sku: "",
    description: "",
    currency: "",
    isActive: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found.");
      setLoading(false);
      return;
    }

    fetch("https://localhost:7226/api/SuperHeroes/user-superheroes", {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch superheroes");
        return res.json();
      })
      .then((data) => {
        setHeroes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleStockDetails = (superHeroId) => {
    setStock(null);
    setStockError("");
    setStockLoading(true);
    setShowUpdateForm(false);
    setUpdateSuccess("");
    setUpdateError("");
    const token = localStorage.getItem("authToken");
    fetch(
      `https://localhost:7226/api/ProductStock/by-superhero/${superHeroId}`,
      {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stock details");
        return res.json();
      })
      .then((data) => {
        setStock(data);
        setStockLoading(false);
      })
      .catch((err) => {
        setStockError(err.message);
        setStockLoading(false);
      });
  };

  const handleUpdateClick = () => {
    if (!stock) return;
    setShowUpdateForm(true);
    setUpdateFields({
      unitPrice: stock.unitPrice,
      quantity: stock.quantity,
      sku: stock.sku,
      description: stock.description,
      currency: stock.currency,
      isActive: stock.isActive,
    });
    setUpdateSuccess("");
    setUpdateError("");
  };

  const handleUpdateFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError("");
    setUpdateSuccess("");
    const token = localStorage.getItem("authToken");
    fetch(
      `https://localhost:7226/api/ProductStock/${stock.id}`,
      {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          unitPrice: Number(updateFields.unitPrice),
          quantity: Number(updateFields.quantity),
          sku: updateFields.sku,
          description: updateFields.description,
          currency: updateFields.currency,
          isActive: updateFields.isActive,
        }),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update SKU");
        return res.json();
      })
      .then((data) => {
        setStock(data);
        setUpdateSuccess("SKU updated successfully.");
        setUpdateLoading(false);
        setShowUpdateForm(false);
      })
      .catch((err) => {
        setUpdateError(err.message);
        setUpdateLoading(false);
      });
  };

  return (
    <div className="container mt-5">
      <h2>Writer Panel Stock</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Alias</th>
                <th>Origin</th>
                <th>First Appearance</th>
                <th>Active</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {heroes.map((hero) => (
                <tr key={hero.id}>
                  <td>{hero.name}</td>
                  <td>{hero.alias}</td>
                  <td>{hero.origin}</td>
                  <td>{hero.firstAppearance?.slice(0, 10)}</td>
                  <td>{hero.isActive ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleStockDetails(hero.id)}
                    >
                      Stock Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stockLoading && <p>Loading stock details...</p>}
          {stockError && <p className="text-danger">{stockError}</p>}
          {stock && (
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">Stock Details</h5>
                <p>
                  <strong>Description:</strong> {stock.description}
                </p>
                <p>
                  <strong>SKU:</strong> {stock.sku}
                </p>
                <p>
                  <strong>Unit Price:</strong> {stock.unitPrice}
                </p>
                <p>
                  <strong>Quantity:</strong> {stock.quantity}
                </p>
                <p>
                  <strong>Currency:</strong> {stock.currency}
                </p>
                <p>
                  <strong>Active:</strong> {stock.isActive ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {stock.lastUpdated?.slice(0, 10)}
                </p>
                <button
                  className="btn btn-warning btn-sm mt-2"
                  onClick={handleUpdateClick}
                >
                  Update SKU
                </button>
                {updateSuccess && (
                  <p className="text-success mt-2">{updateSuccess}</p>
                )}
                {updateError && (
                  <p className="text-danger mt-2">{updateError}</p>
                )}
              </div>
            </div>
          )}
          {showUpdateForm && (
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">Update SKU</h5>
                <form onSubmit={handleUpdateSubmit}>
                  <div className="mb-2">
                    <label className="form-label">SKU</label>
                    <input
                      type="text"
                      className="form-control"
                      name="sku"
                      value={updateFields.sku}
                      onChange={handleUpdateFieldChange}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Unit Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="unitPrice"
                      value={updateFields.unitPrice}
                      onChange={handleUpdateFieldChange}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      name="quantity"
                      value={updateFields.quantity}
                      onChange={handleUpdateFieldChange}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      name="description"
                      value={updateFields.description}
                      onChange={handleUpdateFieldChange}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Currency</label>
                    <input
                      type="text"
                      className="form-control"
                      name="currency"
                      value={updateFields.currency}
                      onChange={handleUpdateFieldChange}
                    />
                  </div>
                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="isActive"
                      checked={updateFields.isActive}
                      onChange={handleUpdateFieldChange}
                    />
                    <label className="form-check-label">Active</label>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success btn-sm"
                    disabled={updateLoading}
                  >
                    {updateLoading ? "Updating..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm ms-2"
                    onClick={() => setShowUpdateForm(false)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}