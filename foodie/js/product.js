/* =========================================================
   Foodie - Product details page
   Reads ?id= from the URL, renders the product, handles
   the quantity selector and the related-products grid.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-product-root]");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    root.innerHTML = `
      <div class="empty">
        <div class="empty__icon" aria-hidden="true">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2>Product not found</h2>
        <p>The dish you're looking for isn't on the menu — it may have been removed.</p>
        <a href="index.html#menu" class="btn btn--primary btn--lg">Back to the menu</a>
      </div>`;
    return;
  }

  /* Update <title> for nicer tab/share */
  document.title = `${product.name} — Foodie`;

  let qty = 1;

  const ratingHTML = product.rating
    ? `<span class="product-page__rating">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
         ${product.rating.toFixed(1)}
         <small>· ${(Math.round(product.rating * 50) + 80)} reviews</small>
       </span>`
    : "";

  const badgeHTML = product.badge
    ? `<span class="product-page__badge">${product.badge}</span>`
    : "";

  root.innerHTML = `
    <div class="crumbs">
      <a href="index.html">Home</a>
      <span aria-hidden="true">/</span>
      <a href="index.html#menu">Menu</a>
      <span aria-hidden="true">/</span>
      <span>${product.name}</span>
    </div>

    <div class="product-page">
      <div class="product-page__media">
        <img src="${product.image}" alt="${product.name}">
        ${badgeHTML}
      </div>

      <div class="product-page__info">
        <span class="product-page__category">${product.category}</span>
        <h1 class="product-page__name">${product.name}</h1>
        ${ratingHTML}
        <p class="product-page__desc">${product.description}</p>

        <div class="product-page__price">
          <span class="product-page__price-value">${product.price}<small> ${CURRENCY}</small></span>
          <span class="product-page__price-note">Includes taxes. Delivery 20 ${CURRENCY}, or free over ${FREE_DELIVERY_THRESHOLD} ${CURRENCY}.</span>
        </div>

        <div class="product-page__actions">
          <div class="product-page__qty" role="group" aria-label="Quantity">
            <button type="button" data-qty-dec aria-label="Decrease quantity">−</button>
            <span data-qty-value aria-live="polite">${qty}</span>
            <button type="button" data-qty-inc aria-label="Increase quantity">+</button>
          </div>

          <button class="btn btn--primary btn--lg" data-add-to-cart type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add to cart
          </button>

          <a href="index.html#menu" class="btn btn--secondary btn--lg">Back to menu</a>
        </div>

        <ul class="product-page__features">
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Ready in ~25 min
          </li>
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
            Made fresh today
          </li>
          <li>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            From a local kitchen
          </li>
        </ul>
      </div>
    </div>
  `;

  /* ---------- Quantity controls ---------- */
  const qtyEl = root.querySelector("[data-qty-value]");
  root.querySelector("[data-qty-dec]").addEventListener("click", () => {
    if (qty > 1) { qty -= 1; qtyEl.textContent = qty; }
  });
  root.querySelector("[data-qty-inc]").addEventListener("click", () => {
    if (qty < 20) { qty += 1; qtyEl.textContent = qty; }
  });

  /* ---------- Add to cart with the chosen quantity ---------- */
  const addBtn = root.querySelector("[data-add-to-cart]");
  addBtn.addEventListener("click", () => {
    for (let i = 0; i < qty; i++) addToCart(product.id);
    addBtn.classList.add("is-added");
    const original = addBtn.innerHTML;
    addBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Added`;
    setTimeout(() => {
      addBtn.classList.remove("is-added");
      addBtn.innerHTML = original;
    }, 1200);
  });

  /* ---------- Related products ---------- */
  const relatedRoot = document.querySelector("[data-related]");
  if (relatedRoot) {
    const related = PRODUCTS
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3);

    if (related.length === 0) {
      relatedRoot.style.display = "none";
    } else {
      relatedRoot.querySelector("[data-related-grid]").innerHTML =
        related.map((p, idx) => `
          <a class="related-card reveal" href="product.html?id=${p.id}" style="animation-delay:${idx * 80}ms">
            <div class="related-card__media">
              <img src="${p.image}" alt="${p.name}" loading="lazy">
            </div>
            <div class="related-card__body">
              <span class="related-card__category">${p.category}</span>
              <h3>${p.name}</h3>
              <span class="related-card__price">${formatPrice(p.price)}</span>
            </div>
          </a>
        `).join("");
    }
  }
});
