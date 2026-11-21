const menuButton=document.querySelector('.menu-toggle');const nav=document.querySelector('#nav');if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'Open navigation':'Close navigation');nav.classList.toggle('open',!open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menuButton.setAttribute('aria-expanded','false');nav.classList.remove('open')}))}

const form = document.getElementById("quote-form");
const statusMessage = document.getElementById("quote-status");

if (form && statusMessage) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const name = new FormData(form).get("name");
    statusMessage.textContent = `Thanks, ${name} — your sample request is ready for review. Nothing has been sent or saved.`;
    form.reset();
  });
  form.hidden = false;
}
