/* =========================================================
   Foodie - Checkout Module
   Renders the order summary, validates the form, persists
   the order, clears the cart, and redirects to success.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-checkout-form]");
  const summaryRoot = document.querySelector("[data-checkout-summary]");
  const emptyRoot = document.querySelector("[data-checkout-empty]");
  if (!form && !summaryRoot) return;

  /* If the cart is empty, hide the form and show the empty state */
  function paintForEmpty() {
    if (getCart().length === 0) {
      if (form) form.closest(".form-card").style.display = "none";
      if (summaryRoot) summaryRoot.style.display = "none";
      if (emptyRoot) emptyRoot.style.display = "";
    } else {
      if (form) form.closest(".form-card").style.display = "";
      if (summaryRoot) summaryRoot.style.display = "";
      if (emptyRoot) emptyRoot.style.display = "none";
      renderSummary();
    }
  }

  /* Render the running order summary on the right */
  function renderSummary() {
    if (!summaryRoot) return;
    const cart = getCart();
    const totals = getTotals();

    summaryRoot.innerHTML = `
      <h2>Your order</h2>
      <div class="checkout-summary__items">
        ${cart.map(item => `
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
      <div class="summary__row"><span>Subtotal</span><strong>${formatPrice(totals.subtotal)}</strong></div>
      <div class="summary__row">
        <span>Delivery fee</span>
        ${totals.freeDelivery
          ? `<strong class="free-pill">Free delivery</strong>`
          : `<strong>${formatPrice(totals.delivery)}</strong>`}
      </div>
      ${freeDeliveryBanner(totals)}
      <div class="summary__row summary__row--total"><span>Total</span><strong>${formatPrice(totals.total)}</strong></div>
    `;
  }

  /* ---------- Validation helpers ---------- */
  function setError(field, message) {
    const group = field.closest(".form__group");
    if (!group) return;
    group.classList.add("has-error");
    const errEl = group.querySelector(".form__error");
    if (errEl) errEl.textContent = message;
  }

  function clearError(field) {
    const group = field.closest(".form__group");
    if (group) group.classList.remove("has-error");
  }

  function validate() {
    let valid = true;
    const fields = {
      name: form.elements["name"],
      phone: form.elements["phone"],
      address: form.elements["address"]
    };

    [fields.name, fields.phone, fields.address].forEach(clearError);

    const name = fields.name.value.trim();
    const phone = fields.phone.value.trim();
    const address = fields.address.value.trim();

    if (name.length < 2) {
      setError(fields.name, "Please enter your full name.");
      valid = false;
    }

    /* Accept digits, spaces, +, -, parens. Need at least 8 digits. */
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      setError(fields.phone, "Please enter a valid phone number.");
      valid = false;
    }

    if (address.length < 6) {
      setError(fields.address, "Please enter your delivery address.");
      valid = false;
    }

    return valid;
  }

  /* Live error clearing as users type */
  form.querySelectorAll(".form__input, .form__textarea").forEach(input => {
    input.addEventListener("input", () => clearError(input));
  });

  /* ---------- Submit ---------- */
  form.addEventListener("submit", e => {
    e.preventDefault();

    const alertBox = form.querySelector("[data-form-alert]");
    if (alertBox) alertBox.classList.remove("is-visible");

    const cart = getCart();
    if (cart.length === 0) {
      if (alertBox) {
        alertBox.textContent = "Your cart is empty. Add something from the menu before checking out.";
        alertBox.classList.add("is-visible");
      }
      return;
    }

    if (!validate()) {
      if (alertBox) {
        alertBox.textContent = "Please fix the highlighted fields and try again.";
        alertBox.classList.add("is-visible");
      }
      const firstError = form.querySelector(".form__group.has-error .form__input, .form__group.has-error .form__textarea");
      if (firstError) firstError.focus();
      return;
    }

    /* Build the order record. Use calculateOrderTotals so the
       stored order reflects the free-delivery rule consistently. */
    const totals = calculateOrderTotals(cart);
    const order = {
      id: "FD-" + Date.now().toString(36).toUpperCase(),
      placedAt: new Date().toISOString(),
      customer: {
        name: form.elements["name"].value.trim(),
        phone: form.elements["phone"].value.trim(),
        address: form.elements["address"].value.trim(),
        notes: form.elements["notes"].value.trim()
      },
      payment: form.elements["payment"].value,
      items: cart,
      subtotal: totals.subtotal,
      delivery: totals.delivery,
      freeDelivery: totals.freeDelivery,
      total: totals.total
    };

    saveOrder(order);
    clearCart();

    /* Brief visual feedback before redirect */
    const submitBtn = form.querySelector("[data-submit]");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Placing order...";
    }
    setTimeout(() => { window.location.href = "success.html"; }, 350);
  });

  /* React to cart changes (e.g. clear cart in another tab) */
  document.addEventListener("cart:updated", paintForEmpty);

  paintForEmpty();
});
