import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useOrder } from "../context/OrderContext.jsx";
import { validateQuantity } from "../rules/businessRules.js";

export default function ItemDetails({ menu, loading, error, onRetry }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = menu.find((entry) => entry.id === id);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const { addItem } = useOrder();

  if (loading)
    return (
      <main className="page-shell">
        <div className="state-panel" role="status">
          Loading dish details…
        </div>
      </main>
    );
  if (error)
    return (
      <main className="page-shell">
        <div className="state-panel error-panel" role="alert">
          <h1>We couldn't load this dish.</h1>
          <p>{error}</p>
          <button className="button primary" onClick={onRetry}>
            Try again
          </button>
        </div>
      </main>
    );
  if (!item)
    return (
      <main className="page-shell">
        <div className="state-panel">
          <h1>We couldn't find that dish.</h1>
          <p>The link may be incorrect or the item may have been removed.</p>
          <Link className="button primary" to="/menu">
            Return to menu
          </Link>
        </div>
      </main>
    );

  const add = () => {
    const check = validateQuantity(item, quantity);
    if (!check.valid) {
      setMessage(check.message);
      return;
    }
    if (addItem(item, quantity)) navigate("/cart");
  };

  return (
    <main className="page-shell">
      <Link to="/menu" className="back-link">
        ← Back to menu
      </Link>
      <div className="detail-layout">
        <img
          className="detail-image"
          src={item.image}
          alt={item.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23e9e8df'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%2368736a' font-size='28'%3EFood image unavailable%3C/text%3E%3C/svg%3E";
          }}
        />
        <section className="detail-copy">
          <span className="eyebrow">
            {item.category} · {item.prepTime}
          </span>
          <h1>{item.name}</h1>
          <p>{item.description}</p>
          <div className="detail-price">Rs. {item.price.toLocaleString()}</div>
          <ul className="detail-facts">
            <li>{item.vegetarian ? "Vegetarian option" : "Contains meat"}</li>
            <li>
              {item.available
                ? `${item.stock} currently available`
                : "Currently unavailable"}
            </li>
            <li>Prepared fresh after ordering</li>
          </ul>
          <label className="quantity-control">
            Quantity{" "}
            <input
              type="number"
              min="1"
              max={item.stock}
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </label>
          {message && (
            <p className="field-error" role="alert">
              {message}
            </p>
          )}
          <button
            className="button primary full-button"
            disabled={!item.available || item.stock < 1}
            onClick={add}
          >
            Add to cart
          </button>
          <small className="helper-text">
            You can change quantities or remove items in your cart.
          </small>
        </section>
      </div>
    </main>
  );
}
