# Foodie — Frontend Food Ordering System

A polished, frontend-only food ordering site built with **HTML, CSS and vanilla JavaScript**. No frameworks, no backend, no build tools — just open `index.html` in a browser and go.

---

## Features

- **Dynamic menu** rendered from a JS catalogue
- **Search** by dish name + **category filters** (Burgers / Pizza / Pasta / Drinks / Desserts)
- **Cart** with add, increase, decrease, remove and clear actions
- **Cart persistence** via `localStorage` (survives refresh and tabs)
- **Product details page** (`product.html?id=...`) with quantity selector and **related products**
- **Checkout** with inline form validation (name, phone, address)
- **Free delivery rule** — orders **≥ 250 EGP** ship free; below that, a flat **20 EGP** fee with a "add X EGP more for free delivery" nudge
- **Order history** (`orders.html`) showing every previous order with expandable details, stored in `localStorage`
- **Success page** with order recap (ID, customer, items, payment, delivery state, total)
- **Responsive** layout for desktop, tablet and mobile
- **Accessible** — semantic HTML, labeled form fields, keyboard-friendly controls, no emojis

---

## Project structure

```
foodie/
├── index.html         home (hero, menu, offers, features, CTA, footer)
├── product.html       product details page (reads ?id= from the URL)
├── cart.html          cart with quantity controls and live summary
├── checkout.html      delivery form + order summary
├── success.html       order confirmation
├── orders.html        order history
│
├── css/
│   └── style.css      all styles, design tokens and responsive rules
│
└── js/
    ├── products.js    product catalogue + pricing constants
    ├── cart.js        cart state, totals, orders helpers, toast (loaded everywhere)
    ├── main.js        menu/search/filter, cart-page rendering, mobile nav
    ├── checkout.js    checkout form validation and order persistence
    ├── product.js     product details page logic
    └── orders.js      order history rendering
```

---

## How to run locally

Just open [`index.html`](index.html) in any modern browser.

For best results (so `localStorage` and Unsplash image URLs behave consistently across pages), serve the folder over HTTP:

```bash
# from the foodie/ folder
python -m http.server 8000
# then visit http://localhost:8000
```

No install step. No dependencies.

---

## How the data flows

### Pricing

All pricing is calculated through a single helper in [`js/cart.js`](js/cart.js):

```js
calculateOrderTotals(cart);
// → { subtotal, delivery, total, freeDelivery, remainingForFree, isEmpty }
```

It uses two constants from `js/products.js`:

- `STANDARD_DELIVERY_FEE` — `20` EGP
- `FREE_DELIVERY_THRESHOLD` — `250` EGP

The cart page, checkout page, success page and the stored order record all use the same helper so they can never disagree.

### Storage keys

| Key                | Shape                 | Purpose                                    |
| ------------------ | --------------------- | ------------------------------------------ |
| `foodie:cart`      | `Array<{id,qty,...}>` | Current cart, refreshed on every change    |
| `foodie:orders`    | `Array<Order>`        | Full order history, newest first           |
| `foodie:lastOrder` | `Order`               | Most recent order (used by `success.html`) |

When checkout succeeds, the new order is pushed to `foodie:orders` and mirrored into `foodie:lastOrder`, the cart is cleared, then the user is redirected to `success.html`.

### Order shape

```js
{
  id: "FD-XXXX",
  placedAt: "ISO date",
  customer: { name, phone, address, notes },
  payment: "Cash on Delivery" | "Card",
  items: [{ id, name, price, image, category, qty }, ...],
  subtotal,
  delivery,
  freeDelivery: boolean,
  total
}
```

---

## What's new in v2

- **Product details page** — clicking any product card image or name opens `product.html?id=<id>`. Quantity selector adds N copies in one click. Related products from the same category appear below.
- **Orders page** — every confirmed order is now persisted under `foodie:orders` and listed in `orders.html`, with expandable details, totals and delivery address.
- **Free delivery rule, properly applied** — the cart, checkout and stored order all honour the `≥ 250 EGP` threshold. The summary banner shows progress towards free delivery, or confirms it has been earned.
- **Orders link in the navbar** on every page.

---

## Testing checklist

- [ ] Browse menu, search a dish, filter by category — results update live
- [ ] Click a product card → opens `product.html?id=...`
- [ ] On the product page, change qty and click Add → cart count increases by qty
- [ ] Refresh any page → cart persists
- [ ] Add items until subtotal ≥ 250 EGP → cart and checkout show "Free delivery"
- [ ] Subtotal under 250 EGP → 20 EGP delivery + "Add X EGP more for free delivery" message
- [ ] Submit checkout with empty name → inline error
- [ ] Submit checkout with all fields valid → redirects to `success.html`
- [ ] Open `orders.html` → newest order appears at the top, expand to see details
- [ ] Resize browser to mobile width → navbar collapses, cards stack, layout stays clean

---

## Notes

- Images are pulled from Unsplash (stable photo IDs). If a URL fails to load, the card falls back to a warm gradient placeholder.
- The toast confirmation at the bottom right uses CSS animations only.
- All icons are inline SVG — no icon font, no emojis.
