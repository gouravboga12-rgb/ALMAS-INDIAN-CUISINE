/**
 * Almas Indian Cuisine - E-Commerce Shopping Cart System
 * Persistent localStorage state with dynamic drawer injection.
 */

// Cart state
let cart = JSON.parse(localStorage.getItem('almas_cart')) || [];

// Inject Cart Drawer, Modal, and Toast into the page dynamically
function injectCartUI() {
  if (document.getElementById('cart-drawer-overlay')) return;

  // 1. Toast Notification Container
  const toast = document.createElement('div');
  toast.id = 'notification-toast';
  toast.className = 'notification-toast';
  toast.innerHTML = `
    <button class="notification-toast-close" id="notification-toast-close" aria-label="Close">✕</button>
    <div class="notification-toast-content">
      <div class="notification-toast-image-container" id="notification-toast-img-container">
        <img id="notification-toast-img" src="" alt="Product Image">
      </div>
      <div class="notification-toast-details">
        <div class="notification-toast-status" id="notification-toast-status">
          <span class="status-check-icon">✓</span> SUCCESS
        </div>
        <div id="notification-text" class="notification-toast-product">Item added to cart!</div>
        <div class="notification-toast-action" id="notification-toast-action-container">
          <span class="added-text">ADDED TO CART</span>
          <span class="action-separator">·</span>
          <button class="view-cart-link" id="notification-view-cart">VIEW CART</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(toast);

  // Close and view cart event listeners
  const closeBtn = toast.querySelector('#notification-toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      toast.classList.remove('show');
    });
  }

  const viewCartLink = toast.querySelector('#notification-view-cart');
  if (viewCartLink) {
    viewCartLink.addEventListener('click', (e) => {
      e.preventDefault();
      toast.classList.remove('show');
      openCartDrawer();
    });
  }

  // 2. Cart Drawer Overlay & Container
  const drawerOverlay = document.createElement('div');
  drawerOverlay.id = 'cart-drawer-overlay';
  document.body.appendChild(drawerOverlay);

  const drawer = document.createElement('div');
  drawer.id = 'cart-drawer';
  drawer.innerHTML = `
    <div class="cart-drawer-header">
      <h3 style="font-family:var(--font-heading); color:white; font-size:1.4rem; font-weight:700;">YOUR ORDER</h3>
      <button id="close-cart-btn" style="background:transparent; border:none; color:rgba(255,255,255,0.5); cursor:pointer; font-size:1.5rem; transition:color 0.2s;">✕</button>
    </div>
    <div class="cart-drawer-items" id="cart-drawer-items-list">
    </div>
    <div class="cart-drawer-footer">
      <div class="cart-total-row">
        <span>Subtotal</span>
        <span id="cart-subtotal">$0.00</span>
      </div>
      <div class="cart-total-row">
        <span id="cart-tax-label">Estimated Tax (14%)</span>
        <span id="cart-tax">$0.00</span>
      </div>
      <div class="cart-total-row grand">
        <span>Grand Total</span>
        <span id="cart-grand-total">$0.00</span>
      </div>
      <button id="checkout-drawer-btn" class="checkout-drawer-btn" onclick="window.location.href='/order.html'">
        <span>Proceed to Checkout</span>
        <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 18px; height: 18px;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
      </button>
    </div>
  `;
  document.body.appendChild(drawer);

  // 3. Product Customization Modal Overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'customization-modal-overlay';
  modalOverlay.innerHTML = `
    <div id="customization-modal">
      <button class="modal-close-btn" id="modal-close-x">✕</button>
      <img id="modal-item-img" class="modal-item-img" src="" alt="Item Image">
      <h3 id="modal-item-name" style="font-family:var(--font-heading); color:white; font-size:1.6rem; font-weight:700; margin-bottom:0.25rem;"></h3>
      <p id="modal-item-price" style="color:#CC5500; font-weight:700; font-size:1.2rem; margin-bottom:1.25rem;"></p>
      
      <div style="margin-bottom:1.5rem;">
        <label class="form-label">Special Instructions / Description</label>
        <textarea id="modal-special-notes" class="modal-input" rows="3" placeholder="E.g., Mild, Medium, Hot, No onions, extra sauce, sauce on side..."></textarea>
      </div>

      <div class="modal-action-footer">
        <div class="qty-stepper-container">
          <label class="form-label" style="margin-bottom:0.25rem;">Quantity</label>
          <div class="qty-stepper">
            <button class="qty-stepper-btn" id="qty-dec">-</button>
            <span class="qty-stepper-num" id="qty-val">1</span>
            <button class="qty-stepper-btn" id="qty-inc">+</button>
          </div>
        </div>
        <button id="modal-add-btn">
          Add to Cart
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  // 4. Mobile Floating Cart Bar Container
  const floatingCart = document.createElement('div');
  floatingCart.id = 'mobile-floating-cart';
  floatingCart.className = 'mobile-floating-cart';
  floatingCart.addEventListener('click', (e) => {
    e.preventDefault();
    openCartDrawer();
  });
  document.body.appendChild(floatingCart);

  // Setup UI Event Listeners
  setupDrawerListeners();
  setupModalListeners();
}

// Dynamic Checkout Prompt Helper
function updateCheckoutPromptContent() {
  const { subtotal, total } = getCartTotals();
  const textEl = document.getElementById('prompt-text');
  const btnEl = document.getElementById('btn-prompt-checkout');
  if (textEl && btnEl) {
    if (total >= 100.00) {
      textEl.innerHTML = `Your order total is <strong style="color:#CC5500;">$${total.toFixed(2)}</strong>. Since your order is equal to or exceeds $100.00, online payment is required. Would you like to proceed to checkout to pay online?`;
      btnEl.textContent = "Pay Online";
    } else {
      textEl.textContent = "Would you like to proceed to checkout to enter your delivery address and pay, or continue browsing?";
      btnEl.textContent = "Proceed to Pay";
    }
  }
}

// Inject Checkout Prompt Modal
function injectCheckoutPromptUI() {
  if (document.getElementById('checkout-prompt-overlay')) return;

  const promptOverlay = document.createElement('div');
  promptOverlay.id = 'checkout-prompt-overlay';
  promptOverlay.innerHTML = `
    <div id="checkout-prompt-modal">
      <div style="font-size: 3rem; margin-bottom: 1.25rem; text-align: center; color: #CC5500;">🛒</div>
      <h3 style="font-family:var(--font-heading); color:white; font-size:1.6rem; font-weight:700; text-align:center; margin-bottom:0.5rem;">Successfully Added!</h3>
      <p id="prompt-text" style="color:rgba(255,255,255,0.7); text-align:center; font-size:0.9rem; margin-bottom:1.75rem; line-height:1.5;">
        Would you like to proceed to checkout to enter your delivery address and pay, or continue browsing?
      </p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
        <button id="btn-prompt-continue" style="padding:0.9rem; border:2px solid rgba(255,255,255,0.15); color:white; background:transparent; border-radius:999px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; font-size:0.75rem; cursor:pointer; transition:all 0.3s; font-family:var(--font-body);">
          Browse Menu
        </button>
        <button id="btn-prompt-checkout" style="padding:0.9rem; border:2px solid #CC5500; color:white; background:#CC5500; border-radius:999px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; font-size:0.75rem; cursor:pointer; transition:all 0.3s; box-shadow:0 6px 20px rgba(204,85,0,0.3); font-family:var(--font-body);">
          Proceed to Pay
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(promptOverlay);

  // Add event listeners
  document.getElementById('btn-prompt-continue').addEventListener('click', () => {
    promptOverlay.classList.remove('open');
  });

  document.getElementById('btn-prompt-checkout').addEventListener('click', () => {
    promptOverlay.classList.remove('open');
    window.location.href = '/order.html';
  });

  promptOverlay.addEventListener('click', (e) => {
    if (e.target === promptOverlay) {
      promptOverlay.classList.remove('open');
    }
  });

  // Apply initial content
  updateCheckoutPromptContent();
}

// Drawer Event Listeners
function setupDrawerListeners() {
  const overlay = document.getElementById('cart-drawer-overlay');
  const drawer = document.getElementById('cart-drawer');
  const closeBtn = document.getElementById('close-cart-btn');

  const closeCart = () => {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    updateCartBadge(false);
  };

  overlay.addEventListener('click', closeCart);
  closeBtn.addEventListener('click', closeCart);

  // Add click listener to any nav cart button in headers
  document.querySelectorAll('.nav-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });
}

// Customization Modal State and Events
let activeModalItem = null;
let activeModalQty = 1;
let activeModalSpice = 'Mild';

function setupModalListeners() {
  const overlay = document.getElementById('customization-modal-overlay');
  const closeX = document.getElementById('modal-close-x');
  const qtyDec = document.getElementById('qty-dec');
  const qtyInc = document.getElementById('qty-inc');
  const qtyVal = document.getElementById('qty-val');
  const addBtn = document.getElementById('modal-add-btn');

  const closeModal = () => {
    overlay.classList.remove('open');
    activeModalItem = null;
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  closeX.addEventListener('click', closeModal);

  // Qty Increment/Decrement
  qtyDec.addEventListener('click', () => {
    if (activeModalQty > 1) {
      activeModalQty--;
      qtyVal.textContent = activeModalQty;
    }
  });
  qtyInc.addEventListener('click', () => {
    activeModalQty++;
    qtyVal.textContent = activeModalQty;
  });

  // Spice level toggles
  // Add to cart submit
  addBtn.addEventListener('click', () => {
    if (!activeModalItem) return;
    const note = document.getElementById('modal-special-notes').value.trim();

    addToCart(activeModalItem, activeModalQty, '', note);
    closeModal();
  });
}

// Public Cart Actions
export function openCustomizationModal(item) {
  injectCartUI();
  activeModalItem = item;
  activeModalQty = 1;
  activeModalSpice = '';
  
  document.getElementById('modal-item-img').src = item.image;
  document.getElementById('modal-item-name').textContent = item.name;
  document.getElementById('modal-item-price').textContent = `$${parseFloat(item.price).toFixed(2)}`;
  document.getElementById('modal-special-notes').value = '';
  document.getElementById('qty-val').textContent = '1';

  document.getElementById('customization-modal-overlay').classList.add('open');
}

// Add Item
export function addToCart(item, qty = 1, spice = 'Mild', note = '') {
  // Check if item with same configuration already exists
  const existingIndex = cart.findIndex(i => i.id === item.id && i.spice === spice && i.note === note);

  if (existingIndex > -1) {
    cart[existingIndex].qty += qty;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: item.image,
      spice: spice,
      note: note,
      qty: qty
    });
  }

  saveCart();
  updateCartBadge();
  showToast(item.name, true, item.image);
}

// Update Quantity
export function updateCartItemQty(index, newQty) {
  if (newQty <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].qty = newQty;
  }
  saveCart();
  renderCart();
  updateCartBadge();
}

// Clear Cart
export function clearCart() {
  cart = [];
  saveCart();
  renderCart();
  updateCartBadge();
}

// Save Cart
function saveCart() {
  localStorage.setItem('almas_cart', JSON.stringify(cart));
}

// Get Cart Items
export function getCart() {
  return cart;
}

// Show Alert Toast
export function showToast(message, isProduct = false, image = '') {
  injectCartUI();
  const toast = document.getElementById('notification-toast');
  const imgContainer = document.getElementById('notification-toast-img-container');
  const imgEl = document.getElementById('notification-toast-img');
  const statusEl = document.getElementById('notification-toast-status');
  const textEl = document.getElementById('notification-text');
  const actionContainer = document.getElementById('notification-toast-action-container');
  
  if (toast && textEl) {
    if (isProduct) {
      if (image && imgEl && imgContainer) {
        imgEl.src = image;
        imgContainer.style.display = 'block';
      } else if (imgContainer) {
        imgContainer.style.display = 'none';
      }
      if (statusEl) {
        statusEl.innerHTML = `<span class="status-dot"></span> SUCCESS`;
        statusEl.style.display = 'flex';
      }
      textEl.textContent = message;
      if (actionContainer) {
        actionContainer.style.display = 'flex';
      }
    } else {
      if (imgContainer) imgContainer.style.display = 'none';
      if (statusEl) {
        statusEl.innerHTML = `Notification 🔔`;
        statusEl.style.display = 'block';
      }
      textEl.textContent = message;
      if (actionContainer) actionContainer.style.display = 'none';
    }
    
    toast.classList.add('show');
    
    if (toast.timeoutId) {
      clearTimeout(toast.timeoutId);
    }
    
    toast.timeoutId = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
}

// Open Cart Drawer
export function openCartDrawer() {
  injectCartUI();
  const overlay = document.getElementById('cart-drawer-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (overlay && drawer) {
    overlay.classList.add('open');
    drawer.classList.add('open');
    renderCart();
    // Hide floating cart when drawer is open
    const floatingCart = document.getElementById('mobile-floating-cart');
    if (floatingCart) {
      floatingCart.classList.remove('visible');
    }
  }
}

// Get Dynamic Tax Rate from cached settings
export function getTaxRate() {
  try {
    const settingsStr = localStorage.getItem('almas_global_settings');
    if (settingsStr) {
      const settings = JSON.parse(settingsStr);
      if (settings && settings.tax_rate !== undefined) {
        return parseFloat(settings.tax_rate);
      }
    }
  } catch (e) {
    console.error("Error reading tax rate from localStorage:", e);
  }
  return 14; // Default fallback to 14%
}

// Calculate Cart Totals
export function getCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const taxRate = getTaxRate();
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

// Update Cart Badge count across the app
export function updateCartBadge(shouldBump = true) {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const { subtotal } = getCartTotals();

  document.querySelectorAll('.cart-count-badge').forEach(badge => {
    if (totalItems > 0) {
      badge.textContent = totalItems;
      badge.classList.add('visible');
      if (shouldBump) {
        badge.classList.remove('bump');
        void badge.offsetWidth; // trigger reflow
        badge.classList.add('bump');
      }
    } else {
      badge.classList.remove('visible');
      badge.classList.remove('bump');
    }
  });

  // Update mobile floating cart bar
  const floatingCart = document.getElementById('mobile-floating-cart');
  if (floatingCart) {
    if (totalItems > 0) {
      floatingCart.innerHTML = `
        <div class="floating-cart-content">
          <div class="floating-cart-icon-wrapper">
            <svg class="floating-cart-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span class="floating-cart-badge">${totalItems}</span>
          </div>
          <span class="floating-cart-text">VIEW CART</span>
          <span class="floating-cart-price">$${subtotal.toFixed(2)}</span>
        </div>
      `;
      floatingCart.classList.add('visible');
    } else {
      floatingCart.classList.remove('visible');
    }
  }
}

// Render Cart Drawer
export function renderCart() {
  injectCartUI();
  const list = document.getElementById('cart-drawer-items-list');
  const checkoutBtn = document.getElementById('checkout-drawer-btn');
  
  if (cart.length === 0) {
    list.innerHTML = `
      <div class="cart-empty-state">
        <svg style="width:48px; height:48px; opacity:0.4;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <p style="font-size:0.9rem; font-weight:600; color:rgba(255,255,255,0.4);">Your cart is empty.</p>
        <a href="/products.html" style="margin-top:0.5rem; color:#CC5500; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; border-bottom:1.5px solid #CC5500; padding-bottom:2px; text-decoration:none;">View Products</a>
      </div>
    `;
    checkoutBtn.style.opacity = '0.5';
    checkoutBtn.style.pointerEvents = 'none';
    
    document.getElementById('cart-subtotal').textContent = '$0.00';
    const taxRate = getTaxRate();
    const taxLabel = document.getElementById('cart-tax-label');
    if (taxLabel) {
      taxLabel.textContent = `Estimated Tax (${taxRate}%)`;
    }
    document.getElementById('cart-tax').textContent = '$0.00';
    document.getElementById('cart-grand-total').textContent = '$0.00';
    return;
  }

  checkoutBtn.style.opacity = '1';
  checkoutBtn.style.pointerEvents = 'all';

  list.innerHTML = cart.map((item, idx) => {
    const details = [];
    if (item.spice) details.push(`Spice: ${item.spice}`);
    if (item.note) details.push(`Note: ${item.note}`);
    const detailsHtml = details.length > 0 ? `<div style="font-size:0.75rem; color:rgba(255,255,255,0.45); font-style:italic; margin-top:0.25rem;">${details.join(' | ')}</div>` : '';
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          ${detailsHtml}
          <div class="cart-qty-controls">
            <button class="cart-qty-btn dec-qty" data-idx="${idx}">-</button>
            <span class="cart-qty-num">${item.qty}</span>
            <button class="cart-qty-btn inc-qty" data-idx="${idx}">+</button>
          </div>
        </div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
    `;
  }).join('');

  // Add click handlers for qty buttons inside drawer
  list.querySelectorAll('.dec-qty').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      updateCartItemQty(idx, cart[idx].qty - 1);
    });
  });
  list.querySelectorAll('.inc-qty').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      updateCartItemQty(idx, cart[idx].qty + 1);
    });
  });

  // Update Totals
  const { subtotal, tax, total } = getCartTotals();
  document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  const taxRate = getTaxRate();
  const taxLabel = document.getElementById('cart-tax-label');
  if (taxLabel) {
    taxLabel.textContent = `Estimated Tax (${taxRate}%)`;
  }
  document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('cart-grand-total').textContent = `$${total.toFixed(2)}`;
}

// Auto Initialize badges on import
document.addEventListener('DOMContentLoaded', () => {
  injectCartUI();
  updateCartBadge(false);
});
