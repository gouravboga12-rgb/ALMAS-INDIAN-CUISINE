import{c as e,l as t}from"./main-BxrPwCb3.js";var n=t(e(),1);async function r(){try{let e=await fetch(`/api/qr-menu`);if(!e.ok){a();return}let t=await e.json(),n=document.getElementById(`dynamic-category-nav`);n&&(n.innerHTML=t.categories.sort((e,t)=>e.order-t.order).map(e=>`
            <a href="#${e.id}" class="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-text-secondary hover:text-primary transition-colors">${e.name}</a>
          `).join(``));let r={soups:`Broths & slow-simmered warmth`,appetizers:`Bold starters & sharing plates`,tandoor:`Clay oven crafted`,"tandoor-treasures":`Clay oven crafted`,mains:`Curries & slow-cooked gravies`,biryani:`Muglai saffron standard`,mandi:`Arabic smoked rice`,pulao:`Aromatic one-pot rice dishes`,beverages:`Teas & cold mocktails`,chinese:`Wok tossed`,momo:`Steamed or fried`,breads:`Tandoor baked`,desserts:`Sweet endings`},o=document.getElementById(`dynamic-menu-sections`);if(o){let e=``;t.categories.sort((e,t)=>e.order-t.order).forEach(n=>{let a=t.products.filter(e=>e.category===n.name);if(a.length===0)return;let o=r[n.id]||`Freshly prepared`,s=a.filter(e=>e.diet===`VEG`),c=a.filter(e=>e.diet!==`VEG`);e+=`
              <section id="${n.id}" class="scroll-mt-16">
                <h2 class="section-title">${n.name}</h2>
                <p class="text-center text-menu-secondary italic mb-12 -mt-8">${o}</p>
            `,s.length>0&&c.length>0&&[`appetizers`,`mains`,`tandoor`].includes(n.id)?e+=`
                <h4 class="category-title">Vegetarian</h4>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-8 mb-10">
                  ${s.map(i).join(``)}
                </div>
                <h4 class="category-title">Non-Vegetarian</h4>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                  ${c.map(i).join(``)}
                </div>
              `:e+=`
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                  ${a.map(i).join(``)}
                </div>
              `,e+=`</section>`}),o.innerHTML=e}a()}catch(e){console.error(`Error loading dynamic menu in menu.html:`,e),a()}}function i(e){let t=e.diet===`VEG`?`<span class="tag-veg">VEG</span> `:``,n=``;e.badge&&(n=` <span class="tag-signature"${e.badge.toUpperCase()===`SIGNATURE`?``:` style="background:#8B3A00"`}>${e.badge.toUpperCase()}</span>`);let r=``,i=(e.price||``).trim();if(i.includes(`/`)){let e=i.split(`/`).map(e=>e.trim()).filter(Boolean),t=[`Single`,`Two People`,`Three People`,`Four People`];r=`<div class="menu-item-price--multi">${e.map((e,n)=>{let r=e.match(/(\$[\d,.]+)/),i=r?r[1]:e,a=r?e.replace(r[0],``).trim():``;return a||=t[n]||`Option ${n+1}`,`<div class="mp-tier"><span class="mp-tier-label">${a}</span><span class="mp-tier-price">${i}</span></div>`}).join(``)}</div>`}else r=`<span class="menu-item-price">${i}</span>`;return`
        <div class="menu-item-row">
          <div class="menu-item-info">
            <h3 class="menu-item-name">${t}${e.name}${n}</h3>
            <p class="menu-item-description">${e.desc||``}</p>
          </div>
          ${r}
        </div>
      `}document.addEventListener(`DOMContentLoaded`,r);function a(){let e=document.getElementById(`menu-search-input`),t=document.getElementById(`menu-search-clear`),r=document.getElementById(`menu-search-result-count`),i=document.getElementById(`menu-no-results`),a=[];document.querySelectorAll(`section[id]`).forEach(e=>{e.querySelectorAll(`.menu-item-row`).forEach(t=>{let n=t.querySelector(`.menu-item-name`),r=t.querySelector(`.menu-item-description`);a.push({el:t,section:e,text:[n?n.innerText:``,r?r.innerText:``].join(` `).toLowerCase()})})});function o(e){let o=e.trim().toLowerCase();if(o.length>0?t.classList.add(`visible`):t.classList.remove(`visible`),o===``){a.forEach(e=>e.el.classList.remove(`search-hidden`)),document.querySelectorAll(`section[id]`).forEach(e=>e.classList.remove(`menu-section-hidden`)),i.classList.remove(`visible`),r.classList.remove(`visible`),n.default.refresh();return}let s=0;a.forEach(e=>{e.text.includes(o)?(e.el.classList.remove(`search-hidden`),s++):e.el.classList.add(`search-hidden`)}),document.querySelectorAll(`section[id]`).forEach(e=>{e.querySelectorAll(`.menu-item-row:not(.search-hidden)`).length===0?e.classList.add(`menu-section-hidden`):e.classList.remove(`menu-section-hidden`)}),s>0?(r.textContent=`${s} dish${s===1?``:`es`} found for "${e.trim()}"`,r.classList.add(`visible`),i.classList.remove(`visible`)):(r.classList.remove(`visible`),i.classList.add(`visible`)),n.default.refresh()}e.addEventListener(`input`,e=>o(e.target.value)),t.addEventListener(`click`,()=>{e.value=``,e.focus(),o(``)}),document.addEventListener(`keydown`,t=>{t.key===`/`&&document.activeElement!==e&&(t.preventDefault(),e.focus(),e.scrollIntoView({behavior:`smooth`,block:`center`})),t.key===`Escape`&&document.activeElement===e&&(e.value=``,o(``),e.blur())})}