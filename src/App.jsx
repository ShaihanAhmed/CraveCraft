import { useCallback, useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import ItemDetails from "./pages/ItemDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import { loadMenu } from "./services/menuService.js";
import { OrderProvider } from "./context/OrderContext.jsx";

function NotFound() {
  return <main className="page-shell"><div className="state-panel"><h1>Page not found.</h1><p>That page doesn't exist. Let's get you back to the menu.</p><Link className="button primary" to="/menu">Browse menu</Link></div></main>;
}

export default function App() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [changedAvailability, setChangedAvailability] = useState(false);

  const fetchMenu = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const records = await loadMenu({ shouldFail: simulateFailure, signal });
      if (!signal?.aborted) {
        setMenu(records.map((item) => item.id === "classic-smash"
          ? { ...item, available: !changedAvailability, stock: changedAvailability ? 0 : 5 }
          : item));
      }
    } catch (err) {
      if (err.name !== "AbortError" && !signal?.aborted) setError(err.message || "Something went wrong while loading the menu.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [simulateFailure, changedAvailability]);

  useEffect(() => {
    const controller = new AbortController();
    fetchMenu(controller.signal);
    return () => controller.abort();
  }, [fetchMenu]);

  const retry = () => fetchMenu();
  return <OrderProvider menu={menu}>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu menu={menu} loading={loading} error={error} onRetry={retry} />} />
      <Route path="/items/:id" element={<ItemDetails key={window.location.pathname} menu={menu} loading={loading} error={error} onRetry={retry} />} />
      <Route path="/cart" element={<Cart menu={menu} loading={loading} error={error} onRetry={retry} />} />
      <Route path="/checkout" element={<Checkout menu={menu} loading={loading} error={error} onRetry={retry} />} />
      <Route path="/confirmation/:orderId" element={<Confirmation />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
    <details className="demo-control">
      <summary>Demo controls</summary>
      <label><input type="checkbox" checked={simulateFailure} onChange={(e) => setSimulateFailure(e.target.checked)} /> Simulate loading failure</label>
      <label><input type="checkbox" checked={changedAvailability} onChange={(e) => setChangedAvailability(e.target.checked)} /> Make Classic Smash unavailable</label>
      <button onClick={retry}>Reload menu</button>
      <small>Toggle availability, reload, then inspect a saved cart item.</small>
    </details>
  </OrderProvider>;
}
