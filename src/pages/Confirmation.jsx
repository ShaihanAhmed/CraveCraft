import { Link, useParams } from "react-router-dom";

export default function Confirmation() {
  const { orderId } = useParams();
  let order = null;
  try {
    order = JSON.parse(
      sessionStorage.getItem("cravecraft-last-order") || "null",
    );
  } catch {
    order = null;
  }
  if (!order || order.orderId !== orderId)
    return (
      <main className="page-shell">
        <div className="state-panel">
          <h1>Order details are unavailable.</h1>
          <p>This confirmation may belong to an earlier browser session.</p>
          <Link className="button primary" to="/menu">
            Return to menu
          </Link>
        </div>
      </main>
    );
  return (
    <main className="page-shell confirmation-page">
      <div className="confirmation-mark">✓</div>
      <span className="eyebrow">ORDER RECEIVED</span>
      <h1>Your order is confirmed.</h1>
      <p>
        Your demo order summary has been recorded in this browser session. No
        contact or address details were stored.
      </p>
      <section className="confirmation-card">
        <div className="summary-line">
          <span>Reference</span>
          <strong>{order.orderId}</strong>
        </div>
        <div className="summary-line">
          <span>Fulfilment</span>
          <strong>
            {order.fulfilment === "pickup"
              ? "Pickup"
              : `Delivery · ${order.zone}`}
          </strong>
        </div>
        {order.items.map((item) => (
          <div className="summary-line" key={item.id}>
            <span>
              {item.quantity} × {item.name}
            </span>
            <strong>Rs. {(item.quantity * item.price).toLocaleString()}</strong>
          </div>
        ))}
        {order.note && (
          <div className="summary-line">
            <span>Kitchen note</span>
            <strong>{order.note}</strong>
          </div>
        )}
        <div className="summary-line">
          <span>Subtotal</span>
          <strong>Rs. {order.subtotal.toLocaleString()}</strong>
        </div>
        <div className="summary-line">
          <span>Fee</span>
          <strong>Rs. {order.fee.toLocaleString()}</strong>
        </div>
        <div className="summary-line total-line">
          <span>Total</span>
          <strong>Rs. {order.total.toLocaleString()}</strong>
        </div>
      </section>
      <p className="helper-text">
        This is a frontend demonstration. No real restaurant order or payment
        has been submitted.
      </p>
      <Link className="button primary" to="/menu">
        Order something else
      </Link>
    </main>
  );
}
