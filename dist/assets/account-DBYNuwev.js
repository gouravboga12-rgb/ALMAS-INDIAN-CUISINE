import"./main-Boqvh8oj.js";var e=[`Order Received`,`Kitchen Preparing`,`Ready for Pickup`],t={};function n(e){let n=String(e).split(` - $`);if(n.length>1)return{name:n[0],price:`$${n[1]}`};let r=String(e).match(/^(\d+)x\s+(.+)$/);if(r){let n=parseInt(r[1],10),i=r[2],a=i,o=i.lastIndexOf(` (`);o!==-1&&(a=i.substring(0,o).trim());let s=t[a.toLowerCase().trim()];if(s!==void 0&&!isNaN(s))return{name:e,price:`$${(s*n).toFixed(2)}`}}return{name:e,price:``}}function r(e){if(!e)return`U`;let t=e.trim().split(/\s+/);return t.length===1?t[0].charAt(0).toUpperCase():(t[0].charAt(0)+t[t.length-1].charAt(0)).toUpperCase()}function i(e){let t=(e||``).toLowerCase().trim();return t.includes(`preparing`)?1:t.includes(`ready`)?2:t.includes(`completed`)?3:t.includes(`cancelled`)?-1:0}function a(e){let t=(e||``).toLowerCase();return t.includes(`paid`)||t.includes(`authorized`)?`paid`:t.includes(`pending`)?`pending`:`authorized`}function o(t){return`
        <div class="order-status-track">
          ${e.map((e,n)=>{let r=``;return n<t?r=`done`:n===t&&(r=`active`),`
              <div class="track-step ${r}">
                <div class="track-dot"></div>
                <span class="track-label">${e}</span>
              </div>
            `}).join(``)}
        </div>
      `}function s(e){let t=Array.isArray(e.items)?e.items:typeof e.items==`string`?JSON.parse(e.items):[],r=parseFloat(e.total||0)-parseFloat(e.tax||0),i=parseFloat(e.tax||0),a=parseFloat(e.total||0),o=r>0?Math.round(i/r*100):14,s=e.created_at?new Date(e.created_at).toLocaleString():e.date||new Date().toLocaleString(),c=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${e.id||`ALMAS Order`}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:wght@700;800&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Inter', sans-serif; background: #fff; color: #1a0800; }
    .invoice-wrap { max-width: 700px; margin: 0 auto; padding: 40px 30px; }
    .invoice-header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 3px solid #CC5500; padding-bottom: 24px; margin-bottom: 30px; }
    .brand-name { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 800; color: #CC5500; line-height:1.1; }
    .brand-tagline { font-size: 0.7rem; color: #666; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 4px; }
    .invoice-meta { text-align: right; }
    .invoice-label { font-size: 2rem; font-weight: 700; color: #CC5500; font-family: 'Playfair Display', serif; }
    .invoice-id { font-size: 0.8rem; color: #555; margin-top: 4px; }
    .invoice-date { font-size: 0.75rem; color: #888; margin-top: 2px; }
    .section-title { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: #CC5500; font-weight: 700; margin-bottom: 6px; margin-top: 24px; }
    .customer-box { background: #fdf5ef; border-left: 3px solid #CC5500; padding: 14px 18px; border-radius: 0 8px 8px 0; }
    .customer-name { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
    .customer-detail { font-size: 0.8rem; color: #555; margin-bottom: 2px; }
    .items-table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    .items-table th { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #fff; background: #CC5500; padding: 10px 14px; text-align: left; }
    .items-table td { padding: 10px 14px; font-size: 0.85rem; border-bottom: 1px solid #f0e8e0; vertical-align: top; }
    .items-table tr:last-child td { border-bottom: none; }
    .totals-box { margin-top: 20px; display: flex; justify-content: flex-end; }
    .totals-inner { width: 260px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 0.85rem; border-bottom: 1px solid #f0e8e0; }
    .total-row.grand { border-top: 2px solid #CC5500; border-bottom: none; margin-top: 8px; padding-top: 10px; font-weight: 700; font-size: 1rem; color: #CC5500; }
    .payment-box { margin-top: 24px; background: #fdf5ef; border-radius: 8px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; }
    .payment-method { font-size: 0.8rem; }
    .payment-ref { font-size: 0.75rem; color: #888; }
    .invoice-footer { margin-top: 36px; text-align: center; border-top: 1px solid #f0e8e0; padding-top: 20px; font-size: 0.72rem; color: #888; }
    .status-pill { display: inline-block; background: #CC5500; color: white; font-size: 0.65rem; padding: 3px 10px; border-radius: 999px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; vertical-align: middle; }
    @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
<div class="invoice-wrap">
  <div class="invoice-header">
    <div>
      <div class="brand-name">ALMAS</div>
      <div class="brand-tagline">Indian Cuisine · Toronto</div>
      <div style="font-size:0.75rem; color:#888; margin-top:8px;">209 Ellesmere Rd, Scarborough, ON M1R 2Y8</div>
      <div style="font-size:0.75rem; color:#888;">almasindiancuisine@gmail.com</div>
    </div>
    <div class="invoice-meta">
      <div class="invoice-label">INVOICE</div>
      <div class="invoice-id">${e.id||`N/A`}</div>
      <div class="invoice-date">${s}</div>
    </div>
  </div>

  <div class="section-title">Bill To</div>
  <div class="customer-box">
    <div class="customer-name">${e.name||``}</div>
    ${e.email?`<div class="customer-detail">✉ ${e.email}</div>`:``}
    ${e.phone?`<div class="customer-detail">📞 ${e.phone}</div>`:``}
  </div>

  <div class="section-title">Fulfillment Details</div>
  <div style="font-size:0.82rem; color:#444; background:#fafafa; border-radius:8px; padding:12px 18px; margin-top:4px;">
    <strong>Type:</strong> ${e.type||``} &nbsp; | &nbsp; <strong>Pickup Time:</strong> ${e.time||`ASAP`}
  </div>

  <table class="items-table">
    <thead>
      <tr><th style="width:70%"># Item</th><th style="text-align:right">Details</th></tr>
    </thead>
    <tbody>
      ${t.map((e,t)=>{let r=n(e);return`<tr><td>${t+1}. ${r.name}</td><td style="text-align:right">${r.price}</td></tr>`}).join(``)}
    </tbody>
  </table>

  <div class="totals-box">
    <div class="totals-inner">
      <div class="total-row"><span>Subtotal</span><span>$${r.toFixed(2)}</span></div>
      <div class="total-row"><span>Tax (HST ${o}%)</span><span>$${i.toFixed(2)}</span></div>
      <div class="total-row grand"><span>TOTAL</span><span>$${a.toFixed(2)} CAD</span></div>
    </div>
  </div>

  <div class="section-title">Payment</div>
  <div class="payment-box">
    <div>
      <div class="payment-method" style="font-weight:600;">${e.payment||`N/A`}</div>
      <div class="payment-ref">Status: <span class="status-pill">${e.status||``}</span></div>
    </div>
    <div style="font-size:0.72rem; color:#888; text-align:right;">Amount Paid<br><strong style="font-size:1rem; color:#CC5500;">$${a.toFixed(2)}</strong></div>
  </div>

  <div class="invoice-footer">
    <strong style="color:#CC5500; font-size:0.9rem;">Thank you for dining with ALMAS!</strong><br>
    &copy; ${new Date().getFullYear()} ALMAS Indian Cuisine. All Rights Reserved.
  </div>
</div>
<script>window.onload = function(){ window.print(); };<\/script>
</body>
</html>`,l=window.open(``,`_blank`,`width=800,height=900`);l&&(l.document.write(c),l.document.close())}function c(e,t){let r=i(e.status),s=a(e.status),c=(Array.isArray(e.items)?e.items:[e.items]).map(e=>{let t=n(e);return t.price?`${t.name} (${t.price})`:t.name}),l=c.join(` · `),u=c.map(e=>`<div class="order-item-line">${e}</div>`).join(``);return`
        <div class="order-card" id="order-card-${t}">
          <div class="order-card-header">
            <div>
              <div class="order-card-id">${e.id||`ALM-`+t}</div>
              <div class="order-card-type">${e.type}</div>
            </div>
            <div class="order-card-date">
              <div>${e.date}</div>
              <div class="order-card-total" style="margin-top:0.4rem;">$${parseFloat(e.total||0).toFixed(2)}</div>
            </div>
          </div>

          <div class="order-card-items">${l}</div>

          <button class="order-expand-btn" data-idx="${t}">
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
            </svg>
            View Items
          </button>
          <div class="order-items-expanded" id="order-expanded-${t}">
            ${u}
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
            <span class="order-status-badge ${s}">${e.status}</span>
            <span style="color:rgba(255,255,255,0.3); font-size:0.72rem;">${e.payment||``}</span>
          </div>

          ${o(r)}

          <div style="margin-top:1rem; padding-top:0.75rem; border-top:1px solid rgba(255,255,255,0.06); text-align:right;">
            <button class="order-invoice-btn" data-idx="${t}" style="background:linear-gradient(135deg,#CC5500,#a34400); color:#fff; border:none; border-radius:999px; padding:8px 20px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s;">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Download Invoice
            </button>
          </div>
        </div>
      `}async function l(){let e=localStorage.getItem(`almas_token`),n=document.getElementById(`orders-list`),r=document.getElementById(`orders-empty`),i=document.getElementById(`order-count-badge`),a=document.getElementById(`total-order-count`);try{try{let e=await fetch(`/api/menu`);if(e.ok){let n=await e.json();n&&n.products&&n.products.forEach(e=>{t[e.name.toLowerCase().trim()]=parseFloat(String(e.price).replace(/[^0-9.]/g,``))})}}catch(e){console.error(`Failed to load menu catalog for price mapping:`,e)}let o=await p(`/api/user/orders`,e);if(i.textContent=`${o.length} order${o.length===1?``:`s`}`,a.textContent=o.length,o.length===0){r.style.display=`block`,n.innerHTML=``;return}r.style.display=`none`,n.innerHTML=o.map((e,t)=>c(e,t)).join(``),n.querySelectorAll(`.order-expand-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.idx,n=document.getElementById(`order-expanded-${t}`).classList.toggle(`open`);e.innerHTML=`
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="${n?`M5 15l7-7 7 7`:`M19 9l-7 7-7-7`}"></path>
              </svg>
              ${n?`Hide Items`:`View Items`}
            `})}),n.querySelectorAll(`.order-invoice-btn`).forEach(e=>{e.addEventListener(`click`,()=>{s(o[parseInt(e.dataset.idx,10)])}),e.addEventListener(`mouseenter`,()=>e.style.opacity=`0.85`),e.addEventListener(`mouseleave`,()=>e.style.opacity=`1`)})}catch{r.style.display=`block`}}function u(e,t,n=null){let i=r(e);document.getElementById(`auth-card-view`).style.display=`none`,document.getElementById(`logged-in-view`).style.display=`block`;let a=document.getElementById(`sidebar-avatar`);n?a.innerHTML=`<img src="${n}" alt="${e}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.style.display='none'; this.parentElement.textContent='${i}';">`:a.textContent=i,document.getElementById(`sidebar-name`).textContent=e,document.getElementById(`sidebar-email`).textContent=t;let o=document.getElementById(`main-avatar`);n?o.innerHTML=`<img src="${n}" alt="${e}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.style.display='none'; this.parentElement.textContent='${i}';">`:o.textContent=i,document.getElementById(`main-name`).textContent=e,document.getElementById(`main-email`).textContent=t;let s=document.querySelector(`.account-layout`);s&&s.classList.remove(`logged-out`),document.getElementById(`account-main-content`).style.display=`block`,l()}function d(){localStorage.removeItem(`almas_account`),localStorage.removeItem(`almas_token`);let e=document.querySelector(`.account-layout`);e&&e.classList.add(`logged-out`),document.getElementById(`auth-card-view`).style.display=`block`,document.getElementById(`logged-in-view`).style.display=`none`,document.getElementById(`account-main-content`).style.display=`none`,document.getElementById(`login-email`).value=``,document.getElementById(`login-password`).value=``,document.getElementById(`auth-panel-login`).style.display=`block`,document.getElementById(`auth-panel-signup`).style.display=`none`,document.getElementById(`auth-header-login`).style.display=`block`,document.getElementById(`auth-header-signup`).style.display=`none`,window.dispatchEvent(new Event(`auth-change`))}async function f(e,t,n=null){let r={"Content-Type":`application/json`};n&&(r.Authorization=`Bearer ${n}`);let i=await fetch(e,{method:`POST`,headers:r,body:JSON.stringify(t)}),a=await i.json();if(!i.ok){let e=Error(a.error||`Request failed.`);throw e.data=a,e}return a}async function p(e,t){let n=await fetch(e,{method:`GET`,headers:{Authorization:`Bearer ${t}`}}),r=await n.json();if(!n.ok)throw Error(r.error||`Request failed.`);return r}async function m(e){try{g();let t=await f(`/api/user/auth/google`,{credential:e.credential});t.success&&(localStorage.setItem(`almas_account`,JSON.stringify(t.user)),localStorage.setItem(`almas_token`,t.token),u(t.user.name,t.user.email,t.user.avatar),window.dispatchEvent(new Event(`auth-change`)),window.location.href=`/products.html`)}catch(e){h(e.message||`Google sign-in verification failed.`)}}function h(e,t=`error`){let n=document.getElementById(`auth-alert`);n&&(n.textContent=e,n.className=`auth-alert `+t,n.style.display=`flex`,n.scrollIntoView({behavior:`smooth`,block:`nearest`}))}function g(){let e=document.getElementById(`auth-alert`);e&&(e.style.display=`none`)}function _(e,t){let n=document.getElementById(e),r=document.getElementById(t);!n||!r||r.addEventListener(`click`,e=>{e.preventDefault(),n.type=n.type===`password`?`text`:`password`})}document.addEventListener(`DOMContentLoaded`,()=>{let e=localStorage.getItem(`almas_token`),t=JSON.parse(localStorage.getItem(`almas_account`));e&&t?(u(t.name,t.email,t.avatar),p(`/api/user/profile`,e).then(e=>{e.success&&e.user&&(localStorage.setItem(`almas_account`,JSON.stringify(e.user)),u(e.user.name,e.user.email,e.user.avatar))}).catch(()=>d())):d(),_(`login-password`,`btn-toggle-login-password`),_(`signup-password`,`btn-toggle-signup-password`);let n=``;function r(){g(),document.getElementById(`auth-panel-login`).style.display=`none`,document.getElementById(`auth-panel-signup`).style.display=`block`,document.getElementById(`auth-panel-otp`).style.display=`none`,document.getElementById(`auth-panel-forgot`).style.display=`none`,document.getElementById(`auth-header-login`).style.display=`none`,document.getElementById(`auth-header-signup`).style.display=`block`,document.getElementById(`auth-header-otp`).style.display=`none`,document.getElementById(`auth-header-forgot`).style.display=`none`}function i(){g(),document.getElementById(`auth-panel-login`).style.display=`block`,document.getElementById(`auth-panel-signup`).style.display=`none`,document.getElementById(`auth-panel-otp`).style.display=`none`,document.getElementById(`auth-panel-forgot`).style.display=`none`,document.getElementById(`auth-header-login`).style.display=`block`,document.getElementById(`auth-header-signup`).style.display=`none`,document.getElementById(`auth-header-otp`).style.display=`none`,document.getElementById(`auth-header-forgot`).style.display=`none`}function a(e,t=`Verification code sent to your email.`){g(),n=e,document.getElementById(`auth-panel-login`).style.display=`none`,document.getElementById(`auth-panel-signup`).style.display=`none`,document.getElementById(`auth-panel-forgot`).style.display=`none`,document.getElementById(`auth-header-login`).style.display=`none`,document.getElementById(`auth-header-signup`).style.display=`none`,document.getElementById(`auth-header-forgot`).style.display=`none`,document.getElementById(`auth-panel-otp`).style.display=`block`,document.getElementById(`auth-header-otp`).style.display=`block`,document.getElementById(`otp-header-subtitle`).innerHTML=`${t}<br><strong style="color:#202124;">${e}</strong>`,document.getElementById(`otp-code`).value=``,h(`Please check your email for the verification code.`,`success`)}function o(){g(),document.getElementById(`auth-panel-login`).style.display=`none`,document.getElementById(`auth-panel-signup`).style.display=`none`,document.getElementById(`auth-panel-otp`).style.display=`none`,document.getElementById(`auth-header-login`).style.display=`none`,document.getElementById(`auth-header-signup`).style.display=`none`,document.getElementById(`auth-header-otp`).style.display=`none`,document.getElementById(`auth-panel-forgot`).style.display=`block`,document.getElementById(`auth-header-forgot`).style.display=`block`,document.getElementById(`forgot-step-send`).style.display=`block`,document.getElementById(`forgot-step-reset`).style.display=`none`,document.getElementById(`forgot-email`).value=``}document.getElementById(`switch-to-signup`)?.addEventListener(`click`,e=>{e.preventDefault(),r()}),document.getElementById(`switch-to-login`)?.addEventListener(`click`,e=>{e.preventDefault(),i()}),document.getElementById(`switch-to-login-from-otp`)?.addEventListener(`click`,e=>{e.preventDefault(),i()}),document.getElementById(`switch-to-login-from-forgot`)?.addEventListener(`click`,e=>{e.preventDefault(),i()}),document.getElementById(`switch-to-login-from-reset`)?.addEventListener(`click`,e=>{e.preventDefault(),i()}),document.getElementById(`link-forgot-password`).addEventListener(`click`,e=>{e.preventDefault(),o()}),document.getElementById(`btn-login`).addEventListener(`click`,async()=>{g();let e=document.getElementById(`login-email`).value.trim(),t=document.getElementById(`login-password`).value.trim();if(!e||!t){h(`Required fields missing.`);return}try{let n=await f(`/api/user/auth/login`,{email:e,password:t});localStorage.setItem(`almas_account`,JSON.stringify(n.user)),localStorage.setItem(`almas_token`,n.token),u(n.user.name,n.user.email,n.user.avatar),window.dispatchEvent(new Event(`auth-change`)),window.location.href=`/products.html`}catch(e){e.data&&e.data.requiresVerification?a(e.data.email,e.message):h(e.message)}}),document.getElementById(`btn-signup`).addEventListener(`click`,async()=>{g();let e=document.getElementById(`signup-name`).value.trim(),t=document.getElementById(`signup-email`).value.trim(),n=document.getElementById(`signup-password`).value.trim();if(!e||!t||!n){h(`Required fields missing.`);return}try{let r=await f(`/api/user/auth/register`,{name:e,email:t,password:n});r.requiresVerification?a(r.email,r.message):(localStorage.setItem(`almas_account`,JSON.stringify(r.user)),localStorage.setItem(`almas_token`,r.token),u(r.user.name,r.user.email,r.user.avatar),window.dispatchEvent(new Event(`auth-change`)),window.location.href=`/products.html`)}catch(e){h(e.message)}}),document.getElementById(`btn-verify-otp`).addEventListener(`click`,async()=>{g();let e=document.getElementById(`otp-code`).value.trim();if(!e||e.length!==6){h(`Please enter the 6-digit verification code.`);return}try{let t=await f(`/api/user/auth/verify-signup`,{email:n,otp:e});localStorage.setItem(`almas_account`,JSON.stringify(t.user)),localStorage.setItem(`almas_token`,t.token),u(t.user.name,t.user.email,t.user.avatar),window.dispatchEvent(new Event(`auth-change`)),g(),window.location.href=`/products.html`}catch(e){h(e.message)}}),document.getElementById(`btn-resend-otp`).addEventListener(`click`,async()=>{g();try{h((await f(`/api/user/auth/resend-signup-otp`,{email:n})).message||`Verification code resent!`,`success`)}catch(e){h(e.message)}}),document.getElementById(`btn-forgot-send`).addEventListener(`click`,async()=>{g();let e=document.getElementById(`forgot-email`).value.trim();if(!e){h(`Please enter your email address.`);return}try{await f(`/api/user/auth/forgot-password`,{email:e}),n=e,document.getElementById(`forgot-step-send`).style.display=`none`,document.getElementById(`forgot-step-reset`).style.display=`block`,document.getElementById(`reset-otp`).value=``,document.getElementById(`reset-password`).value=``,h(`If registered, a reset code was sent to your email.`,`success`)}catch(e){h(e.message)}}),_(`reset-password`,`btn-toggle-reset-password`),document.getElementById(`btn-reset-submit`).addEventListener(`click`,async()=>{g();let e=document.getElementById(`reset-otp`).value.trim(),t=document.getElementById(`reset-password`).value.trim();if(!e||e.length!==6||!t){h(`Please enter the 6-digit code and your new password.`);return}try{h((await f(`/api/user/auth/reset-password`,{email:n,otp:e,newPassword:t})).message||`Password reset successful!`,`success`),setTimeout(()=>{i(),document.getElementById(`login-email`).value=n},1500)}catch(e){h(e.message)}}),fetch(`/api/auth/config`).then(e=>e.json()).then(e=>{if(e.googleClientId&&window.google){google.accounts.id.initialize({client_id:e.googleClientId,callback:m});let t=document.getElementById(`btn-google-login`);t&&google.accounts.id.renderButton(t,{theme:`outline`,size:`large`,width:`100%`,text:`signin_with`});let n=document.getElementById(`btn-google-signup`);n&&google.accounts.id.renderButton(n,{theme:`outline`,size:`large`,width:`100%`,text:`signup_with`})}}),document.getElementById(`btn-logout`).addEventListener(`click`,d)});