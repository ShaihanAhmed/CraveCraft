# CraveCraft — Restaurant Ordering Website

A React restaurant frontend for CS4032 Assignment 02. CraveCraft is fictional; menu data is local and checkout creates a simulated order only. No payment is processed and no real order is sent.

## Business profile
- **Business:** CraveCraft
- **Offering:** 12 burgers, pizzas, pasta dishes, wraps, sides and desserts
- **Primary audience:** University students in Islamabad
- **Operating area:** Selected Islamabad sectors (F-6, F-7, F-8, G-9, G-10 and I-8)
- **Main customer task:** Browse, search and compare meals, select quantities, choose delivery or pickup, review the total and complete a simulated order
- **Business goal:** Help university students complete a food order with clear prices, availability and fulfilment conditions

## Operating rules
1. **Availability:** Each dish has a stock limit. Quantity must be at least 1 and cannot exceed current stock. Availability and stock are shown on cards/details/cart. Invalid additions or edits are rejected. A restored cart entry that conflicts with current stock is flagged and must be corrected; unavailable items must be removed. Boundary: quantity exactly equal to current stock is accepted.
2. **Delivery eligibility:** Delivery is offered only in F-6, F-7, F-8, G-9, G-10 and I-8. The area is shown in cart and checkout. Unsupported areas block delivery; pickup remains available. Boundary: I-8 is accepted and Other is rejected for delivery.
3. **Pricing/fulfilment:** Minimum subtotal is Rs. 1,000. Delivery costs Rs. 150 below Rs. 2,500; delivery is free at Rs. 2,500 or more; pickup is free. The calculated fee is shown even when the minimum subtotal has not yet been reached. Boundary: exactly Rs. 2,500 receives free delivery.

## Reference-site investigation
The three candidate problems and decisions are documented in `DECISIONS.md`. The student previously described the browse-before-address friction on Cheezious/Domino's and cart loss when changing location on Tehzeeb. The exact URLs, screenshots, date checked, and observed steps must be added by the student after personally reproducing each flow. Decision 3's reference comparison also needs a personally verified screenshot. Do not claim that these evidence items are included when they are not.

## Improvements implemented
- Browse the menu before entering delivery details.
- Preserve the cart when the delivery area changes.
- Show category, preparation time, price, and availability together on menu cards.
- Keep menu search, category and sort settings across navigation in the current tab.
- Provide add-to-cart feedback on the menu.
- Reconcile saved cart entries against current availability and stock; block checkout until conflicts are resolved.
- Keep contact/address values in form state only; use fictional details and exclude them from saved order data.
- Show field-specific validation and preserve other entered values.

## Routes
- `/` — home
- `/menu` — search, category filter and sorting
- `/items/:id` — item details and quantity selection
- `/cart` — shared cart, quantity edits, removal, order note and delivery-area change
- `/checkout` — controlled form, validation and calculated summary
- `/confirmation/:orderId` — final simulated order summary

## Setup
Requires Node.js 18 or later. **Preparation note:** `package-lock.json` could not be generated in this environment because DNS access to `registry.npmjs.org` failed. Run `npm install` locally, include the generated lockfile in the final ZIP, and then run the build.

```bash
npm install
npm run dev
```

## Build and test
```bash
npm run build
node --test
```

## Demo controls and edge cases
Open **Demo controls** at the bottom-right:
- Enable **Simulate loading failure**, then use **Reload menu** or **Try again** to see recovery. Turn it off to restore the menu.
- Enable **Make Classic Smash unavailable**, then reload. If Classic Smash is already in the cart, the cart flags it and checkout is blocked until it is removed. Turn the toggle off and reload; an existing conflict can be cleared by correcting the quantity.
- Search for a term with no results to see the no-match state; the empty dataset state is separate.
- Open `/items/not-a-real-id` to see invalid-ID feedback.
- Add an item, change delivery area in cart, and verify the cart remains intact.
- Try a cart quantity above stock.
- Try checkout with missing/invalid fields, then correct them; valid entries remain.
- Try subtotal below Rs. 1,000, unsupported delivery area, pickup, and the exact Rs. 2,500 free-delivery boundary.
- Refresh after adding items to verify local-storage persistence.

## Personal-data handling
Use fictional details only. Name, phone and delivery address are validated in component state and are not written to local/session storage or the simulated order record. The optional plain-text kitchen note is saved in session storage and included in the simulated order summary; do not enter personal or sensitive information in the note.

## Limitations
- Frontend-only simulation: no backend, authentication, real inventory reservation, payment processing, or real restaurant order submission.
- Availability changes are a local demonstration control, not a live inventory feed.
- Product images are externally hosted Unsplash URLs. A local SVG fallback is shown if an image fails; check image loading and add any required attribution before submission.
- Search/filter preferences are session-scoped.
- Browser-level checks at 390 px and 1280 px, keyboard-only checks, colour-contrast checks, and console inspection still need to be completed manually.
- Public GitHub history and deployment cannot be created from this ZIP alone. Create a real public repository, make incremental commits during your own development, deploy the final commit, and add the genuine links/hash below.

## Main concept map
| Concept | File / component |
|---|---|
| Components and callback props | `src/components/ItemCard.jsx`, `src/pages/Menu.jsx` |
| Routes and URL parameters | `src/App.jsx`, `src/pages/ItemDetails.jsx` |
| Shared state / functional updates | `src/context/OrderContext.jsx` |
| Controlled form and validation | `src/pages/Checkout.jsx` |
| Derived totals / business rules | `src/rules/businessRules.js` |
| Async loading / effect cleanup | `src/services/menuService.js`, `src/App.jsx` |
| Browser storage | `src/context/OrderContext.jsx`, `src/pages/Menu.jsx` |
| Automated rule tests | `src/rules/businessRules.test.js` |
| Security / plain-text handling | `src/utils/security.js`, `src/pages/Cart.jsx` |

