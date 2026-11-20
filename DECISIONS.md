# Frontend Decisions — CraveCraft

> Evidence note: the reference-site behaviours below reflect the problems the student described during project planning. Before submission, attach screenshots captured personally, add the exact page URLs visited, and confirm that each behaviour is still reproducible. Do not present an unverified screenshot or URL as evidence.

## Decision 1 — Let customers browse before collecting delivery details
- **Problem:** The student reported that Cheezious and Domino's ordering journeys request delivery details before the customer can freely browse. This adds a commitment before product discovery.
- **Reference sites to document:** [Cheezious](https://cheezious.com/) and [Domino's Pakistan](https://www.dominos.com.pk/). Add the exact route/page URL used during your own check.
- **Decision:** Home and menu routes are public browsing routes. Delivery information is requested only in the cart/checkout journey.
- **Alternative:** Ask for a delivery location on the landing page and filter the menu immediately.
- **Reason:** Customers can compare the offering before committing to an order or entering personal details.
- **Tradeoff:** Delivery eligibility is checked later, so a customer may need to change the area or choose pickup at checkout.
- **Code location:** `src/pages/Home.jsx`, `src/pages/Menu.jsx`, `src/pages/Checkout.jsx`.
- **Evidence steps:** Open a fresh browser session → visit Home → open Menu without entering an address. Capture the CraveCraft menu and the relevant reference-site screen.

## Decision 2 — Preserve cart state when delivery area changes
- **Problem:** The student reported that changing delivery location during Tehzeeb's payment journey can empty the cart.
- **Reference site to document:** [Tehzeeb](https://tehzeeb.com/). Add the exact checkout URL and capture the warning shown when changing location.
- **Decision:** Delivery area is separate from cart state. Changing it updates the selected zone and recalculates fulfilment information without clearing cart entries.
- **Alternative:** Empty the cart whenever the delivery area changes.
- **Reason:** The food selection and delivery destination are separate decisions; preserving the selection avoids repeated work.
- **Tradeoff:** A newly selected area may not be serviceable, so eligibility is checked again before completion.
- **Code location:** `src/context/OrderContext.jsx`, `src/pages/Cart.jsx`, `src/pages/Checkout.jsx`.
- **Evidence steps:** Add two dishes → change the delivery area in the cart → verify that both dishes and quantities remain. Capture before/after screenshots.

## Decision 3 — Put decision-making facts in the menu-card hierarchy
- **Problem:** Customers comparing meals need to open multiple details pages if price, preparation time, and current availability are not visible together in the listing. This is an information-hierarchy issue; validate it against the reference pages you personally inspect and record the exact URL/screenshot.
- **Decision:** Each CraveCraft menu card places category and preparation time at the top, dish name and description next, and price, stock status, and add action together at the bottom.
- **Alternative:** Show only the image and name, with all practical information on the details page.
- **Reason:** The customer group is university students in Islamabad who may compare meal options quickly; visible price, preparation time, and stock support that choice without extra navigation.
- **Tradeoff:** Cards contain more information and need careful spacing on narrow screens.
- **Code location:** `src/components/ItemCard.jsx`, `src/styles.css`.
- **Evidence steps:** At 390 px and desktop width, capture menu cards showing price, prep time, availability, and add control. Annotate the hierarchy.

## Manual evidence still required
For each of the three decisions, add: exact URL, personally captured screenshot(s), date checked, steps, actual observed behaviour, expected CraveCraft behaviour, and the observed result after testing. Keep observed facts separate from predicted business consequences.
