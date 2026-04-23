import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  mirror: false,
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
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
});
