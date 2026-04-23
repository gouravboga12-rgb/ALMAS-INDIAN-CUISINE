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

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      console.log('Mobile menu opened');
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn && mobileMenu) {
    closeBtn.addEventListener('click', () => {
      console.log('Mobile menu closed');
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
      document.body.style.overflow = 'auto';
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
