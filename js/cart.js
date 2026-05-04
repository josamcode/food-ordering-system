/* =========================================================
   Foodie - Cart Module
   Single source of truth for cart state. Persisted to
   localStorage and shared across all pages.
   ========================================================= */

const CART_KEY = "foodie:cart";
const ORDER_KEY = "foodie:lastOrder";
const ORDERS_KEY = "foodie:orders";

/* Read the current cart out of localStorage */
function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Could not read cart from storage", err);
    return [];
  }
}

/* Write the cart and broadcast a "cart:updated" event so
   the navbar count and any listeners on the page refresh. */
function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  document.dispatchEvent(new CustomEvent("cart:updated", { detail: cart }));
}

/* Add product (or +1 quantity if already in cart) */
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      qty: 1
    });
  }

  setCart(cart);
  showToast(`${product.name} added to cart`);
}

/* Set an explicit quantity (>=1). Removes the item if 0. */
function updateQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  if (qty <= 0) {
    removeFromCart(productId);
    return;
  }

  item.qty = qty;
  setCart(cart);
}

function increaseQty(productId) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += 1;
  setCart(cart);
}

function decreaseQty(productId) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  if (item.qty <= 1) {
    removeFromCart(productId);
    return;
  }
  item.qty -= 1;
  setCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  setCart(cart);
}

function clearCart() {
  setCart([]);
}

/* ---------- Calculations ----------
   Single source of truth for order pricing so the cart page,
   checkout, success page and stored orders agree. */
function calculateOrderTotals(cart) {
  const items = Array.isArray(cart) ? cart : getCart();
  const isEmpty = items.length === 0;
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const freeDelivery = !isEmpty && subtotal >= FREE_DELIVERY_THRESHOLD;
  const delivery = isEmpty || freeDelivery ? 0 : STANDARD_DELIVERY_FEE;
  const remainingForFree = isEmpty || freeDelivery
    ? 0
    : Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  return {
    subtotal,
    delivery,
    total: subtotal + delivery,
    freeDelivery,
    remainingForFree,
    isEmpty
  };
}

function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function getSubtotal() {
  return calculateOrderTotals(getCart()).subtotal;
}

function getTotals() {
  return calculateOrderTotals(getCart());
}

/* ---------- Orders history ---------- */
function getOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Could not read orders from storage", err);
    return [];
  }
}

function saveOrder(order) {
  const list = getOrders();
  list.unshift(order); /* newest first */
  localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
  /* Keep ORDER_KEY in sync so the success page still works */
  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

function clearOrders() {
  localStorage.removeItem(ORDERS_KEY);
  localStorage.removeItem(ORDER_KEY);
}

/* ---------- Formatters ---------- */
function formatPrice(value) {
  return `${CURRENCY} ${Number(value).toFixed(2)}`;
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  } catch { return iso; }
}

/* ---------- Navbar count syncing ---------- */
function updateCartCountUI() {
  const count = getCartCount();
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = String(count);
    el.style.display = count > 0 ? "" : "none";
  });
}

/* ---------- Toast helper ---------- */
function showToast(message) {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span class="icon" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    </span>
    <span>${message}</span>
  `;
  wrap.appendChild(toast);

  setTimeout(() => toast.remove(), 2900);
}

/* ---------- Cross-page sync ---------- */
/* When localStorage changes in another tab, refresh count */
window.addEventListener("storage", e => {
  if (e.key === CART_KEY) updateCartCountUI();
});

/* Refresh count after every internal cart change */
document.addEventListener("cart:updated", updateCartCountUI);

/* Initial paint */
document.addEventListener("DOMContentLoaded", updateCartCountUI);
