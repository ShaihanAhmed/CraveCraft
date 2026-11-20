import { Link, NavLink } from "react-router-dom";
import { useOrder } from "../context/OrderContext.jsx";

export default function Header() {
  const { itemCount } = useOrder();
  return (
    <header className="site-header">
      <Link to="/" className="brand" aria-label="CraveCraft home">
        <span className="brand-mark">C</span>
        <span>
          CraveCraft<small>GOOD FOOD, EASY CHOICES</small>
        </span>
      </Link>
      <nav aria-label="Main navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/cart" className="cart-link">
          Cart <span className="cart-count">{itemCount}</span>
        </NavLink>
      </nav>
    </header>
  );
}
