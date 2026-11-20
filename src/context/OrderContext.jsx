import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { validateQuantity } from "../rules/businessRules.js";

const OrderContext = createContext(null);
const CART_KEY = "cravecraft-cart-v1";
const ZONE_KEY = "cravecraft-zone-v1";

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function OrderProvider({ children, menu }) {
  const [cart, setCart] = useState(readCart);
  const [zone, setZone] = useState(
    () => localStorage.getItem(ZONE_KEY) || "F-6",
  );
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(ZONE_KEY, zone);
  }, [zone]);

  // Reconcile restored cart entries against current menu data.
  useEffect(() => {
    if (!menu.length) return;
    setCart((current) =>
      current
        .map((entry) => {
          const item = menu.find((product) => product.id === entry.id);
          if (!item || !item.available || item.stock < 1)
            return {
              ...entry,
              conflict:
                "This item is currently unavailable. Remove it to continue.",
            };
          if (entry.quantity > item.stock)
            return {
              ...entry,
              quantity: item.stock,
              conflict: `Quantity adjusted to current stock (${item.stock}).`,
            };
          return entry;
        })
        .filter((entry) => entry.quantity > 0),
    );
  }, [menu]);

  const addItem = (item, quantity = 1) => {
    const existing = cart.find((entry) => entry.id === item.id);
    const nextQuantity = (existing?.quantity || 0) + quantity;
    const check = validateQuantity(item, nextQuantity);
    if (!check.valid) {
      setNotice(check.message);
      return false;
    }
    setCart((current) => {
      const found = current.find((entry) => entry.id === item.id);
      if (found)
        return current.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: entry.quantity + quantity, conflict: "" }
            : entry,
        );
      return [...current, { id: item.id, quantity, conflict: "" }];
    });
    setNotice(`${item.name} added to your cart.`);
    return true;
  };

  const updateQuantity = (item, quantity) => {
    const check = validateQuantity(item, quantity);
    if (!check.valid) {
      setNotice(check.message);
      return;
    }
    setCart((current) =>
      current.map((entry) =>
        entry.id === item.id ? { ...entry, quantity, conflict: "" } : entry,
      ),
    );
    setNotice("Cart quantity updated.");
  };

  const removeItem = (id) => {
    setCart((current) => current.filter((entry) => entry.id !== id));
    setNotice("Item removed from your cart.");
  };

  const clearCart = () => setCart([]);
  const value = useMemo(
    () => ({
      cart,
      zone,
      setZone,
      notice,
      setNotice,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount: cart.reduce((sum, entry) => sum + entry.quantity, 0),
      subtotal: cart.reduce((sum, entry) => {
        const item = menu.find((product) => product.id === entry.id);
        return sum + (item ? item.price * entry.quantity : 0);
      }, 0),
      unavailableEntries: cart.filter((entry) => {
        const item = menu.find((product) => product.id === entry.id);
        return (
          !item || !item.available || item.stock < 1 || Boolean(entry.conflict)
        );
      }),
    }),
    [cart, zone, notice, menu],
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder must be used inside OrderProvider");
  return context;
}
