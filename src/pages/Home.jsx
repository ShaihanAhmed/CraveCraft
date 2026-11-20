import { Link } from "react-router-dom";
import { useOrder } from "../context/OrderContext.jsx";

export default function Home() {
  const { itemCount } = useOrder();
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">GOOD FOOD, NO EXTRA STEPS</span>
          <h1>
            Your cravings.
            <br />
            <em>Handled.</em>
          </h1>
          <p>
            Explore the menu first. Decide what you love. We will ask for
            delivery details only when you are ready to order.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/menu">
              Explore the menu
            </Link>
            <Link className="text-link" to="/cart">
              View cart ({itemCount})
            </Link>
          </div>
          <div className="hero-points">
            <span>✓ No sign-up to browse</span>
            <span>✓ Clear prices</span>
            <span>✓ Easy cart edits</span>
          </div>
        </div>
        <div className="hero-photo">
          <img
            src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200"
            alt="Freshly prepared burger with fries"
          />
        </div>
      </section>
      <section className="intro-strip">
        <div>
          <span className="eyebrow">MADE FOR ISLAMABAD</span>
          <h2>Good food, without the runaround.</h2>
        </div>
        <p>
          Browse freely, build your order at your pace, and change your delivery
          area without losing the food you selected.
        </p>
      </section>
      <section className="home-cta">
        <div>
          <span className="eyebrow">WHAT ARE YOU IN THE MOOD FOR?</span>
          <h2>Find your next favourite.</h2>
        </div>
        <Link className="button dark" to="/menu">
          See all 12 dishes <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
