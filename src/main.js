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

  // Close menu when a nav link is clicked
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
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

    // Connect to page-level search if present
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

    // Handle enter key (submit search)
    mobileSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = mobileSearchInput.value.trim();
        const isProductPage = !!document.getElementById('product-search');
        const isMenuPage = !!document.getElementById('menu-search-input');
        
        if (!isProductPage && !isMenuPage && value) {
          window.location.href = `/products.html?search=${encodeURIComponent(value)}`;
        }
      }
    });
  }

  // Check URL query parameters for search on page load
  const urlParams = new URLSearchParams(window.location.search);
  const searchQueryParams = urlParams.get('search');
  if (searchQueryParams) {
    const cleanSearch = decodeURIComponent(searchQueryParams).trim();
    setTimeout(() => {
      const productSearch = document.getElementById('product-search');
      const menuSearch = document.getElementById('menu-search-input');
      if (productSearch) {
        productSearch.value = cleanSearch;
        productSearch.dispatchEvent(new Event('input'));
        productSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (menuSearch) {
        menuSearch.value = cleanSearch;
        menuSearch.dispatchEvent(new Event('input'));
        menuSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  }
});
