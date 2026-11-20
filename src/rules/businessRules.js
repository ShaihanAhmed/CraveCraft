export const DELIVERY_ZONES = ["F-6", "F-7", "F-8", "G-9", "G-10", "I-8"];
export const MINIMUM_ORDER = 1000;
export const DELIVERY_FEE = 150;
export const FREE_DELIVERY_AT = 2500;

// Availability rule: a customer cannot order more than the available stock.
export function validateQuantity(item, quantity) {
  if (!item || !item.available || item.stock < 1) {
    return { valid: false, message: "This item is currently unavailable." };
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { valid: false, message: "Choose a quantity of at least 1." };
  }
  if (quantity > item.stock) {
    return {
      valid: false,
      message: `Only ${item.stock} ${item.stock === 1 ? "unit is" : "units are"} available.`,
    };
  }
  return { valid: true, message: "" };
}

// Eligibility rule: delivery is offered only in the listed Islamabad zones.
export function validateDeliveryZone(zone) {
  return DELIVERY_ZONES.includes(zone);
}

// Pricing / fulfilment rule. Pickup has no delivery fee or delivery-zone requirement.
export function calculateOrder(subtotal, fulfilment, zone) {
  if (fulfilment === "delivery" && !validateDeliveryZone(zone)) {
    return {
      valid: false,
      message: "Delivery is not available in this area.",
      fee: 0,
      total: subtotal,
    };
  }
  const fee =
    fulfilment === "pickup" || subtotal >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE;
  if (subtotal < MINIMUM_ORDER) {
    return {
      valid: false,
      message: `Minimum order is Rs. ${MINIMUM_ORDER.toLocaleString()}. Add Rs. ${(MINIMUM_ORDER - subtotal).toLocaleString()} more.`,
      fee,
      total: subtotal + fee,
    };
  }
  return { valid: true, message: "", fee, total: subtotal + fee };
}
