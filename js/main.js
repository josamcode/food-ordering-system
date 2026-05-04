/* =========================================================
   Foodie - Main UI module
   Handles: menu rendering, search, category filter,
            mobile nav toggle, cart page rendering.
   ========================================================= */

/* ---------- State (only used by menu page) ---------- */
const menuState = {
  activeCategory: "All",
  query: ""
};

/* ---------- Shared UI helpers ---------- */
/* Small banner shown in summaries: either confirms free
   delivery, or nudges the user with how much more to add. */
function freeDeliveryBanner(totals) {
  if (totals.isEmpty) return "";
  if (totals.freeDelivery) {
    return `
      <div class="delivery-banner delivery-banner--earned">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        You unlocked free delivery.
      </div>`;
  }
  const pct = Math.min(100, (totals.subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  return `
    <div class="delivery-banner">
      <span>Add <strong>${formatPrice(totals.remainingForFree)}</strong> more for free delivery.</span>
      <div class="delivery-banner__bar"><span style="width:${pct.toFixed(1)}%"></span></div>
    </div>`;
}

/* ---------- SVG icons (no emojis) ---------- */
const ICONS = {
  star: `<svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.65" y2="16.65"/></svg>`
};

/* ---------- Mobile nav toggle ---------- */
function initNavToggle() {
  const nav = document.querySelector("[data-navbar]");
  const toggle = document.querySelector("[data-nav-toggle]");
  if (!nav || !toggle) return;
  toggle.addEventListener("click", () => nav.classList.toggle("is-open"));
}

/* ---------- Category chips ---------- */
function renderCategories() {
  const list = document.querySelector("[data-categories]");
  if (!list) return;

  list.innerHTML = CATEGORIES.map(cat => `
    <button class="chip ${cat === menuState.activeCategory ? "is-active" : ""}"
            data-category="${cat}" type="button">
      ${cat}
    </button>
  `).join("");

  list.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      menuState.activeCategory = btn.dataset.category;
      renderCategories();
      renderMenu();
    });
  });
}

/* ---------- Search ---------- */
function initSearch() {
  const input = document.querySelector("[data-search]");
  if (!input) return;
  input.addEventListener("input", e => {
    menuState.query = e.target.value.trim().toLowerCase();
    renderMenu();
  });
}

/* ---------- Menu grid ---------- */
function getFilteredProducts() {
  return PRODUCTS.filter(p => {
    const matchesCat =
      menuState.activeCategory === "All" || p.category === menuState.activeCategory;
    const matchesSearch =
      !menuState.query || p.name.toLowerCase().includes(menuState.query);
    return matchesCat && matchesSearch;
  });
}

function productCard(p, index) {
  const badge = p.badge
    ? `<span class="product__badge">${p.badge}</span>`
    : "";
  const rating = p.rating
    ? `<span class="product__rating">${ICONS.star} ${p.rating.toFixed(1)}</span>`
    : "";
  const href = `product.html?id=${p.id}`;

  return `
    <article class="product reveal" style="animation-delay:${Math.min(index * 60, 480)}ms">
      <a class="product__media" href="${href}" aria-label="View ${p.name}">
        <img src="${p.image}" alt="${p.name}" loading="lazy"
             onerror="this.style.background='linear-gradient(135deg,#e9614a,#c8462f)';this.removeAttribute('src');">
        ${badge}
        ${rating}
      </a>
      <div class="product__body">
        <span class="product__category">${p.category}</span>
        <a href="${href}" class="product__name-link">
          <h3 class="product__name">${p.name}</h3>
        </a>
        <p class="product__desc">${p.description}</p>
        <div class="product__footer">
          <span class="product__price">${p.price}<small> ${CURRENCY}</small></span>
          <button class="product__add" data-add-to-cart="${p.id}" type="button" aria-label="Add ${p.name} to cart">
            ${ICONS.plus} Add
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderMenu() {
  const grid = document.querySelector("[data-menu-grid]");
  if (!grid) return;

  const items = getFilteredProducts();

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="menu__empty">
        <h3>No dishes match your search</h3>
        <p>Try a different keyword or pick another category.</p>
      </div>`;
    return;
  }

  grid.innerHTML = items.map(productCard).join("");

  /* Attach add-to-cart handlers */
  grid.querySelectorAll("[data-add-to-cart]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.addToCart);
      addToCart(id);
      // Visual confirmation on the button
      btn.classList.add("is-added");
      btn.innerHTML = `${ICONS.plus} Added`;
      setTimeout(() => {
        btn.classList.remove("is-added");
        btn.innerHTML = `${ICONS.plus} Add`;
      }, 900);
    });
  });
}

/* ---------- Cart page ---------- */
function renderCartPage() {
  const root = document.querySelector("[data-cart-root]");
  if (!root) return;

  const cart = getCart();

  if (cart.length === 0) {
    root.innerHTML = `
      <div class="empty">
        <div class="empty__icon" aria-hidden="true">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
        </div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet. Browse the menu to find something delicious.</p>
        <a href="index.html#menu" class="btn btn--primary btn--lg">Browse the menu</a>
      </div>`;
    return;
  }

  const totals = getTotals();
  root.innerHTML = `
    <div class="cart-grid">
      <div class="cart-card">
        <div class="cart-card__head">
          <h2>Your items <span class="muted" style="font-family:var(--f-body);font-size:0.95rem;font-weight:500;">(${getCartCount()})</span></h2>
          <button class="cart-clear" data-clear-cart type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            Clear cart
          </button>
        </div>
        <div class="cart-list">
          ${cart.map(cartRow).join("")}
        </div>
      </div>

      <aside class="summary" aria-label="Order summary">
        <h2>Order summary</h2>
        <div class="summary__row"><span>Subtotal</span><strong>${formatPrice(totals.subtotal)}</strong></div>
        <div class="summary__row">
          <span>Delivery fee</span>
          ${totals.freeDelivery
            ? `<strong class="free-pill">Free delivery</strong>`
            : `<strong>${formatPrice(totals.delivery)}</strong>`}
        </div>
        ${freeDeliveryBanner(totals)}
        <div class="summary__row summary__row--total"><span>Total</span><strong>${formatPrice(totals.total)}</strong></div>
        <div class="summary__cta">
          <a href="checkout.html" class="btn btn--primary btn--block btn--lg">Proceed to checkout</a>
          <a href="index.html#menu" class="btn btn--secondary btn--block">Continue shopping</a>
        </div>
        <p class="summary__note">Free delivery on orders ${formatPrice(FREE_DELIVERY_THRESHOLD)}+. Restaurants near you: 12 min avg.</p>
      </aside>
    </div>
  `;

  attachCartHandlers(root);
}

function cartRow(item) {
  return `
    <div class="cart-item" data-cart-row="${item.id}">
      <div class="cart-item__img">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="cart-item__info">
        <h3>${item.name}</h3>
        <span>${item.category} · ${formatPrice(item.price)} each</span>
        <div class="cart-item__controls">
          <div class="qty" role="group" aria-label="Quantity for ${item.name}">
            <button data-dec="${item.id}" type="button" aria-label="Decrease quantity">−</button>
            <span aria-live="polite">${item.qty}</span>
            <button data-inc="${item.id}" type="button" aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-item__remove" data-remove="${item.id}" type="button">Remove</button>
        </div>
      </div>
      <div class="cart-item__price">
        <strong>${formatPrice(item.price * item.qty)}</strong>
      </div>
    </div>
  `;
}

function attachCartHandlers(root) {
  root.querySelectorAll("[data-inc]").forEach(b =>
    b.addEventListener("click", () => increaseQty(Number(b.dataset.inc)))
  );
  root.querySelectorAll("[data-dec]").forEach(b =>
    b.addEventListener("click", () => decreaseQty(Number(b.dataset.dec)))
  );
  root.querySelectorAll("[data-remove]").forEach(b =>
    b.addEventListener("click", () => removeFromCart(Number(b.dataset.remove)))
  );
  const clearBtn = root.querySelector("[data-clear-cart]");
  if (clearBtn) clearBtn.addEventListener("click", () => clearCart());
}

/* Re-render the cart page whenever the cart changes */
document.addEventListener("cart:updated", () => {
  if (document.querySelector("[data-cart-root]")) renderCartPage();
});

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  renderCategories();
  initSearch();
  renderMenu();
  renderCartPage();
});
