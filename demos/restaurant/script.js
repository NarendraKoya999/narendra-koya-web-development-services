const menuButton=document.querySelector('.menu-toggle');const nav=document.querySelector('#nav');if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'Open navigation':'Close navigation');nav.classList.toggle('open',!open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menuButton.setAttribute('aria-expanded','false');nav.classList.remove('open')}))}document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b===button));document.querySelectorAll('.menu-item').forEach(item=>{item.hidden=button.dataset.filter!=='all'&&item.dataset.category!==button.dataset.filter})}));let items=[];const count=document.querySelector('#basket-count'),panel=document.querySelector('#basket-panel'),list=document.querySelector('#basket-items'),total=document.querySelector('#basket-total');function renderBasket(){count.textContent=items.length;panel.hidden=items.length===0;list.textContent=items.length?items.map(x=>`${x.name} (₹${x.price})`).join(' · '):'No items yet.';total.textContent='₹'+items.reduce((sum,x)=>sum+x.price,0)}document.querySelectorAll('.add-item').forEach(btn=>btn.addEventListener('click',()=>{items.push({name:btn.dataset.name,price:Number(btn.dataset.price)});renderBasket();panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'})}));document.querySelector('#basket-button').addEventListener('click',()=>{panel.hidden=!panel.hidden;if(!panel.hidden)panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'})});document.querySelector('#clear-basket').addEventListener('click',()=>{items=[];renderBasket()});

const form = document.getElementById("booking-form");
const statusMessage = document.getElementById("booking-status");

if (form && statusMessage) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    statusMessage.textContent = "Thanks! This is a demo only. No table has been reserved.";
    form.reset();
  });
  form.hidden = false;
}
