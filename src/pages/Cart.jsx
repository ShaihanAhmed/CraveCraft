import { useState } from "react";
import { Link } from "react-router-dom";
import { useOrder } from "../context/OrderContext.jsx";
import {
  DELIVERY_ZONES,
  MINIMUM_ORDER,
  FREE_DELIVERY_AT,
  calculateOrder,
  validateQuantity,
} from "../rules/businessRules.js";
import { cleanPlainText, containsSuspiciousMarkup } from "../utils/security.js";

export default function Cart({ menu, loading, error, onRetry }) {
  const {
    cart,
    zone,
    setZone,
    updateQuantity,
    removeItem,
    subtotal,
    notice,
    setNotice,
  } = useOrder();
  const [note, setNote] = useState(
    () => sessionStorage.getItem("cravecraft-order-note") || "",
  );
  const [securityMessage, setSecurityMessage] = useState("");
  const [quantityDrafts, setQuantityDrafts] = useState({});
  const order = calculateOrder(subtotal, "delivery", zone);

  const checkNote = (value) => {
    if (containsSuspiciousMarkup(value)) {
      setSecurityMessage(
        "Markup-like input was detected. Please enter a plain-text note.",
      );
      setNote(cleanPlainText(value, 120));
      sessionStorage.setItem(
        "cravecraft-order-note",
        cleanPlainText(value, 120),
      );
      return;
    }
    setSecurityMessage("");
    setNote(cleanPlainText(value, 120));
    sessionStorage.setItem("cravecraft-order-note", cleanPlainText(value, 120));
  };

  if (loading)
    return (
      <main className="page-shell">
        <div className="state-panel" role="status">
          Checking your saved selection…
        </div>
      </main>
    );
  if (error)
    return (
      <main className="page-shell">
        <div className="state-panel error-panel" role="alert">
          <h1>We couldn't verify your cart.</h1>
          <p>{error}</p>
          <button className="button primary" onClick={onRetry}>
            Try again
          </button>
        </div>
      </main>
    );
  return (
    <main className="page-shell">
      <div className="page-heading compact-heading">
        <span className="eyebrow">YOUR SELECTION</span>
        <h1>
          Your <em>cart.</em>
        </h1>
        <p>
          Change your order or delivery area whenever you need to. Your selected
          dishes stay in your cart.
        </p>
      </div>
      {notice && (
        <p className="notice" role="status">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss message">
            ×
          </button>
        </p>
      )}
      {cart.length === 0 ? (
        <div className="state-panel">
          <h2>Your cart is waiting for something delicious.</h2>
          <p>Browse the menu and add a dish to get started.</p>
          <Link className="button primary" to="/menu">
            Explore menu
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-layout">
            <section className="cart-items">
              {cart.map((entry) => {
                const item = menu.find((product) => product.id === entry.id);
                if (!item)
                  return (
                    <div className="cart-row" key={entry.id}>
                      <div>
                        <strong>Item no longer in menu</strong>
                        <p>Please remove this saved item to continue.</p>
                      </div>
                      <button
                        className="remove-button"
                        onClick={() => removeItem(entry.id)}
                      >
                        Remove
                      </button>
                    </div>
                  );
                return (
                  <article className="cart-row" key={entry.id}>
                    <img
                      src={item.image}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='120'%3E%3Crect width='100%25' height='100%25' fill='%23e9e8df'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%2368736a' font-size='14'%3EFood image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="cart-item-info">
                      <h2>{item.name}</h2>
                      <p>Rs. {item.price.toLocaleString()} each</p>
                      {entry.conflict && (
                        <p className="field-error" role="alert">
                          {entry.conflict}
                        </p>
                      )}
                      <div className="quantity-inline">
                        <label htmlFor={`qty-${item.id}`}>Qty</label>
                        <input
                          id={`qty-${item.id}`}
                          type="number"
                          min="1"
                          max={item.stock}
                          value={
                            quantityDrafts[item.id] ?? String(entry.quantity)
                          }
                          onChange={(e) =>
                            setQuantityDrafts((current) => ({
                              ...current,
                              [item.id]: e.target.value,
                            }))
                          }
                          onBlur={() => {
                            const draft = quantityDrafts[item.id];
                            if (draft === undefined) return;
                            if (draft.trim() === "") {
                              setQuantityDrafts((current) => ({
                                ...current,
                                [item.id]: String(entry.quantity),
                              }));
                              return;
                            }
                            const nextQuantity = Number(draft);
                            const check = validateQuantity(item, nextQuantity);
                            if (check.valid) {
                              updateQuantity(item, nextQuantity);
                              setQuantityDrafts((current) => {
                                const next = { ...current };
                                delete next[item.id];
                                return next;
                              });
                            } else {
                              updateQuantity(item, nextQuantity);
                              setQuantityDrafts((current) => ({
                                ...current,
                                [item.id]: String(entry.quantity),
                              }));
                            }
                          }}
                        />
                        <button
                          className="remove-button"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <strong className="line-total">
                      Rs. {(item.price * entry.quantity).toLocaleString()}
                    </strong>
                  </article>
                );
              })}
              <div className="cart-note">
                <label htmlFor="order-note">Order note (optional)</label>
                <input
                  id="order-note"
                  value={note}
                  maxLength="120"
                  onChange={(e) => checkNote(e.target.value)}
                  placeholder="Any simple note for the kitchen?"
                />
                <small>Plain text only, up to 120 characters.</small>
                {securityMessage && (
                  <span className="field-error" role="alert">
                    {securityMessage}
                  </span>
                )}
              </div>
            </section>
            <aside className="summary-card">
              <h2>Order summary</h2>
              <label className="zone-field">
                Delivery area{" "}
                <select
                  value={zone}
                  onChange={(e) => {
                    setZone(e.target.value);
                    setNotice(
                      "Delivery area updated. Your cart has been preserved.",
                    );
                  }}
                >
                  {DELIVERY_ZONES.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                  <option value="Other">Other area</option>
                </select>
              </label>
              <p className="helper-text">
                Use fictional contact details at checkout. Changing this area
                never clears your cart. We will check delivery availability at
                checkout.
              </p>
              <div className="summary-line">
                <span>Subtotal</span>
                <strong>Rs. {subtotal.toLocaleString()}</strong>
              </div>
              <div className="summary-line">
                <span>Delivery fee</span>
                <strong>
                  {order.message === "Delivery is not available in this area."
                    ? "Unavailable"
                    : order.fee
                      ? `Rs. ${order.fee}`
                      : "Free"}
                </strong>
              </div>
              <div className="summary-line total-line">
                <span>Estimated total</span>
                <strong>Rs. {order.total.toLocaleString()}</strong>
              </div>
              {subtotal < MINIMUM_ORDER && (
                <p className="field-error">
                  Minimum order is Rs. {MINIMUM_ORDER.toLocaleString()}. Add Rs.{" "}
                  {(MINIMUM_ORDER - subtotal).toLocaleString()} more.
                </p>
              )}
              <p className="helper-text">
                Free delivery from Rs. {FREE_DELIVERY_AT.toLocaleString()}.
              </p>
              <Link className="button primary full-button" to="/checkout">
                Continue to checkout
              </Link>
              <Link className="continue-link" to="/menu">
                ← Continue browsing
              </Link>
            </aside>
          </div>
          <p className="security-note">
            <strong>Security demo:</strong> customer notes are treated as plain
            text, length-limited and never inserted as HTML. This is a frontend
            demonstration, not complete application security.
          </p>
        </>
      )}
    </main>
  );
}
