import { useMemo, useState } from "react";
import ItemCard from "../components/ItemCard.jsx";
import { useOrder } from "../context/OrderContext.jsx";

export default function Menu({ menu, loading, error, onRetry }) {
  const [search, setSearch] = useState(
    () => sessionStorage.getItem("cc-menu-search") || "",
  );
  const [category, setCategory] = useState(
    () => sessionStorage.getItem("cc-menu-category") || "All",
  );
  const [sort, setSort] = useState(
    () => sessionStorage.getItem("cc-menu-sort") || "featured",
  );
  const updateSearch = (value) => {
    setSearch(value);
    sessionStorage.setItem("cc-menu-search", value);
  };
  const updateCategory = (value) => {
    setCategory(value);
    sessionStorage.setItem("cc-menu-category", value);
  };
  const updateSort = (value) => {
    setSort(value);
    sessionStorage.setItem("cc-menu-sort", value);
  };
  const { notice, setNotice, addItem } = useOrder();
  const categories = ["All", ...new Set(menu.map((item) => item.category))];

  const results = useMemo(() => {
    let filtered = menu.filter((item) => {
      const text =
        `${item.name} ${item.description} ${item.category}`.toLowerCase();
      return (
        text.includes(search.toLowerCase()) &&
        (category === "All" || item.category === category)
      );
    });
    if (sort === "low")
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "high")
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "name")
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [menu, search, category, sort]);

  return (
    <main className="page-shell">
      <div className="page-heading">
        <span className="eyebrow">THE CRAVECRAFT MENU</span>
        <h1>
          Find something <em>delicious.</em>
        </h1>
        <p>
          Explore all dishes without entering your address or creating an
          account.
        </p>
      </div>
      <section className="menu-tools" aria-label="Menu search and filters">
        <label className="search-field">
          {" "}
          <span>Search menu</span>
          <input
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="Try burger, pasta, pizza..."
          />
        </label>
        <label>
          <span>Category</span>
          <select
            value={category}
            onChange={(e) => updateCategory(e.target.value)}
          >
            {categories.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Sort by</span>
          <select value={sort} onChange={(e) => updateSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </label>
      </section>
      {notice && (
        <p className="notice" role="status">
          {notice}
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </p>
      )}
      {loading && (
        <div className="state-panel" role="status">
          <div className="spinner" />
          Loading our menu…
        </div>
      )}
      {error && (
        <div className="state-panel error-panel" role="alert">
          <h2>We couldn't load the menu</h2>
          <p>{error}</p>
          <button className="button primary" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}
      {!loading && !error && menu.length === 0 && (
        <div className="state-panel">
          <h2>Menu is temporarily empty</h2>
          <p>
            There are no dishes available right now. Please check again shortly.
          </p>
        </div>
      )}
      {!loading && !error && menu.length > 0 && results.length === 0 && (
        <div className="state-panel">
          <h2>No dishes match those choices</h2>
          <p>Try a different search or choose another category.</p>
          <button
            className="button secondary"
            onClick={() => {
              updateSearch("");
              updateCategory("All");
              updateSort("featured");
            }}
          >
            Clear search and filters
          </button>
        </div>
      )}
      {!loading && !error && results.length > 0 && (
        <>
          <div className="results-line">{results.length} dishes to explore</div>
          <div className="food-grid">
            {results.map((item) => (
              <ItemCard key={item.id} item={item} onAdd={addItem} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
