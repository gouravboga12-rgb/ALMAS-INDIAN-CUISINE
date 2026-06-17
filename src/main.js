import AOS from 'aos';
import 'aos/dist/aos.css';
import './ecommerce.js';


// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  mirror: false,
});

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Splash Screen Logic
function handleSplashScreen() {
  const splash = document.getElementById('splash-screen');
  if (!splash) return;

  // Check if splash has already been shown in this session
  if (sessionStorage.getItem('splash-shown')) {
    splash.style.display = 'none';
    splash.classList.add('hidden');
    document.body.classList.remove('loading');
    return;
  }

  // Prevent scrolling during splash
  document.body.classList.add('loading');

  // Set timeout to hide splash
  setTimeout(() => {
    splash.classList.add('hidden');
    document.body.classList.remove('loading');
    
    // Mark as shown in session
    sessionStorage.setItem('splash-shown', 'true');
    
    // Refresh AOS once splash is gone to ensure animations trigger correctly
    setTimeout(() => {
      AOS.refresh();
    }, 400);
  }, 2500); // 2.5 seconds as requested
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  handleSplashScreen();

  // Dynamic mobile menu authentication links (Login / Sign Up or My Account)
  const authGroup = document.getElementById('mobile-auth-group');
  if (authGroup) {
    const saved = JSON.parse(localStorage.getItem('almas_account'));
    if (saved && saved.name) {
      const isAccountPage = window.location.pathname.includes('account.html') || window.location.pathname.endsWith('/account');
      authGroup.innerHTML = `
        <a href="/account.html" class="${isAccountPage ? 'text-primary' : 'hover:text-primary'} transition-colors" style="color: #D4AF37;">My Account</a>
      `;
    } else {
      authGroup.innerHTML = `
        <a href="/account.html?tab=login" class="hover:text-primary transition-colors">Sign In / Sign Up</a>
      `;
    }
  }

  // Dynamic desktop menu authentication links
  const desktopAuthGroup = document.getElementById('desktop-auth-group');
  if (desktopAuthGroup) {
    const saved = JSON.parse(localStorage.getItem('almas_account'));
    if (saved && saved.name) {
      const initial = getInitials(saved.name);
      desktopAuthGroup.innerHTML = `
        <a href="/account.html" class="nav-signin-btn" title="My Account">
          <div class="nav-signin-avatar">${saved.avatar ? `<img src="${saved.avatar}" alt="${saved.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.style.display='none'; this.parentElement.textContent='${initial}';">` : initial}</div>
          <span>Account</span>
        </a>
      `;
    } else {
      desktopAuthGroup.innerHTML = `
        <a href="/account.html?tab=login" class="nav-signin-btn" title="Sign In">
          <div class="nav-signin-avatar" style="background:#4A4A4A;">
            <svg class="nav-signin-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 12c2.667 0 8 1.333 8 4v2H4v-2c0-2.667 5.333-4 8-4zm0-2a4 4 0 110-8 4 4 0 010 8z"/>
            </svg>
          </div>
          <span>Sign In</span>
        </a>
      `;
    }
  }

  // Inject dynamic mobile controls and announcement bar
  // 1. Create and inject mobile/desktop announcement bar at the top of body
  if (!document.querySelector('.announcement-bar')) {
    const announcementBar = document.createElement('div');
    announcementBar.className = 'announcement-bar';
    announcementBar.innerHTML = `
      <div class="marquee-wrapper">
        <div class="marquee-content" id="announcement-marquee-content">
          <span class="marquee-item">100% NATURAL AND FORM FRESH EVERY DAY • ALMAS THE QUALITY CHOICE • FREE DELIVERY ON ORDERS OVER $50 • GET 10% OFF ON YOUR FIRST ORDER USE CODE: ALMAS10 •</span>
          <span class="marquee-item">100% NATURAL AND FORM FRESH EVERY DAY • ALMAS THE QUALITY CHOICE • FREE DELIVERY ON ORDERS OVER $50 • GET 10% OFF ON YOUR FIRST ORDER USE CODE: ALMAS10 •</span>
        </div>
      </div>
    `;
    document.body.insertBefore(announcementBar, document.body.firstChild);
  }

  // 2. Create and inject mobile header auth button dynamically
  const mobileControls = document.querySelector('.glass-nav .lg\\:hidden.space-x-3');
  if (mobileControls && !document.getElementById('mobile-auth-group-header')) {
    const mobileAuthContainer = document.createElement('div');
    mobileAuthContainer.id = 'mobile-auth-group-header';
    
    const saved = JSON.parse(localStorage.getItem('almas_account'));
    if (saved && saved.name) {
      const initial = getInitials(saved.name);
      mobileAuthContainer.innerHTML = `
        <a href="/account.html" class="nav-signin-btn" title="My Account" style="display: flex !important; justify-content: center !important; align-items: center !important; width: 44px !important; height: 44px !important;">
          <div class="nav-signin-avatar" style="width: 32px !important; height: 32px !important; font-size: 0.85rem !important;">
            ${saved.avatar ? `<img src="${saved.avatar}" alt="${saved.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.style.display='none'; this.parentElement.textContent='${initial}';">` : initial}
          </div>
        </a>
      `;
    } else {
      mobileAuthContainer.innerHTML = `
        <a href="/account.html?tab=login" class="nav-signin-btn" title="Sign In" style="display: flex !important; justify-content: center !important; align-items: center !important; width: 44px !important; height: 44px !important;">
          <div class="nav-signin-avatar" style="background:#1A1A1A; width: 32px !important; height: 32px !important;">
            <svg class="nav-signin-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="width: 1.1rem; height: 1.1rem;">
              <path d="M12 12c2.667 0 8 1.333 8 4v2H4v-2c0-2.667 5.333-4 8-4zm0-2a4 4 0 110-8 4 4 0 010 8z"/>
            </svg>
          </div>
        </a>
      `;
    }
    mobileControls.appendChild(mobileAuthContainer);
  }

  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('close-btn');
  const overlay = document.getElementById('menu-overlay');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  // Close menu when a nav link is clicked & highlight active link
  if (mobileMenu) {
    const currentPath = window.location.pathname;
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
      
      const href = link.getAttribute('href');
      if (href) {
        const isHome = currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/');
        const linkIsHome = href === '/' || href === '/index.html' || href === 'index.html';
        
        if ((isHome && linkIsHome) || (!isHome && href !== '/' && href !== 'index.html' && currentPath.includes(href))) {
          link.classList.add('active-mobile');
        }
      }
    });
  }

  // Geolocation for Contact Form
  const locationBtn = document.getElementById('get-location');
  const addressInput = document.getElementById('event-address');

  if (locationBtn && addressInput) {
    locationBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        locationBtn.textContent = 'Fetching...';
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            addressInput.value = `📍 Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (Sharing precise location)`;
            locationBtn.textContent = 'Location Shared';
            locationBtn.classList.add('bg-primary', 'text-white');
          },
          (error) => {
            console.error('Error fetching location:', error);
            locationBtn.textContent = 'Error';
            alert('Unable to fetch location. Please type your address manually.');
          }
        );
      } else {
        alert('Geolocation is not supported by your browser.');
      }
    });
  }

  // Unified Search Handler
  function triggerSearch(value) {
    const cleanVal = value.trim();
    if (!cleanVal) return;

    const productSearch = document.getElementById('product-search');
    const menuSearch = document.getElementById('menu-search-input');

    if (productSearch) {
      // Products page: update input, trigger filtering, scroll to first card
      productSearch.value = cleanVal;
      productSearch.dispatchEvent(new Event('input'));
      
      setTimeout(() => {
        const visibleCards = document.querySelectorAll('.card-premium:not([style*="display: none"])');
        if (visibleCards.length > 0) {
          visibleCards[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
          visibleCards[0].classList.add('highlight-premium');
          setTimeout(() => {
            visibleCards[0].classList.remove('highlight-premium');
          }, 2500);
        } else {
          productSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    } else if (menuSearch) {
      // Menu page: update input, trigger filtering, scroll to first menu item
      menuSearch.value = cleanVal;
      menuSearch.dispatchEvent(new Event('input'));
      
      setTimeout(() => {
        const visibleItems = document.querySelectorAll('.menu-item-row:not(.search-hidden)');
        if (visibleItems.length > 0) {
          visibleItems[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
          visibleItems[0].classList.add('highlight-premium');
          setTimeout(() => {
            visibleItems[0].classList.remove('highlight-premium');
          }, 2500);
        } else {
          menuSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    } else {
      // Other page: redirect to products page with search query
      window.location.href = `/products.html?search=${encodeURIComponent(cleanVal)}`;
    }
  }

  // Mobile Search Bar Toggle & Input handling
  const mobileSearchBtn = document.getElementById('mobile-search-btn');
  const mobileSearchBar = document.getElementById('mobile-search-bar');
  const mobileSearchInput = document.getElementById('mobile-search-input');
  const mobileSearchClear = document.getElementById('mobile-search-clear');

  if (mobileSearchBtn && mobileSearchBar && mobileSearchInput) {
    mobileSearchBtn.addEventListener('click', () => {
      mobileSearchBar.classList.toggle('hidden');
      if (!mobileSearchBar.classList.contains('hidden')) {
        mobileSearchInput.focus();
      }
    });

    if (mobileSearchClear) {
      mobileSearchClear.addEventListener('click', () => {
        mobileSearchInput.value = '';
        mobileSearchInput.focus();
        mobileSearchInput.dispatchEvent(new Event('input'));
      });
    }

    // Connect mobile input typing to page-level input in real-time
    mobileSearchInput.addEventListener('input', (e) => {
      const value = e.target.value;
      const productSearch = document.getElementById('product-search');
      const menuSearch = document.getElementById('menu-search-input');
      
      if (productSearch) {
        productSearch.value = value;
        productSearch.dispatchEvent(new Event('input'));
      } else if (menuSearch) {
        menuSearch.value = value;
        menuSearch.dispatchEvent(new Event('input'));
      }
    });

    // Handle Enter key on mobile search
    mobileSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerSearch(mobileSearchInput.value);
      }
    });

    // Make mobile search icon clickable to trigger search
    const mobileSearchIcon = document.querySelector('#mobile-search-bar span.absolute');
    if (mobileSearchIcon) {
      mobileSearchIcon.style.cursor = 'pointer';
      mobileSearchIcon.addEventListener('click', () => {
        triggerSearch(mobileSearchInput.value);
      });
    }
  }

  // Check URL query parameters for search on page load
  const urlParams = new URLSearchParams(window.location.search);
  const searchQueryParams = urlParams.get('search');
  if (searchQueryParams) {
    const cleanSearch = decodeURIComponent(searchQueryParams).trim();
    triggerSearch(cleanSearch);
  }

  // Desktop Search Input Handling
  const desktopSearchInput = document.getElementById('desktop-search-input');
  const desktopSearchIcon = document.querySelector('.desktop-search-icon');

  if (desktopSearchInput) {
    // Connect desktop input typing to page-level input in real-time
    desktopSearchInput.addEventListener('input', (e) => {
      const value = e.target.value;
      const productSearch = document.getElementById('product-search');
      const menuSearch = document.getElementById('menu-search-input');
      
      if (productSearch) {
        productSearch.value = value;
        productSearch.dispatchEvent(new Event('input'));
      } else if (menuSearch) {
        menuSearch.value = value;
        menuSearch.dispatchEvent(new Event('input'));
      }
    });

    // Handle Enter key on desktop search
    desktopSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerSearch(desktopSearchInput.value);
      }
    });
  }

  // Make desktop search icon clickable to trigger search
  if (desktopSearchIcon && desktopSearchInput) {
    desktopSearchIcon.style.cursor = 'pointer';
    desktopSearchIcon.addEventListener('click', () => {
      triggerSearch(desktopSearchInput.value);
    });
  }


  // Table Reservation Query/Hash Redirects (redirect to updated Reservations page)
  const hasReservationHash = window.location.hash === '#contact-section' || window.location.hash === '#reservation-form';
  if (urlParams.get('type') === 'reservation' || hasReservationHash) {
    window.location.replace('/reservations');
    return;
  }

  // Load global website settings from API
  async function loadGlobalSettings() {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) return;
      const data = await res.json();
      
      // Cache settings for dynamic pages / offline support
      localStorage.setItem('almas_global_settings', JSON.stringify(data));
      
      // Update Announcement Marquee
      if (data.marquee) {
        const marqueeContent = document.getElementById('announcement-marquee-content');
        if (marqueeContent) {
          marqueeContent.innerHTML = `
            <span class="marquee-item">${data.marquee}</span>
            <span class="marquee-item">${data.marquee}</span>
          `;
        }
      }

      // Update Timings (Hours)
      if (data.timings) {
        const hoursHeader = Array.from(document.querySelectorAll('h4')).find(el => el.textContent.trim().toLowerCase() === 'hours');
        if (hoursHeader) {
          const list = hoursHeader.nextElementSibling;
          if (list) {
            list.innerHTML = `
              <li class="flex justify-between"><span>Mon - Thu</span> <span>${data.timings.mon_thu}</span></li>
              <li class="flex justify-between"><span>Fri - Sat</span> <span>${data.timings.fri_sat}</span></li>
              <li class="flex justify-between text-primary"><span>Sunday</span> <span>${data.timings.sun}</span></li>
            `;
          }
        }
      }

      // Update Floating WhatsApp
      if (data.whatsapp) {
        const cleanNum = data.whatsapp.replace(/[^0-9]/g, '');
        
        // Floating button
        const whatsappFloat = document.querySelector('.whatsapp-float');
        if (whatsappFloat) {
          whatsappFloat.href = `https://wa.me/${cleanNum}`;
        }
      }

      // Update Social links in footer and mobile menu
      if (data.socials) {
        // Clear and rebuild footer-social-links
        const footerSocials = document.querySelector('.footer-social-links');
        if (footerSocials) {
          footerSocials.innerHTML = `
            <a href="${data.socials.instagram || '#'}" target="_blank" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group" aria-label="Instagram">
              <svg class="w-5 h-5 text-white/40 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="${data.socials.facebook || '#'}" target="_blank" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group" aria-label="Facebook">
              <svg class="w-5 h-5 text-white/40 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
            <a href="${data.socials.tiktok || '#'}" target="_blank" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group" aria-label="TikTok">
              <svg class="w-5 h-5 text-white/40 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/></svg>
            </a>
            <a href="${data.socials.google_page || '#'}" target="_blank" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group" aria-label="Google Page">
              <svg class="w-5 h-5 text-white/40 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.327 0-6.031-2.704-6.031-6.031s2.704-6.031 6.031-6.031c1.527 0 2.918.572 3.99 1.503l3.203-3.203C19.23 2.115 15.934 1 12.24 1 6.033 1 12.24 10.285c6.478 0 11.24 4.555 11.24 11.24 0 .768-.068 1.516-.188 2.24H12.24z"/></svg>
            </a>
            <a href="${data.socials.trip_advisor || '#'}" target="_blank" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group" aria-label="TripAdvisor">
              <svg class="w-5 h-5 text-white/40 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.38 0 0 5.38 0 12s5.38 12 12 12 12-5.38 12-12S18.62 0 12 0zm-3.23 18.06c-1.39 0-2.52-1.13-2.52-2.52 0-1.39 1.13-2.52 2.52-2.52 1.39 0 2.52 1.13 2.52 2.52 0 1.39-1.13 2.52-2.52 2.52zm.05-7.79c-.76 0-1.38-.62-1.38-1.38 0-.76.62-1.38 1.38-1.38.76 0 1.38.62 1.38 1.38 0 .76-.62 1.38-1.38 1.38zm6.41 7.79c-1.39 0-2.52-1.13-2.52-2.52 0-1.39 1.13-2.52 2.52-2.52 1.39 0 2.52 1.13 2.52 2.52 0 1.39-1.13 2.52-2.52 2.52zm-.05-7.79c-.76 0-1.38-.62-1.38-1.38 0-.76.62-1.38 1.38-1.38.76 0 1.38.62 1.38 1.38 0 .76-.62 1.38-1.38 1.38z"/></svg>
            </a>
          `;
        }
        
        // Update mobile menu social links
        const mobileSocials = document.querySelector('#mobile-menu .flex.space-x-4');
        if (mobileSocials) {
          mobileSocials.querySelectorAll('a').forEach(link => {
            const href = link.href || '';
            if (href.includes('instagram.com') || href.includes('instagram')) {
              if (data.socials.instagram) link.href = data.socials.instagram;
            } else if (href.includes('facebook.com') || href.includes('facebook')) {
              if (data.socials.facebook) link.href = data.socials.facebook;
            } else if (href.includes('tiktok.com') || href.includes('tiktok')) {
              if (data.socials.tiktok) link.href = data.socials.tiktok;
            }
          });
        }
      }

      // Update copyright with Developed by CODTECH IT SOLUTION
      const footerBottom = document.querySelector('.footer-bottom-container p') || 
                           document.querySelector('footer .max-w-7xl + .border-t p') || 
                           document.querySelector('footer p');
      if (footerBottom) {
        footerBottom.innerHTML = `&copy; 2024 ALMAS INDIAN CUISINE. Developed by <a href="https://www.codtechitsolutions.com/" target="_blank" style="color:#D4AF37; text-decoration: underline; font-weight: 600;">CODTECH IT SOLUTION</a>.`;
      }

      // Update delivery partner links on order.html
      if (data.delivery) {
        const uberBtn = document.getElementById('partner-link-uber');
        if (uberBtn && data.delivery.uber_eats) uberBtn.href = data.delivery.uber_eats;
        
        const ddBtn = document.getElementById('partner-link-doordash');
        if (ddBtn && data.delivery.doordash) ddBtn.href = data.delivery.doordash;

        const skipBtn = document.getElementById('partner-link-skip');
        if (skipBtn && data.delivery.skip) skipBtn.href = data.delivery.skip;
      }

    } catch (err) {
      console.error("Error loading global configurations:", err);
    }
  }

  loadGlobalSettings();

  // ── Navbar live auth update ──────────────────────────────────────────────────
  // Re-render both desktop & mobile auth slots whenever auth state changes.
  function refreshNavbarAuth() {
    const saved = JSON.parse(localStorage.getItem('almas_account'));

    // Desktop
    const desktopAuthGroup = document.getElementById('desktop-auth-group');
    if (desktopAuthGroup) {
      if (saved && saved.name) {
        const initial = getInitials(saved.name);
        desktopAuthGroup.innerHTML = `
          <a href="/account.html" class="nav-signin-btn" title="My Account">
            <div class="nav-signin-avatar">${saved.avatar ? `<img src="${saved.avatar}" alt="${saved.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.style.display='none'; this.parentElement.textContent='${initial}';">` : initial}</div>
            <span>Account</span>
          </a>
        `;
      } else {
        desktopAuthGroup.innerHTML = `
          <a href="/account.html?tab=login" class="nav-signin-btn" title="Sign In">
            <div class="nav-signin-avatar" style="background:#4A4A4A;">
              <svg class="nav-signin-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 12c2.667 0 8 1.333 8 4v2H4v-2c0-2.667 5.333-4 8-4zm0-2a4 4 0 110-8 4 4 0 010 8z"/>
              </svg>
            </div>
            <span>Sign In</span>
          </a>
        `;
      }
    }

    // Mobile menu
    const mobileAuthGroup = document.getElementById('mobile-auth-group');
    if (mobileAuthGroup) {
      if (saved && saved.name) {
        const isAccountPage = window.location.pathname.includes('account');
        mobileAuthGroup.innerHTML = `
          <a href="/account.html" class="${isAccountPage ? 'text-primary' : 'hover:text-primary'} transition-colors" style="color: #D4AF37;">My Account</a>
        `;
      } else {
        mobileAuthGroup.innerHTML = `
          <a href="/account.html?tab=login" class="hover:text-primary transition-colors">Sign In / Sign Up</a>
        `;
      }
    }

    // Mobile header auth icon
    const mobileAuthHeader = document.getElementById('mobile-auth-group-header');
    if (mobileAuthHeader) {
      if (saved && saved.name) {
        const initial = getInitials(saved.name);
        mobileAuthHeader.innerHTML = `
          <a href="/account.html" class="nav-signin-btn" title="My Account" style="display:flex!important;justify-content:center!important;align-items:center!important;width:44px!important;height:44px!important;">
            <div class="nav-signin-avatar" style="width:32px!important;height:32px!important;font-size:0.85rem!important;">
              ${saved.avatar ? `<img src="${saved.avatar}" alt="${saved.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.style.display='none'; this.parentElement.textContent='${initial}';">` : initial}
            </div>
          </a>
        `;
      } else {
        mobileAuthHeader.innerHTML = `
          <a href="/account.html?tab=login" class="nav-signin-btn" title="Sign In" style="display:flex!important;justify-content:center!important;align-items:center!important;width:44px!important;height:44px!important;">
            <div class="nav-signin-avatar" style="background:#1A1A1A;width:32px!important;height:32px!important;">
              <svg class="nav-signin-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="width:1.1rem;height:1.1rem;">
                <path d="M12 12c2.667 0 8 1.333 8 4v2H4v-2c0-2.667 5.333-4 8-4zm0-2a4 4 0 110-8 4 4 0 010 8z"/>
              </svg>
            </div>
          </a>
        `;
      }
    }
  }

  // Listen for login/logout events dispatched from account.html
  window.addEventListener('auth-change', refreshNavbarAuth);

  // Also listen for cross-tab storage changes (user logs in/out in another tab)
  window.addEventListener('storage', (e) => {
    if (e.key === 'almas_account' || e.key === 'almas_token') {
      refreshNavbarAuth();
    }
  });

  // Check for warning message query parameters on load
  const toastMessage = urlParams.get('message');
  if (toastMessage) {
    showWarningToast(decodeURIComponent(toastMessage));
  }
});

// Helper function to display warning toast notifications
function showWarningToast(message) {
  let toast = document.getElementById('warning-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'warning-toast';
    toast.className = 'notification-toast';
    toast.innerHTML = `
      <button class="notification-toast-close" id="warning-toast-close" aria-label="Close" style="color: #888; border: none; background: transparent; cursor: pointer; position: absolute; top: 0.6rem; right: 0.65rem;">✕</button>
      <div class="notification-toast-content" style="display: flex; gap: 0.85rem; align-items: center; width: 100%;">
        <div class="warning-toast-icon-container" style="width: 20px; height: 20px; background-color: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 4px rgba(220, 38, 38, 0.25);">
          <span style="color: white; font-weight: 900; font-size: 11px; font-family: var(--font-body); line-height: 1;">!</span>
        </div>
        <div class="notification-toast-details" style="display: flex; flex-direction: column; gap: 0.1rem; flex-grow: 1; min-width: 0; padding-right: 1.25rem;">
          <div id="warning-toast-text" style="font-family: var(--font-body); font-weight: 700; font-size: 0.82rem; color: #1a1a1a; line-height: 1.4; white-space: normal; word-break: break-word;"></div>
        </div>
      </div>
    `;
    document.body.appendChild(toast);

    const closeBtn = toast.querySelector('#warning-toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
      });
    }
  }

  const textEl = toast.querySelector('#warning-toast-text');
  if (textEl) {
    textEl.textContent = message;
  }

  // Display the toast with animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  if (toast.timeoutId) {
    clearTimeout(toast.timeoutId);
  }

  toast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}
