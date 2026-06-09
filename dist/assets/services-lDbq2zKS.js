import{c as e,l as t}from"./main-CP7hZ_4g.js";import"./style-D4E7pAWN.js";var n=t(e(),1);async function r(){try{let e=await fetch(`/api/services`);if(!e.ok)return;let t=await e.json(),r=document.getElementById(`dynamic-services-grid`);if(!r||!t||t.length===0)return;r.innerHTML=t.map((e,t)=>{let n=t%2==0,r=n?`order-2 md:order-1`:`order-2 md:order-2`,i=n?`fade-right`:`fade-left`,a=n?`order-1 md:order-2`:`order-1 md:order-1`;return`
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
              <div class="${r} text-center md:text-left" data-aos="${i}">
                <span class="text-gold font-bold tracking-widest uppercase text-xs mb-4 block">${e.badge||``}</span>
                <h2 class="text-2xl md:text-4xl lg:text-5xl font-heading mb-5 md:mb-8">${e.title}</h2>
                <p class="text-text-secondary text-base md:text-lg font-light leading-relaxed mb-6 md:mb-10">
                  ${e.description}
                </p>
                <a href="${e.link||`#`}" class="btn-premium inline-flex px-8 md:px-12 mb-8 lg:mb-0 text-sm md:text-base">${e.linkText||`Request Quote`}</a>
              </div>
              <div class="${a} relative" data-aos="zoom-in">
                <img src="${e.image||`/logo.png`}" class="rounded-2xl shadow-2xl w-full h-52 md:h-auto object-cover" alt="${e.title}">
              </div>
            </div>
          `}).join(``),setTimeout(()=>{n.default.refresh()},100)}catch(e){console.error(`Error loading catering services:`,e)}}document.addEventListener(`DOMContentLoaded`,()=>{r();let e=document.getElementById(`dynamic-services-grid`);e&&e.addEventListener(`click`,e=>{let t=e.target.closest(`a`);if(!t)return;let n=t.getAttribute(`href`);n&&(n.includes(`order.html`)||n.includes(`contact.html`))&&(localStorage.getItem(`almas_token`)||(e.preventDefault(),alert(`Please log in or sign up first to access our services.`),window.location.href=`/account.html?tab=login`))})});