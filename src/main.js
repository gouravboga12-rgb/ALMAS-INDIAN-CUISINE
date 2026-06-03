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
      const initial = saved.name.charAt(0).toUpperCase();
      desktopAuthGroup.innerHTML = `
        <a href="/account.html" class="nav-signin-btn" title="My Account">
          <div class="nav-signin-avatar">${initial}</div>
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
        <div class="marquee-content">
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
      const initial = saved.name.charAt(0).toUpperCase();
      mobileAuthContainer.innerHTML = `
        <a href="/account.html" class="nav-signin-btn" title="My Account" style="display: flex !important; justify-content: center !important; align-items: center !important; width: 44px !important; height: 44px !important;">
          <div class="nav-signin-avatar" style="width: 32px !important; height: 32px !important; font-size: 0.85rem !important;">${initial}</div>
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


  // Table Reservation Query/Hash Redirects
  const serviceDropdown = document.getElementById('service-type');
  const hasReservationHash = window.location.hash === '#contact-section' || window.location.hash === '#reservation-form';
  if ((urlParams.get('type') === 'reservation' || hasReservationHash) && serviceDropdown) {
    serviceDropdown.value = 'Table Reservation';
    setTimeout(() => {
      const contactSection = document.getElementById('contact-section');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 450);
  }
});
