var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,a)=>(a=n==null?{}:e(i(n)),s(r||!n||!n.__esModule?t(a,`default`,{value:n,enumerable:!0}):a,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var l=o(((e,t)=>{(function(n,r){typeof e==`object`&&typeof t==`object`?t.exports=r():typeof define==`function`&&define.amd?define([],r):typeof e==`object`?e.AOS=r():n.AOS=r()})(e,function(){return function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return e[r].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p=`dist/`,t(0)}([function(e,t,n){function r(e){return e&&e.__esModule?e:{default:e}}var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a=r((r(n(1)),n(6))),o=r(n(7)),s=r(n(8)),c=r(n(9)),l=r(n(10)),u=r(n(11)),d=r(n(14)),f=[],p=!1,m={offset:120,delay:0,easing:`ease`,duration:400,disable:!1,once:!1,startEvent:`DOMContentLoaded`,throttleDelay:99,debounceDelay:50,disableMutationObserver:!1},h=function(){if(arguments.length>0&&arguments[0]!==void 0&&arguments[0]&&(p=!0),p)return f=(0,u.default)(f,m),(0,l.default)(f,m.once),f},g=function(){f=(0,d.default)(),h()},_=function(){f.forEach(function(e,t){e.node.removeAttribute(`data-aos`),e.node.removeAttribute(`data-aos-easing`),e.node.removeAttribute(`data-aos-duration`),e.node.removeAttribute(`data-aos-delay`)})},v=function(e){return e===!0||e===`mobile`&&c.default.mobile()||e===`phone`&&c.default.phone()||e===`tablet`&&c.default.tablet()||typeof e==`function`&&e()===!0};e.exports={init:function(e){m=i(m,e),f=(0,d.default)();var t=document.all&&!window.atob;return v(m.disable)||t?_():(m.disableMutationObserver||s.default.isSupported()||(console.info(`
      aos: MutationObserver is not supported on this browser,
      code mutations observing has been disabled.
      You may have to call "refreshHard()" by yourself.
    `),m.disableMutationObserver=!0),document.querySelector(`body`).setAttribute(`data-aos-easing`,m.easing),document.querySelector(`body`).setAttribute(`data-aos-duration`,m.duration),document.querySelector(`body`).setAttribute(`data-aos-delay`,m.delay),m.startEvent===`DOMContentLoaded`&&[`complete`,`interactive`].indexOf(document.readyState)>-1?h(!0):m.startEvent===`load`?window.addEventListener(m.startEvent,function(){h(!0)}):document.addEventListener(m.startEvent,function(){h(!0)}),window.addEventListener(`resize`,(0,o.default)(h,m.debounceDelay,!0)),window.addEventListener(`orientationchange`,(0,o.default)(h,m.debounceDelay,!0)),window.addEventListener(`scroll`,(0,a.default)(function(){(0,l.default)(f,m.once)},m.throttleDelay)),m.disableMutationObserver||s.default.ready(`[data-aos]`,g),f)},refresh:h,refreshHard:g}},function(e,t){},,,,,function(e,t){(function(t){function n(e,t,n){function r(t){var n=h,r=g;return h=g=void 0,w=t,v=e.apply(r,n)}function a(e){return w=e,y=setTimeout(u,t),T?r(e):v}function o(e){var n=e-b,r=e-w,i=t-n;return E?S(i,_-r):i}function c(e){var n=e-b,r=e-w;return b===void 0||n>=t||n<0||E&&r>=_}function u(){var e=C();return c(e)?d(e):void(y=setTimeout(u,o(e)))}function d(e){return y=void 0,D&&h?r(e):(h=g=void 0,v)}function f(){y!==void 0&&clearTimeout(y),w=0,h=b=g=y=void 0}function p(){return y===void 0?v:d(C())}function m(){var e=C(),n=c(e);if(h=arguments,g=this,b=e,n){if(y===void 0)return a(b);if(E)return y=setTimeout(u,t),r(b)}return y===void 0&&(y=setTimeout(u,t)),v}var h,g,_,v,y,b,w=0,T=!1,E=!1,D=!0;if(typeof e!=`function`)throw TypeError(l);return t=s(t)||0,i(n)&&(T=!!n.leading,E=`maxWait`in n,_=E?x(s(n.maxWait)||0,t):_,D=`trailing`in n?!!n.trailing:D),m.cancel=f,m.flush=p,m}function r(e,t,r){var a=!0,o=!0;if(typeof e!=`function`)throw TypeError(l);return i(r)&&(a=`leading`in r?!!r.leading:a,o=`trailing`in r?!!r.trailing:o),n(e,t,{leading:a,maxWait:t,trailing:o})}function i(e){var t=e===void 0?`undefined`:c(e);return!!e&&(t==`object`||t==`function`)}function a(e){return!!e&&(e===void 0?`undefined`:c(e))==`object`}function o(e){return(e===void 0?`undefined`:c(e))==`symbol`||a(e)&&b.call(e)==d}function s(e){if(typeof e==`number`)return e;if(o(e))return u;if(i(e)){var t=typeof e.valueOf==`function`?e.valueOf():e;e=i(t)?t+``:t}if(typeof e!=`string`)return e===0?e:+e;e=e.replace(f,``);var n=m.test(e);return n||h.test(e)?g(e.slice(2),n?2:8):p.test(e)?u:+e}var c=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},l=`Expected a function`,u=NaN,d=`[object Symbol]`,f=/^\s+|\s+$/g,p=/^[-+]0x[0-9a-f]+$/i,m=/^0b[01]+$/i,h=/^0o[0-7]+$/i,g=parseInt,_=(t===void 0?`undefined`:c(t))==`object`&&t&&t.Object===Object&&t,v=(typeof self>`u`?`undefined`:c(self))==`object`&&self&&self.Object===Object&&self,y=_||v||Function(`return this`)(),b=Object.prototype.toString,x=Math.max,S=Math.min,C=function(){return y.Date.now()};e.exports=r}).call(t,function(){return this}())},function(e,t){(function(t){function n(e,t,n){function i(t){var n=h,r=g;return h=g=void 0,w=t,v=e.apply(r,n)}function a(e){return w=e,y=setTimeout(u,t),T?i(e):v}function s(e){var n=e-C,r=e-w,i=t-n;return E?x(i,_-r):i}function l(e){var n=e-C,r=e-w;return C===void 0||n>=t||n<0||E&&r>=_}function u(){var e=S();return l(e)?d(e):void(y=setTimeout(u,s(e)))}function d(e){return y=void 0,D&&h?i(e):(h=g=void 0,v)}function f(){y!==void 0&&clearTimeout(y),w=0,h=C=g=y=void 0}function p(){return y===void 0?v:d(S())}function m(){var e=S(),n=l(e);if(h=arguments,g=this,C=e,n){if(y===void 0)return a(C);if(E)return y=setTimeout(u,t),i(C)}return y===void 0&&(y=setTimeout(u,t)),v}var h,g,_,v,y,C,w=0,T=!1,E=!1,D=!0;if(typeof e!=`function`)throw TypeError(c);return t=o(t)||0,r(n)&&(T=!!n.leading,E=`maxWait`in n,_=E?b(o(n.maxWait)||0,t):_,D=`trailing`in n?!!n.trailing:D),m.cancel=f,m.flush=p,m}function r(e){var t=e===void 0?`undefined`:s(e);return!!e&&(t==`object`||t==`function`)}function i(e){return!!e&&(e===void 0?`undefined`:s(e))==`object`}function a(e){return(e===void 0?`undefined`:s(e))==`symbol`||i(e)&&y.call(e)==u}function o(e){if(typeof e==`number`)return e;if(a(e))return l;if(r(e)){var t=typeof e.valueOf==`function`?e.valueOf():e;e=r(t)?t+``:t}if(typeof e!=`string`)return e===0?e:+e;e=e.replace(d,``);var n=p.test(e);return n||m.test(e)?h(e.slice(2),n?2:8):f.test(e)?l:+e}var s=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},c=`Expected a function`,l=NaN,u=`[object Symbol]`,d=/^\s+|\s+$/g,f=/^[-+]0x[0-9a-f]+$/i,p=/^0b[01]+$/i,m=/^0o[0-7]+$/i,h=parseInt,g=(t===void 0?`undefined`:s(t))==`object`&&t&&t.Object===Object&&t,_=(typeof self>`u`?`undefined`:s(self))==`object`&&self&&self.Object===Object&&self,v=g||_||Function(`return this`)(),y=Object.prototype.toString,b=Math.max,x=Math.min,S=function(){return v.Date.now()};e.exports=n}).call(t,function(){return this}())},function(e,t){function n(e){var t=void 0,r=void 0;for(t=0;t<e.length;t+=1)if(r=e[t],r.dataset&&r.dataset.aos||r.children&&n(r.children))return!0;return!1}function r(){return window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver}function i(){return!!r()}function a(e,t){var n=window.document,i=new(r())(o);s=t,i.observe(n.documentElement,{childList:!0,subtree:!0,removedNodes:!0})}function o(e){e&&e.forEach(function(e){var t=Array.prototype.slice.call(e.addedNodes),r=Array.prototype.slice.call(e.removedNodes);if(n(t.concat(r)))return s()})}Object.defineProperty(t,`__esModule`,{value:!0});var s=function(){};t.default={isSupported:i,ready:a}},function(e,t){function n(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function r(){return navigator.userAgent||navigator.vendor||window.opera||``}Object.defineProperty(t,`__esModule`,{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,o=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,s=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,c=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;t.default=new(function(){function e(){n(this,e)}return i(e,[{key:`phone`,value:function(){var e=r();return!(!a.test(e)&&!o.test(e.substr(0,4)))}},{key:`mobile`,value:function(){var e=r();return!(!s.test(e)&&!c.test(e.substr(0,4)))}},{key:`tablet`,value:function(){return this.mobile()&&!this.phone()}}]),e}())},function(e,t){Object.defineProperty(t,`__esModule`,{value:!0});var n=function(e,t,n){var r=e.node.getAttribute(`data-aos-once`);t>e.position?e.node.classList.add(`aos-animate`):r!==void 0&&(r===`false`||!n&&r!==`true`)&&e.node.classList.remove(`aos-animate`)};t.default=function(e,t){var r=window.pageYOffset,i=window.innerHeight;e.forEach(function(e,a){n(e,i+r,t)})}},function(e,t,n){function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,`__esModule`,{value:!0});var i=r(n(12));t.default=function(e,t){return e.forEach(function(e,n){e.node.classList.add(`aos-init`),e.position=(0,i.default)(e.node,t.offset)}),e}},function(e,t,n){function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,`__esModule`,{value:!0});var i=r(n(13));t.default=function(e,t){var n=0,r=0,a=window.innerHeight,o={offset:e.getAttribute(`data-aos-offset`),anchor:e.getAttribute(`data-aos-anchor`),anchorPlacement:e.getAttribute(`data-aos-anchor-placement`)};switch(o.offset&&!isNaN(o.offset)&&(r=parseInt(o.offset)),o.anchor&&document.querySelectorAll(o.anchor)&&(e=document.querySelectorAll(o.anchor)[0]),n=(0,i.default)(e).top,o.anchorPlacement){case`top-bottom`:break;case`center-bottom`:n+=e.offsetHeight/2;break;case`bottom-bottom`:n+=e.offsetHeight;break;case`top-center`:n+=a/2;break;case`bottom-center`:n+=a/2+e.offsetHeight;break;case`center-center`:n+=a/2+e.offsetHeight/2;break;case`top-top`:n+=a;break;case`bottom-top`:n+=e.offsetHeight+a;break;case`center-top`:n+=e.offsetHeight/2+a}return o.anchorPlacement||o.offset||isNaN(t)||(r=t),n+r}},function(e,t){Object.defineProperty(t,`__esModule`,{value:!0}),t.default=function(e){for(var t=0,n=0;e&&!isNaN(e.offsetLeft)&&!isNaN(e.offsetTop);)t+=e.offsetLeft-(e.tagName==`BODY`?0:e.scrollLeft),n+=e.offsetTop-(e.tagName==`BODY`?0:e.scrollTop),e=e.offsetParent;return{top:n,left:t}}},function(e,t){Object.defineProperty(t,`__esModule`,{value:!0}),t.default=function(e){return e||=document.querySelectorAll(`[data-aos]`),Array.prototype.map.call(e,function(e){return{node:e}})}}])})})),u=c(l(),1),d=JSON.parse(localStorage.getItem(`almas_cart`))||[];function f(){if(document.getElementById(`cart-drawer-overlay`))return;let e=document.createElement(`div`);e.id=`notification-toast`,e.className=`notification-toast`,e.innerHTML=`
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
  `,document.body.appendChild(e);let t=e.querySelector(`#notification-toast-close`);t&&t.addEventListener(`click`,()=>{e.classList.remove(`show`)});let n=e.querySelector(`#notification-view-cart`);n&&n.addEventListener(`click`,t=>{t.preventDefault(),e.classList.remove(`show`),w()});let r=document.createElement(`div`);r.id=`cart-drawer-overlay`,document.body.appendChild(r);let i=document.createElement(`div`);i.id=`cart-drawer`,i.innerHTML=`
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
        <span>Estimated Tax (14%)</span>
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
  `,document.body.appendChild(i);let a=document.createElement(`div`);a.id=`customization-modal-overlay`,a.innerHTML=`
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
  `,document.body.appendChild(a);let o=document.createElement(`div`);o.id=`mobile-floating-cart`,o.className=`mobile-floating-cart`,o.addEventListener(`click`,e=>{e.preventDefault(),w()}),document.body.appendChild(o),p(),g()}function p(){let e=document.getElementById(`cart-drawer-overlay`),t=document.getElementById(`cart-drawer`),n=document.getElementById(`close-cart-btn`),r=()=>{e.classList.remove(`open`),t.classList.remove(`open`),E(!1)};e.addEventListener(`click`,r),n.addEventListener(`click`,r),document.querySelectorAll(`.nav-cart-btn`).forEach(e=>{e.addEventListener(`click`,e=>{e.preventDefault(),w()})})}var m=null,h=1;function g(){let e=document.getElementById(`customization-modal-overlay`),t=document.getElementById(`modal-close-x`),n=document.getElementById(`qty-dec`),r=document.getElementById(`qty-inc`),i=document.getElementById(`qty-val`),a=document.getElementById(`modal-add-btn`),o=()=>{e.classList.remove(`open`),m=null};e.addEventListener(`click`,t=>{t.target===e&&o()}),t.addEventListener(`click`,o),n.addEventListener(`click`,()=>{h>1&&(h--,i.textContent=h)}),r.addEventListener(`click`,()=>{h++,i.textContent=h}),a.addEventListener(`click`,()=>{if(!m)return;let e=document.getElementById(`modal-special-notes`).value.trim();v(m,h,``,e),o()})}function _(e){f(),m=e,h=1,document.getElementById(`modal-item-img`).src=e.image,document.getElementById(`modal-item-name`).textContent=e.name,document.getElementById(`modal-item-price`).textContent=`$${parseFloat(e.price).toFixed(2)}`,document.getElementById(`modal-special-notes`).value=``,document.getElementById(`qty-val`).textContent=`1`,document.getElementById(`customization-modal-overlay`).classList.add(`open`)}function v(e,t=1,n=`Mild`,r=``){let i=d.findIndex(t=>t.id===e.id&&t.spice===n&&t.note===r);i>-1?d[i].qty+=t:d.push({id:e.id,name:e.name,price:parseFloat(e.price),image:e.image,spice:n,note:r,qty:t}),x(),E(),C(e.name,!0,e.image)}function y(e,t){t<=0?d.splice(e,1):d[e].qty=t,x(),D(),E()}function b(){d=[],x(),D(),E()}function x(){localStorage.setItem(`almas_cart`,JSON.stringify(d))}function S(){return d}function C(e,t=!1,n=``){f();let r=document.getElementById(`notification-toast`),i=document.getElementById(`notification-toast-img-container`),a=document.getElementById(`notification-toast-img`),o=document.getElementById(`notification-toast-status`),s=document.getElementById(`notification-text`),c=document.getElementById(`notification-toast-action-container`);r&&s&&(t?(n&&a&&i?(a.src=n,i.style.display=`block`):i&&(i.style.display=`none`),o&&(o.innerHTML=`<span class="status-dot"></span> SUCCESS`,o.style.display=`flex`),s.textContent=e,c&&(c.style.display=`flex`)):(i&&(i.style.display=`none`),o&&(o.innerHTML=`Notification 🔔`,o.style.display=`block`),s.textContent=e,c&&(c.style.display=`none`)),r.classList.add(`show`),r.timeoutId&&clearTimeout(r.timeoutId),r.timeoutId=setTimeout(()=>{r.classList.remove(`show`)},4e3))}function w(){f();let e=document.getElementById(`cart-drawer-overlay`),t=document.getElementById(`cart-drawer`);if(e&&t){e.classList.add(`open`),t.classList.add(`open`),D();let n=document.getElementById(`mobile-floating-cart`);n&&n.classList.remove(`visible`)}}function T(){let e=d.reduce((e,t)=>e+t.price*t.qty,0),t=e*.14;return{subtotal:e,tax:t,total:e+t}}function E(e=!0){let t=d.reduce((e,t)=>e+t.qty,0),{subtotal:n}=T();document.querySelectorAll(`.cart-count-badge`).forEach(n=>{t>0?(n.textContent=t,n.classList.add(`visible`),e&&(n.classList.remove(`bump`),n.offsetWidth,n.classList.add(`bump`))):(n.classList.remove(`visible`),n.classList.remove(`bump`))});let r=document.getElementById(`mobile-floating-cart`);r&&(t>0?(r.innerHTML=`
        <div class="floating-cart-content">
          <div class="floating-cart-icon-wrapper">
            <svg class="floating-cart-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span class="floating-cart-badge">${t}</span>
          </div>
          <span class="floating-cart-text">VIEW CART</span>
          <span class="floating-cart-price">$${n.toFixed(2)}</span>
        </div>
      `,r.classList.add(`visible`)):r.classList.remove(`visible`))}function D(){f();let e=document.getElementById(`cart-drawer-items-list`),t=document.getElementById(`checkout-drawer-btn`);if(d.length===0){e.innerHTML=`
      <div class="cart-empty-state">
        <svg style="width:48px; height:48px; opacity:0.4;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <p style="font-size:0.9rem; font-weight:600; color:rgba(255,255,255,0.4);">Your cart is empty.</p>
        <a href="/products.html" style="margin-top:0.5rem; color:#CC5500; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; border-bottom:1.5px solid #CC5500; padding-bottom:2px; text-decoration:none;">View Products</a>
      </div>
    `,t.style.opacity=`0.5`,t.style.pointerEvents=`none`,document.getElementById(`cart-subtotal`).textContent=`$0.00`,document.getElementById(`cart-tax`).textContent=`$0.00`,document.getElementById(`cart-grand-total`).textContent=`$0.00`;return}t.style.opacity=`1`,t.style.pointerEvents=`all`,e.innerHTML=d.map((e,t)=>{let n=[];e.spice&&n.push(`Spice: ${e.spice}`),e.note&&n.push(`Note: ${e.note}`);let r=n.length>0?`<div style="font-size:0.75rem; color:rgba(255,255,255,0.45); font-style:italic; margin-top:0.25rem;">${n.join(` | `)}</div>`:``;return`
      <div class="cart-item">
        <img src="${e.image}" alt="${e.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-name">${e.name}</div>
          ${r}
          <div class="cart-qty-controls">
            <button class="cart-qty-btn dec-qty" data-idx="${t}">-</button>
            <span class="cart-qty-num">${e.qty}</span>
            <button class="cart-qty-btn inc-qty" data-idx="${t}">+</button>
          </div>
        </div>
        <div class="cart-item-price">$${(e.price*e.qty).toFixed(2)}</div>
      </div>
    `}).join(``),e.querySelectorAll(`.dec-qty`).forEach(e=>{e.addEventListener(`click`,e=>{let t=parseInt(e.target.dataset.idx);y(t,d[t].qty-1)})}),e.querySelectorAll(`.inc-qty`).forEach(e=>{e.addEventListener(`click`,e=>{let t=parseInt(e.target.dataset.idx);y(t,d[t].qty+1)})});let{subtotal:n,tax:r,total:i}=T();document.getElementById(`cart-subtotal`).textContent=`$${n.toFixed(2)}`,document.getElementById(`cart-tax`).textContent=`$${r.toFixed(2)}`,document.getElementById(`cart-grand-total`).textContent=`$${i.toFixed(2)}`}document.addEventListener(`DOMContentLoaded`,()=>{f(),E(!1)}),window.showAuthToast=function(e,t=`/account.html?tab=login`){if(document.querySelector(`.almas-toast-overlay`))return;let n=document.createElement(`div`);if(n.className=`almas-toast-overlay`,!document.getElementById(`almas-toast-styles`)){let e=document.createElement(`style`);e.id=`almas-toast-styles`,e.textContent=`
      .almas-toast-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(15, 6, 0, 0.7);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .almas-toast-card {
        background: linear-gradient(135deg, #1c0e06 0%, #0a0401 100%);
        border: 1px solid rgba(212, 175, 55, 0.25);
        border-radius: 24px;
        padding: 32px 24px;
        width: 420px;
        max-width: 90%;
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.1);
        text-align: center;
        position: relative;
        overflow: hidden;
        transform: scale(0.9) translateY(20px);
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-sizing: border-box;
      }
      .almas-toast-icon-container {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: rgba(212, 175, 55, 0.1);
        border: 1px solid rgba(212, 175, 55, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
      }
      .almas-toast-icon {
        font-size: 28px;
        line-height: 1;
        animation: almas-lock-pulse 1.8s infinite ease-in-out;
      }
      .almas-toast-title {
        font-family: 'Playfair Display', serif;
        color: #D4AF37;
        font-size: 1.4rem;
        font-weight: 700;
        margin: 0 0 10px;
        letter-spacing: 0.03em;
      }
      .almas-toast-message {
        color: rgba(255, 255, 255, 0.75);
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        line-height: 1.5;
        margin: 0 0 24px;
      }
      .almas-toast-progress-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 5px;
        background: rgba(255, 255, 255, 0.05);
      }
      .almas-toast-progress {
        height: 100%;
        background: linear-gradient(90deg, #CC5500 0%, #D4AF37 100%);
        width: 100%;
        animation: almas-toast-countdown 2s linear forwards;
      }
      @keyframes almas-lock-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); box-shadow: 0 0 12px rgba(212,175,55,0.2); }
        100% { transform: scale(1); }
      }
      @keyframes almas-toast-countdown {
        from { width: 100%; }
        to { width: 0%; }
      }
    `,document.head.appendChild(e)}n.innerHTML=`
    <div class="almas-toast-card">
      <div class="almas-toast-icon-container">
        <span class="almas-toast-icon">🔐</span>
      </div>
      <h4 class="almas-toast-title">Access Restricted</h4>
      <p class="almas-toast-message">${e}</p>
      <div class="almas-toast-progress-bar">
        <div class="almas-toast-progress"></div>
      </div>
    </div>
  `,document.body.appendChild(n),requestAnimationFrame(()=>{n.style.opacity=`1`;let e=n.querySelector(`.almas-toast-card`);e&&(e.style.transform=`scale(1) translateY(0)`)}),setTimeout(()=>{n.style.opacity=`0`;let e=n.querySelector(`.almas-toast-card`);e&&(e.style.transform=`scale(0.9) translateY(-20px)`),setTimeout(()=>{n.remove(),window.location.href=t},300)},2e3)},u.default.init({duration:800,easing:`ease-in-out`,once:!0,mirror:!1});function O(){let e=document.getElementById(`splash-screen`);if(e){if(sessionStorage.getItem(`splash-shown`)){e.style.display=`none`,e.classList.add(`hidden`),document.body.classList.remove(`loading`);return}document.body.classList.add(`loading`),setTimeout(()=>{e.classList.add(`hidden`),document.body.classList.remove(`loading`),sessionStorage.setItem(`splash-shown`,`true`),setTimeout(()=>{u.default.refresh()},400)},2500)}}document.addEventListener(`DOMContentLoaded`,()=>{O();let e=document.getElementById(`mobile-auth-group`);if(e){let t=JSON.parse(localStorage.getItem(`almas_account`));t&&t.name?e.innerHTML=`
        <a href="/account.html" class="${window.location.pathname.includes(`account.html`)||window.location.pathname.endsWith(`/account`)?`text-primary`:`hover:text-primary`} transition-colors" style="color: #D4AF37;">My Account</a>
      `:e.innerHTML=`
        <a href="/account.html?tab=login" class="hover:text-primary transition-colors">Sign In / Sign Up</a>
      `}let t=document.getElementById(`desktop-auth-group`);if(t){let e=JSON.parse(localStorage.getItem(`almas_account`));e&&e.name?t.innerHTML=`
        <a href="/account.html" class="nav-signin-btn" title="My Account">
          <div class="nav-signin-avatar">${e.name.charAt(0).toUpperCase()}</div>
          <span>Account</span>
        </a>
      `:t.innerHTML=`
        <a href="/account.html?tab=login" class="nav-signin-btn" title="Sign In">
          <div class="nav-signin-avatar" style="background:#4A4A4A;">
            <svg class="nav-signin-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 12c2.667 0 8 1.333 8 4v2H4v-2c0-2.667 5.333-4 8-4zm0-2a4 4 0 110-8 4 4 0 010 8z"/>
            </svg>
          </div>
          <span>Sign In</span>
        </a>
      `}if(!document.querySelector(`.announcement-bar`)){let e=document.createElement(`div`);e.className=`announcement-bar`,e.innerHTML=`
      <div class="marquee-wrapper">
        <div class="marquee-content" id="announcement-marquee-content">
          <span class="marquee-item">100% NATURAL AND FORM FRESH EVERY DAY • ALMAS THE QUALITY CHOICE • FREE DELIVERY ON ORDERS OVER $50 • GET 10% OFF ON YOUR FIRST ORDER USE CODE: ALMAS10 •</span>
          <span class="marquee-item">100% NATURAL AND FORM FRESH EVERY DAY • ALMAS THE QUALITY CHOICE • FREE DELIVERY ON ORDERS OVER $50 • GET 10% OFF ON YOUR FIRST ORDER USE CODE: ALMAS10 •</span>
        </div>
      </div>
    `,document.body.insertBefore(e,document.body.firstChild)}let n=document.querySelector(`.glass-nav .lg\\:hidden.space-x-3`);if(n&&!document.getElementById(`mobile-auth-group-header`)){let e=document.createElement(`div`);e.id=`mobile-auth-group-header`;let t=JSON.parse(localStorage.getItem(`almas_account`));t&&t.name?e.innerHTML=`
        <a href="/account.html" class="nav-signin-btn" title="My Account" style="display: flex !important; justify-content: center !important; align-items: center !important; width: 44px !important; height: 44px !important;">
          <div class="nav-signin-avatar" style="width: 32px !important; height: 32px !important; font-size: 0.85rem !important;">${t.name.charAt(0).toUpperCase()}</div>
        </a>
      `:e.innerHTML=`
        <a href="/account.html?tab=login" class="nav-signin-btn" title="Sign In" style="display: flex !important; justify-content: center !important; align-items: center !important; width: 44px !important; height: 44px !important;">
          <div class="nav-signin-avatar" style="background:#1A1A1A; width: 32px !important; height: 32px !important;">
            <svg class="nav-signin-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="width: 1.1rem; height: 1.1rem;">
              <path d="M12 12c2.667 0 8 1.333 8 4v2H4v-2c0-2.667 5.333-4 8-4zm0-2a4 4 0 110-8 4 4 0 010 8z"/>
            </svg>
          </div>
        </a>
      `,n.appendChild(e)}let r=document.getElementById(`menu-btn`),i=document.getElementById(`mobile-menu`),a=document.getElementById(`close-btn`),o=document.getElementById(`menu-overlay`);function s(){i&&(i.classList.add(`open`),o&&o.classList.add(`open`),document.body.style.overflow=`hidden`)}function c(){i&&(i.classList.remove(`open`),o&&o.classList.remove(`open`),document.body.style.overflow=``)}if(r&&r.addEventListener(`click`,s),a&&a.addEventListener(`click`,c),o&&o.addEventListener(`click`,c),i){let e=window.location.pathname;i.querySelectorAll(`a`).forEach(t=>{t.addEventListener(`click`,c);let n=t.getAttribute(`href`);if(n){let r=e===`/`||e===`/index.html`||e.endsWith(`/`);(r&&(n===`/`||n===`/index.html`||n===`index.html`)||!r&&n!==`/`&&n!==`index.html`&&e.includes(n))&&t.classList.add(`active-mobile`)}})}let l=document.getElementById(`get-location`),u=document.getElementById(`event-address`);l&&u&&l.addEventListener(`click`,()=>{navigator.geolocation?(l.textContent=`Fetching...`,navigator.geolocation.getCurrentPosition(e=>{let{latitude:t,longitude:n}=e.coords;u.value=`📍 Coordinates: ${t.toFixed(6)}, ${n.toFixed(6)} (Sharing precise location)`,l.textContent=`Location Shared`,l.classList.add(`bg-primary`,`text-white`)},e=>{console.error(`Error fetching location:`,e),l.textContent=`Error`,alert(`Unable to fetch location. Please type your address manually.`)})):alert(`Geolocation is not supported by your browser.`)});function d(e){let t=e.trim();if(!t)return;let n=document.getElementById(`product-search`),r=document.getElementById(`menu-search-input`);n?(n.value=t,n.dispatchEvent(new Event(`input`)),setTimeout(()=>{let e=document.querySelectorAll(`.card-premium:not([style*="display: none"])`);e.length>0?(e[0].scrollIntoView({behavior:`smooth`,block:`center`}),e[0].classList.add(`highlight-premium`),setTimeout(()=>{e[0].classList.remove(`highlight-premium`)},2500)):n.scrollIntoView({behavior:`smooth`,block:`center`})},150)):r?(r.value=t,r.dispatchEvent(new Event(`input`)),setTimeout(()=>{let e=document.querySelectorAll(`.menu-item-row:not(.search-hidden)`);e.length>0?(e[0].scrollIntoView({behavior:`smooth`,block:`center`}),e[0].classList.add(`highlight-premium`),setTimeout(()=>{e[0].classList.remove(`highlight-premium`)},2500)):r.scrollIntoView({behavior:`smooth`,block:`center`})},150)):window.location.href=`/products.html?search=${encodeURIComponent(t)}`}let f=document.getElementById(`mobile-search-btn`),p=document.getElementById(`mobile-search-bar`),m=document.getElementById(`mobile-search-input`),h=document.getElementById(`mobile-search-clear`);if(f&&p&&m){f.addEventListener(`click`,()=>{p.classList.toggle(`hidden`),p.classList.contains(`hidden`)||m.focus()}),h&&h.addEventListener(`click`,()=>{m.value=``,m.focus(),m.dispatchEvent(new Event(`input`))}),m.addEventListener(`input`,e=>{let t=e.target.value,n=document.getElementById(`product-search`),r=document.getElementById(`menu-search-input`);n?(n.value=t,n.dispatchEvent(new Event(`input`))):r&&(r.value=t,r.dispatchEvent(new Event(`input`)))}),m.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),d(m.value))});let e=document.querySelector(`#mobile-search-bar span.absolute`);e&&(e.style.cursor=`pointer`,e.addEventListener(`click`,()=>{d(m.value)}))}let g=new URLSearchParams(window.location.search),_=g.get(`search`);_&&d(decodeURIComponent(_).trim());let v=document.getElementById(`desktop-search-input`),y=document.querySelector(`.desktop-search-icon`);v&&(v.addEventListener(`input`,e=>{let t=e.target.value,n=document.getElementById(`product-search`),r=document.getElementById(`menu-search-input`);n?(n.value=t,n.dispatchEvent(new Event(`input`))):r&&(r.value=t,r.dispatchEvent(new Event(`input`)))}),v.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),d(v.value))})),y&&v&&(y.style.cursor=`pointer`,y.addEventListener(`click`,()=>{d(v.value)}));let b=document.getElementById(`service-type`),x=window.location.hash===`#contact-section`||window.location.hash===`#reservation-form`;(g.get(`type`)===`reservation`||x)&&b&&(b.value=`Table Reservation`,setTimeout(()=>{let e=document.getElementById(`contact-section`);e&&e.scrollIntoView({behavior:`smooth`,block:`start`})},450));async function S(){try{let e=await fetch(`/api/settings`);if(!e.ok)return;let t=await e.json();if(t.marquee){let e=document.getElementById(`announcement-marquee-content`);e&&(e.innerHTML=`
            <span class="marquee-item">${t.marquee}</span>
            <span class="marquee-item">${t.marquee}</span>
          `)}if(t.timings){let e=Array.from(document.querySelectorAll(`h4`)).find(e=>e.textContent.trim().toLowerCase()===`hours`);if(e){let n=e.nextElementSibling;n&&(n.innerHTML=`
              <li class="flex justify-between"><span>Mon - Thu</span> <span>${t.timings.mon_thu}</span></li>
              <li class="flex justify-between"><span>Fri - Sat</span> <span>${t.timings.fri_sat}</span></li>
              <li class="flex justify-between text-primary"><span>Sunday</span> <span>${t.timings.sun}</span></li>
            `)}}if(t.whatsapp){let e=t.whatsapp.replace(/[^0-9]/g,``),n=document.querySelector(`.whatsapp-float`);n&&(n.href=`https://wa.me/${e}`),document.querySelectorAll(`footer li`).forEach(e=>{(e.textContent.includes(`WHATSAPP:`)||e.textContent.includes(`TBD`))&&e.textContent.toUpperCase().includes(`WHATSAPP`)&&(e.textContent=`WHATSAPP: ${t.whatsapp}`)})}if(t.socials){let e=document.querySelector(`.footer-social-links`);e&&(e.innerHTML=`
            <a href="${t.socials.instagram||`#`}" target="_blank" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group" aria-label="Instagram">
              <svg class="w-5 h-5 text-white/40 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="${t.socials.facebook||`#`}" target="_blank" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group" aria-label="Facebook">
              <svg class="w-5 h-5 text-white/40 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
            <a href="${t.socials.tiktok||`#`}" target="_blank" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group" aria-label="TikTok">
              <svg class="w-5 h-5 text-white/40 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/></svg>
            </a>
            <a href="${t.socials.google_page||`#`}" target="_blank" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group" aria-label="Google Page">
              <svg class="w-5 h-5 text-white/40 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.327 0-6.031-2.704-6.031-6.031s2.704-6.031 6.031-6.031c1.527 0 2.918.572 3.99 1.503l3.203-3.203C19.23 2.115 15.934 1 12.24 1 6.033 1 12.24 10.285c6.478 0 11.24 4.555 11.24 11.24 0 .768-.068 1.516-.188 2.24H12.24z"/></svg>
            </a>
            <a href="${t.socials.trip_advisor||`#`}" target="_blank" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group" aria-label="TripAdvisor">
              <svg class="w-5 h-5 text-white/40 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.38 0 0 5.38 0 12s5.38 12 12 12 12-5.38 12-12S18.62 0 12 0zm-3.23 18.06c-1.39 0-2.52-1.13-2.52-2.52 0-1.39 1.13-2.52 2.52-2.52 1.39 0 2.52 1.13 2.52 2.52 0 1.39-1.13 2.52-2.52 2.52zm.05-7.79c-.76 0-1.38-.62-1.38-1.38 0-.76.62-1.38 1.38-1.38.76 0 1.38.62 1.38 1.38 0 .76-.62 1.38-1.38 1.38zm6.41 7.79c-1.39 0-2.52-1.13-2.52-2.52 0-1.39 1.13-2.52 2.52-2.52 1.39 0 2.52 1.13 2.52 2.52 0 1.39-1.13 2.52-2.52 2.52zm-.05-7.79c-.76 0-1.38-.62-1.38-1.38 0-.76.62-1.38 1.38-1.38.76 0 1.38.62 1.38 1.38 0 .76-.62 1.38-1.38 1.38z"/></svg>
            </a>
          `);let n=document.querySelector(`#mobile-menu .flex.space-x-4`);n&&n.querySelectorAll(`a`).forEach(e=>{let n=e.href||``;n.includes(`instagram.com`)||n.includes(`instagram`)?t.socials.instagram&&(e.href=t.socials.instagram):n.includes(`facebook.com`)||n.includes(`facebook`)?t.socials.facebook&&(e.href=t.socials.facebook):(n.includes(`tiktok.com`)||n.includes(`tiktok`))&&t.socials.tiktok&&(e.href=t.socials.tiktok)})}let n=document.querySelector(`.footer-bottom-container p`)||document.querySelector(`footer .max-w-7xl + .border-t p`)||document.querySelector(`footer p`);if(n&&(n.innerHTML=`&copy; 2024 ALMAS INDIAN CUISINE. Developed by <a href="https://www.codtechitsolutions.com/" target="_blank" style="color:#D4AF37; text-decoration: underline; font-weight: 600;">CODTECH IT SOLUTION</a>.`),t.delivery){let e=document.getElementById(`partner-link-uber`);e&&t.delivery.uber_eats&&(e.href=t.delivery.uber_eats);let n=document.getElementById(`partner-link-doordash`);n&&t.delivery.doordash&&(n.href=t.delivery.doordash);let r=document.getElementById(`partner-link-skip`);r&&t.delivery.skip&&(r.href=t.delivery.skip)}}catch(e){console.error(`Error loading global configurations:`,e)}}S();function C(){let e=JSON.parse(localStorage.getItem(`almas_account`)),t=document.getElementById(`desktop-auth-group`);if(t)if(e&&e.name){let n=e.name.charAt(0).toUpperCase();t.innerHTML=`
          <a href="/account.html" class="nav-signin-btn" title="My Account">
            <div class="nav-signin-avatar">${e.avatar?`<img src="${e.avatar}" alt="${e.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`:n}</div>
            <span>Account</span>
          </a>
        `}else t.innerHTML=`
          <a href="/account.html?tab=login" class="nav-signin-btn" title="Sign In">
            <div class="nav-signin-avatar" style="background:#4A4A4A;">
              <svg class="nav-signin-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 12c2.667 0 8 1.333 8 4v2H4v-2c0-2.667 5.333-4 8-4zm0-2a4 4 0 110-8 4 4 0 010 8z"/>
              </svg>
            </div>
            <span>Sign In</span>
          </a>
        `;let n=document.getElementById(`mobile-auth-group`);n&&(e&&e.name?n.innerHTML=`
          <a href="/account.html" class="${window.location.pathname.includes(`account`)?`text-primary`:`hover:text-primary`} transition-colors" style="color: #D4AF37;">My Account</a>
        `:n.innerHTML=`
          <a href="/account.html?tab=login" class="hover:text-primary transition-colors">Sign In / Sign Up</a>
        `);let r=document.getElementById(`mobile-auth-group-header`);if(r)if(e&&e.name){let t=e.name.charAt(0).toUpperCase();r.innerHTML=`
          <a href="/account.html" class="nav-signin-btn" title="My Account" style="display:flex!important;justify-content:center!important;align-items:center!important;width:44px!important;height:44px!important;">
            <div class="nav-signin-avatar" style="width:32px!important;height:32px!important;font-size:0.85rem!important;">
              ${e.avatar?`<img src="${e.avatar}" alt="${e.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`:t}
            </div>
          </a>
        `}else r.innerHTML=`
          <a href="/account.html?tab=login" class="nav-signin-btn" title="Sign In" style="display:flex!important;justify-content:center!important;align-items:center!important;width:44px!important;height:44px!important;">
            <div class="nav-signin-avatar" style="background:#1A1A1A;width:32px!important;height:32px!important;">
              <svg class="nav-signin-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="width:1.1rem;height:1.1rem;">
                <path d="M12 12c2.667 0 8 1.333 8 4v2H4v-2c0-2.667 5.333-4 8-4zm0-2a4 4 0 110-8 4 4 0 010 8z"/>
              </svg>
            </div>
          </a>
        `}window.addEventListener(`auth-change`,C),window.addEventListener(`storage`,e=>{(e.key===`almas_account`||e.key===`almas_token`)&&C()})});export{w as a,l as c,T as i,c as l,b as n,_ as o,S as r,y as s,v as t};