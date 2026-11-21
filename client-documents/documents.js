"use strict";

const documents = [...document.querySelectorAll(".sheet")];
const stageLinks = [...document.querySelectorAll(".stage-links a")];
const stageSelect = document.querySelector("nav select");
const languageLink = document.getElementById("language");
const otherPage = languageLink.getAttribute("href");

function showStage() {
  // A skip link points to the content region, not to a different stage.
  if (location.hash === "#document" && document.body.classList.contains("ready")) return;
  const selected = documents.find(sheet => "#" + sheet.id === location.hash) || documents[0];
  for (const sheet of documents) sheet.hidden = sheet !== selected;
  for (const link of stageLinks) {
    if (link.hash === "#" + selected.id) link.setAttribute("aria-current", "step");
    else link.removeAttribute("aria-current");
  }
  stageSelect.value = selected.id;
  languageLink.href = otherPage + "#" + selected.id;
}

stageSelect.addEventListener("change", () => { location.hash = stageSelect.value; });
for (const button of document.querySelectorAll(".print")) {
  button.addEventListener("click", () => window.print());
  button.hidden = false;
}
window.addEventListener("hashchange", () => {
  showStage();
  if (location.hash !== "#document") document.querySelector(".sheet:not([hidden]) h2").focus({preventScroll: true});
});
showStage();
stageSelect.hidden = false;
document.body.classList.add("ready");
