/* =========================================================
   Foodie - Orders history page
   Reads foodie:orders from localStorage and paints a list
   of expandable order cards.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-orders-root]");
  if (!root) return;

  function render() {
    const orders = getOrders();

    if (orders.length === 0) {
      root.innerHTML = `
        <div class="empty">
          <div class="empty__icon" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </div>
          <h2>No orders yet</h2>
          <p>Once you place an order it'll show up here, with a full receipt and details.</p>
          <a href="index.html#menu" class="btn btn--primary btn--lg">Browse the menu</a>
        </div>`;
      return;
    }

    const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);

    root.innerHTML = `
      <div class="orders__head">
        <div>
          <h2>${orders.length} order${orders.length === 1 ? "" : "s"}</h2>
          <p class="muted">Total spent on Foodie · <strong>${formatPrice(totalSpent)}</strong></p>
        </div>
        <button class="cart-clear" data-clear-orders type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          Clear order history
        </button>
      </div>

      <div class="orders__list">
        ${orders.map(orderCard).join("")}
      </div>
    `;

    /* Expand/collapse */
    root.querySelectorAll("[data-toggle-order]").forEach(btn => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".order-card");
        card.classList.toggle("is-open");
        const open = card.classList.contains("is-open");
        btn.setAttribute("aria-expanded", String(open));
        btn.querySelector("[data-toggle-label]").textContent = open ? "Hide details" : "View details";
      });
    });

    /* Clear orders with confirmation */
    const clearBtn = root.querySelector("[data-clear-orders]");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("Clear your order history? This can't be undone.")) {
          clearOrders();
          render();
        }
      });
    }
  }

  function orderCard(order) {
    const itemCount = (order.items || []).reduce((s, i) => s + i.qty, 0);
    const deliveryLabel = order.freeDelivery
      ? `<span class="free-pill">Free</span>`
      : formatPrice(order.delivery || 0);

    return `
      <article class="order-card">
        <header class="order-card__head">
          <div class="order-card__meta">
            <span class="order-card__id">${order.id}</span>
            <time>${formatDate(order.placedAt)}</time>
          </div>
          <div class="order-card__summary">
            <div><span>Items</span><strong>${itemCount}</strong></div>
            <div><span>Payment</span><strong>${order.payment || "—"}</strong></div>
            <div><span>Total</span><strong>${formatPrice(order.total || 0)}</strong></div>
          </div>
          <button class="btn btn--secondary btn--sm" data-toggle-order type="button" aria-expanded="false">
            <span data-toggle-label>View details</span>
          </button>
        </header>

        <div class="order-card__details">
          <div class="order-card__items">
            ${(order.items || []).map(item => `
              <div class="checkout-summary__item">
                <img src="${item.image}" alt="${item.name}">
                <div>
                  <h4>${item.name}</h4>
                  <span>Qty ${item.qty} · ${formatPrice(item.price)}</span>
                </div>
                <strong>${formatPrice(item.price * item.qty)}</strong>
              </div>
            `).join("")}
          </div>

          <div class="order-card__totals">
            <div class="summary__row"><span>Subtotal</span><strong>${formatPrice(order.subtotal || 0)}</strong></div>
            <div class="summary__row"><span>Delivery</span><strong>${deliveryLabel}</strong></div>
            <div class="summary__row summary__row--total"><span>Total</span><strong>${formatPrice(order.total || 0)}</strong></div>
          </div>

          <div class="order-card__address">
            <h4>Delivered to</h4>
            <p>
              <strong>${order.customer ? order.customer.name : ""}</strong><br>
              ${order.customer ? order.customer.address : ""}<br>
              ${order.customer ? order.customer.phone : ""}
            </p>
            ${order.customer && order.customer.notes
              ? `<p class="muted"><strong>Note:</strong> ${order.customer.notes}</p>`
              : ""}
          </div>
        </div>
      </article>
    `;
  }

  render();
});
