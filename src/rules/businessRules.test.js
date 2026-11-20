import test from "node:test";
import assert from "node:assert/strict";
import { validateQuantity } from "./businessRules.js";

const burger = { available: true, stock: 5 };

test("quantity below stock limit is valid", () => {
  assert.equal(validateQuantity(burger, 2).valid, true);
});

test("quantity exactly at stock limit is valid", () => {
  assert.equal(validateQuantity(burger, 5).valid, true);
});

test("quantity above stock limit is rejected", () => {
  const result = validateQuantity(burger, 6);
  assert.equal(result.valid, false);
  assert.match(result.message, /Only 5 units are available/);
});

import {
  calculateOrder,
  FREE_DELIVERY_AT,
  MINIMUM_ORDER,
} from "./businessRules.js";

test("delivery fee is included in a below-minimum estimate but completion is blocked", () => {
  const result = calculateOrder(MINIMUM_ORDER - 1, "delivery", "F-6");
  assert.equal(result.valid, false);
  assert.equal(result.fee, 150);
  assert.equal(result.total, MINIMUM_ORDER - 1 + 150);
});

test("delivery is free exactly at the free-delivery threshold", () => {
  const result = calculateOrder(FREE_DELIVERY_AT, "delivery", "F-6");
  assert.equal(result.valid, true);
  assert.equal(result.fee, 0);
  assert.equal(result.total, FREE_DELIVERY_AT);
});
