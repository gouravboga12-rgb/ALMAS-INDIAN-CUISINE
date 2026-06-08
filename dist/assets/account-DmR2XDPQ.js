import"./main-DS7Wfilc.js";var e=[`Order Received`,`Kitchen Preparing`,`Ready for Pickup`];function t(t){let n=e.indexOf(t);return n===-1?0:n}function n(e){let t=(e||``).toLowerCase();return t.includes(`paid`)||t.includes(`authorized`)?`paid`:t.includes(`pending`)?`pending`:`authorized`}function r(t){return`
        <div class="order-status-track">
          ${e.map((e,n)=>{let r=``;return n<t?r=`done`:n===t&&(r=`active`),`
              <div class="track-step ${r}">
                <div class="track-dot"></div>
                <span class="track-label">${e}</span>
              </div>
            `}).join(``)}
        </div>
      `}function i(e,i){let a=t(e.prepStatus),o=n(e.status),s=Array.isArray(e.items)?e.items.join(` · `):e.items,c=Array.isArray(e.items)?e.items.map(e=>`<div class="order-item-line">${e}</div>`).join(``):`<div class="order-item-line">${e.items}</div>`;return`
        <div class="order-card" id="order-card-${i}">
          <div class="order-card-header">
            <div>
              <div class="order-card-id">${e.id||`ALM-`+i}</div>
              <div class="order-card-type">${e.type}</div>
            </div>
            <div class="order-card-date">
              <div>${e.date}</div>
              <div class="order-card-total" style="margin-top:0.4rem;">$${parseFloat(e.total||0).toFixed(2)}</div>
            </div>
          </div>

          <div class="order-card-items">${s}</div>

          <button class="order-expand-btn" data-idx="${i}">
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
            </svg>
            View Items
          </button>
          <div class="order-items-expanded" id="order-expanded-${i}">
            ${c}
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
            <span class="order-status-badge ${o}">${e.status}</span>
            <span style="color:rgba(255,255,255,0.3); font-size:0.72rem;">${e.payment||``}</span>
          </div>

          ${r(a)}
        </div>
      `}function a(){let e=JSON.parse(localStorage.getItem(`almas_orders`))||[],t=document.getElementById(`orders-list`),n=document.getElementById(`orders-empty`),r=document.getElementById(`order-count-badge`),a=document.getElementById(`total-order-count`);if(r.textContent=`${e.length} order${e.length===1?``:`s`}`,a.textContent=e.length,e.length===0){n.style.display=`block`,t.innerHTML=``;return}n.style.display=`none`,t.innerHTML=e.map((e,t)=>i(e,t)).join(``),t.querySelectorAll(`.order-expand-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.idx,n=document.getElementById(`order-expanded-${t}`).classList.toggle(`open`);e.innerHTML=`
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="${n?`M5 15l7-7 7 7`:`M19 9l-7 7-7-7`}"></path>
            </svg>
            ${n?`Hide Items`:`View Items`}
          `})})}function o(e,t){let n=(e||`G`)[0].toUpperCase();document.getElementById(`auth-card-view`).style.display=`none`,document.getElementById(`logged-in-view`).style.display=`block`,document.getElementById(`sidebar-avatar`).textContent=n,document.getElementById(`sidebar-name`).textContent=e,document.getElementById(`sidebar-email`).textContent=t,document.getElementById(`main-avatar`).textContent=n,document.getElementById(`main-name`).textContent=e,document.getElementById(`main-email`).textContent=t;let r=document.querySelector(`.account-layout`);r&&r.classList.remove(`logged-out`),document.getElementById(`account-main-content`).style.display=`block`,a()}function s(){localStorage.removeItem(`almas_account`);let e=document.querySelector(`.account-layout`);e&&e.classList.add(`logged-out`),document.getElementById(`auth-card-view`).style.display=`block`,document.getElementById(`logged-in-view`).style.display=`none`,document.getElementById(`account-main-content`).style.display=`none`}var c=`almas_registered_users`;function l(){localStorage.getItem(c)||localStorage.setItem(c,JSON.stringify([{name:`Gourav Boga`,email:`gouravboga12@gmail.com`,phone:`+1 (416) 123-4567`,password:`password123`},{name:`Demo User`,email:`demo@gmail.com`,phone:`+1 (416) 999-9999`,password:`password123`}]))}l();function u(){return JSON.parse(localStorage.getItem(c))||[]}function d(e,t,n,r){let i=u();return i.find(e=>e.email.toLowerCase()===t.toLowerCase())?{success:!1,message:`Email address is already registered.`}:(i.push({name:e,email:t,phone:n,password:r}),localStorage.setItem(c,JSON.stringify(i)),{success:!0})}function f(e,t){let n=u().find(t=>t.email.toLowerCase()===e.toLowerCase());return n?n.password===t?{success:!0,user:n}:{success:!1,message:`Incorrect password. Please try again.`}:{success:!1,message:`No account found with this email. Please register.`}}function p(e,t=`error`){let n=document.getElementById(`auth-alert`);n&&(n.textContent=e,n.className=`auth-alert `+t,n.style.display=`flex`,n.scrollIntoView({behavior:`smooth`,block:`nearest`}))}function m(){let e=document.getElementById(`auth-alert`);e&&(e.style.display=`none`)}function h(e,t){let n=document.getElementById(e),r=document.getElementById(t);if(!n||!r)return;let i=`
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      `;r.innerHTML=i,r.addEventListener(`click`,e=>{e.preventDefault(),n.type===`password`?(n.type=`text`,r.innerHTML=`
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
        </svg>
      `,r.title=`Hide Password`):(n.type=`password`,r.innerHTML=i,r.title=`Show Password`)})}document.addEventListener(`DOMContentLoaded`,()=>{let e=JSON.parse(localStorage.getItem(`almas_account`));e&&e.name&&o(e.name,e.email),h(`login-password`,`btn-toggle-login-password`),h(`signup-password`,`btn-toggle-signup-password`);function t(){m(),document.getElementById(`auth-panel-login`).style.display=`none`,document.getElementById(`auth-panel-signup`).style.display=`block`,document.getElementById(`auth-header-login`).style.display=`none`,document.getElementById(`auth-header-signup`).style.display=`block`}function n(){m(),document.getElementById(`auth-panel-login`).style.display=`block`,document.getElementById(`auth-panel-signup`).style.display=`none`,document.getElementById(`auth-header-login`).style.display=`block`,document.getElementById(`auth-header-signup`).style.display=`none`}let r=document.getElementById(`switch-to-signup`);r&&r.addEventListener(`click`,e=>{e.preventDefault(),t()});let i=document.getElementById(`switch-to-login`);i&&i.addEventListener(`click`,e=>{e.preventDefault(),n()});let a=document.getElementById(`link-forgot-password`);a&&a.addEventListener(`click`,e=>{e.preventDefault(),p(`Password reset link has been simulated! Use password123 to log in.`,`success`)}),new URLSearchParams(window.location.search).get(`tab`)===`signup`?t():n(),document.getElementById(`btn-login`).addEventListener(`click`,()=>{m();let e=document.getElementById(`login-email`).value.trim(),t=document.getElementById(`login-password`).value.trim();if(!e){p(`Please enter your email or phone number.`);return}if(!t){p(`Please enter your password.`);return}let n=f(e,t);if(n.success){let e={name:n.user.name,email:n.user.email};localStorage.setItem(`almas_account`,JSON.stringify(e)),o(e.name,e.email)}else p(n.message)}),document.getElementById(`btn-signup`).addEventListener(`click`,()=>{m();let e=document.getElementById(`signup-name`).value.trim(),t=document.getElementById(`signup-email`).value.trim(),n=document.getElementById(`signup-phone`).value.trim(),r=document.getElementById(`signup-password`).value.trim();if(!e){p(`Please enter your full name.`);return}if(!t){p(`Please enter your email address.`);return}if(!r){p(`Please create a password.`);return}let i=d(e,t,n,r);if(i.success){let n={name:e,email:t};localStorage.setItem(`almas_account`,JSON.stringify(n)),o(e,t)}else p(i.message)});let c=document.getElementById(`google-signin-modal`),l=document.getElementById(`google-accounts-list`),g=document.getElementById(`google-modal-close-btn`),_=[{name:`Gourav Boga`,email:`gouravboga12@gmail.com`,avatar:`G`},{name:`Almas Guest`,email:`guest.almas@gmail.com`,avatar:`A`},{name:`Demo User`,email:`demo.user@gmail.com`,avatar:`D`}];function v(){l&&(l.innerHTML=_.map((e,t)=>`
          <button class="google-account-item" data-index="${t}">
            <div class="google-avatar">${e.avatar}</div>
            <div class="google-account-details">
              <p class="google-account-name">${e.name}</p>
              <p class="google-account-email">${e.email}</p>
            </div>
          </button>
        `).join(``)+`
          <button class="google-account-item" id="google-use-another">
            <div class="google-avatar" style="background:#f1f3f4; color:#5f6368; font-size:1.2rem;">👤</div>
            <div class="google-account-details">
              <p class="google-account-name" style="color:#1a73e8; font-weight:500;">Use another account</p>
            </div>
          </button>
        `,l.querySelectorAll(`.google-account-item`).forEach(e=>{e.addEventListener(`click`,()=>{if(e.id===`google-use-another`){let e=prompt(`Enter your Google email:`);if(!e)return;if(!e.includes(`@`)){alert(`Please enter a valid email address.`);return}y({name:e.split(`@`)[0].replace(/[._]/g,` `).replace(/\b\w/g,e=>e.toUpperCase()),email:e})}else{let t=e.dataset.index;y(_[t])}})}))}function y(e){l.innerHTML=`
          <div style="padding:40px 24px; text-align:center;">
            <div class="loading-spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid #1a73e8; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin:0 auto 16px;"></div>
            <p style="font-size:0.9rem; color:#5f6368;">Signing in with Google...</p>
          </div>
          <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        `,setTimeout(()=>{u().find(t=>t.email.toLowerCase()===e.email.toLowerCase())||d(e.name,e.email,``,`google_provider_oauth`);let t={name:e.name,email:e.email};localStorage.setItem(`almas_account`,JSON.stringify(t)),c.classList.remove(`active`),o(e.name,e.email)},1200)}document.getElementById(`btn-google-login`)&&document.getElementById(`btn-google-login`).addEventListener(`click`,()=>{m(),v(),c.classList.add(`active`)}),g&&g.addEventListener(`click`,()=>{c.classList.remove(`active`)}),c&&c.addEventListener(`click`,e=>{e.target===c&&c.classList.remove(`active`)}),document.getElementById(`btn-logout`).addEventListener(`click`,s)});