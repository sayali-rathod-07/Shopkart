import React from "react";

const CATEGORIES = ["All", "Electronics", "Fashion", "Books", "Home"];

function SearchBar({ search, setSearch, category, setCategory }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "2rem",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        placeholder="Search products by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          flex: "1",
          minWidth: "250px",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          outline: "none",
          fontSize: "1rem",
          backgroundColor: "#ffffff",
          color: "#111827",
        }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          backgroundColor: "#ffffff",
          color: "#111827",
          fontSize: "1rem",
          cursor: "pointer",
          outline: "none",
        }}
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SearchBar;
