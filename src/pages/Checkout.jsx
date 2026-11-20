import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext.jsx";
import {
  DELIVERY_ZONES,
  MINIMUM_ORDER,
  FREE_DELIVERY_AT,
  calculateOrder,
} from "../rules/businessRules.js";
import { cleanPlainText } from "../utils/security.js";

const initialForm = {
  name: "",
  phone: "",
  address: "",
  fulfilment: "delivery",
  zone: "F-6",
};

export default function Checkout({ menu, loading, error, onRetry }) {
  const navigate = useNavigate();
  const { cart, zone, setZone, subtotal, clearCart, unavailableEntries } =
    useOrder();
  const [form, setForm] = useState({ ...initialForm, zone });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const order = calculateOrder(subtotal, form.fulfilment, form.zone);
  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setSubmitError("");
  };

  if (loading)
    return (
      <main className="page-shell">
        <div className="state-panel" role="status">
          Checking the current menu…
        </div>
      </main>
    );
  if (error)
    return (
      <main className="page-shell">
        <div className="state-panel error-panel" role="alert">
          <h1>We couldn't verify the menu.</h1>
          <p>{error}</p>
          <button className="button primary" onClick={onRetry}>
            Try again
          </button>
        </div>
      </main>
    );
  if (cart.length === 0)
    return (
      <main className="page-shell">
        <div className="state-panel">
          <h1>Your cart is empty.</h1>
          <p>Add at least one dish before checkout.</p>
          <Link className="button primary" to="/menu">
            Browse menu
          </Link>
        </div>
      </main>
    );

  const validate = () => {
    const next = {};
    if (cleanPlainText(form.name, 60).length < 2)
      next.name = "Enter your name (at least 2 characters).";
    const digits = form.phone.replace(/\D/g, "");
    if (
      digits.length < 7 ||
      digits.length > 15 ||
      !/^[0-9+\-\s()]+$/.test(form.phone.trim())
    )
      next.phone = "Enter a phone number containing 7–15 digits.";
    if (
      form.fulfilment === "delivery" &&
      cleanPlainText(form.address, 120).length < 8
    )
      next.address = "Enter a delivery address with at least 8 characters.";
    if (unavailableEntries.length)
      next.order =
        "Your cart contains an unavailable or changed item. Return to the cart and remove or correct it.";
    else if (!order.valid) next.order = order.message;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event) => {
    event.preventDefault();
    if (!validate()) {
      setSubmitError(
        "Please review the highlighted fields. Your valid entries have been kept.",
      );
      return;
    }
    const orderId = `CC-${Date.now().toString().slice(-7)}`;
    const details = {
      orderId,
      // Personal contact/address fields are validated in-memory but deliberately excluded from stored order data.
      fulfilment: form.fulfilment,
      zone: form.zone,
      note: cleanPlainText(
        sessionStorage.getItem("cravecraft-order-note") || "",
        120,
      ),
      items: cart.map((entry) => ({
        ...entry,
        name: menu.find((item) => item.id === entry.id)?.name || "Menu item",
        price: menu.find((item) => item.id === entry.id)?.price || 0,
      })),
      subtotal,
      fee: order.fee,
      total: order.total,
    };
    sessionStorage.setItem("cravecraft-last-order", JSON.stringify(details));
    setZone(form.zone);
    clearCart();
    navigate(`/confirmation/${orderId}`);
  };

  return (
    <main className="page-shell">
      <div className="page-heading compact-heading">
        <span className="eyebrow">ALMOST THERE</span>
        <h1>
          Order <em>details.</em>
        </h1>
        <p>
          No account or payment details are needed. Use fictional details only;
          contact and address fields are not saved with the demo order.
        </p>
      </div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submit} noValidate>
          <h2>Contact details</h2>
          <label>
            Full name
            <input
              id="customer-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <small id="name-error" className="field-error">
                {errors.name}
              </small>
            )}
          </label>
          <label>
            Phone number
            <input
              id="customer-phone"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="03XX XXXXXXX"
              autoComplete="tel"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <small id="phone-error" className="field-error">
                {errors.phone}
              </small>
            )}
          </label>
          <h2>How would you like your order?</h2>
          <div className="radio-row">
            <label>
              <input
                type="radio"
                name="fulfilment"
                checked={form.fulfilment === "delivery"}
                onChange={() => update("fulfilment", "delivery")}
              />{" "}
              Delivery
            </label>
            <label>
              <input
                type="radio"
                name="fulfilment"
                checked={form.fulfilment === "pickup"}
                onChange={() => update("fulfilment", "pickup")}
              />{" "}
              Pickup
            </label>
          </div>
          {form.fulfilment === "delivery" && (
            <>
              <label>
                Delivery area
                <select
                  value={form.zone}
                  onChange={(e) => update("zone", e.target.value)}
                >
                  {DELIVERY_ZONES.map((z) => (
                    <option key={z}>{z}</option>
                  ))}
                  <option value="Other">Other area</option>
                </select>
              </label>
              <label>
                Delivery address
                <textarea
                  id="delivery-address"
                  rows="3"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="House / street / sector"
                  aria-invalid={!!errors.address}
                  aria-describedby={
                    errors.address ? "address-error" : undefined
                  }
                />
                {errors.address && (
                  <small id="address-error" className="field-error">
                    {errors.address}
                  </small>
                )}
              </label>
            </>
          )}
          {errors.order && (
            <p className="field-error" role="alert">
              {errors.order}
            </p>
          )}
          {submitError && (
            <p className="error-banner" role="alert">
              {submitError}
            </p>
          )}
          <button className="button primary full-button" type="submit">
            Place demo order
          </button>
        </form>
        <aside className="summary-card">
          <h2>Review your order</h2>
          {cart.map((entry) => {
            const item = menu.find((p) => p.id === entry.id);
            return item ? (
              <div className="summary-line" key={entry.id}>
                <span>
                  {entry.quantity} × {item.name}
                </span>
                <strong>
                  Rs. {(item.price * entry.quantity).toLocaleString()}
                </strong>
              </div>
            ) : null;
          })}
          <div className="summary-line">
            <span>Subtotal</span>
            <strong>Rs. {subtotal.toLocaleString()}</strong>
          </div>
          <div className="summary-line">
            <span>{form.fulfilment === "pickup" ? "Pickup" : "Delivery"}</span>
            <strong>
              {order.message === "Delivery is not available in this area."
                ? "Unavailable"
                : order.fee
                  ? `Rs. ${order.fee}`
                  : "Free"}
            </strong>
          </div>
          <div className="summary-line total-line">
            <span>Total</span>
            <strong>Rs. {order.total.toLocaleString()}</strong>
          </div>
          <p className="helper-text">
            Minimum order: Rs. {MINIMUM_ORDER.toLocaleString()}. Delivery is
            free on orders of Rs. {FREE_DELIVERY_AT.toLocaleString()} or more.
          </p>
          <Link className="continue-link" to="/cart">
            ← Back to cart
          </Link>
        </aside>
      </div>
    </main>
  );
}
