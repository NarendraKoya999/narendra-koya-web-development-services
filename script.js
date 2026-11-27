"use strict";

/* ==========================================
   1. INITIALISE WEBSITE
========================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ========================================
     2. DYNAMIC COPYRIGHT YEAR
  ======================================== */

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* ========================================
     3. MOBILE NAVIGATION
  ======================================== */

  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.getElementById("primary-nav");

  if (menuToggle && primaryNav) {

    function openMenu() {
      primaryNav.classList.add("open");

      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close navigation");
    }

    function closeMenu() {
      primaryNav.classList.remove("open");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    }

    function toggleMenu() {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    // Open or close the mobile navigation.
    menuToggle.addEventListener("click", toggleMenu);

    // Close navigation after clicking a navigation link.
    primaryNav.querySelectorAll("a").forEach(function (link) {

      link.addEventListener("click", function () {
        closeMenu();
      });

    });

    // Close navigation when clicking outside it.
    document.addEventListener("click", function (event) {

      const clickedInsideMenu =
        primaryNav.contains(event.target);

      const clickedToggle =
        menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }

    });

    // Close navigation using Escape.
    document.addEventListener("keydown", function (event) {

      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuToggle.focus();
      }

    });

    menuToggle.closest("header").classList.add("nav-ready");

    // Close mobile navigation when returning to desktop width.
    window.addEventListener("resize", function () {

      if (window.innerWidth > 760) {
        closeMenu();
      }

    });

  }


  /* ========================================
     4. BACK TO TOP FUNCTIONALITY
  ======================================== */

  const backToTop = document.querySelector(".back-top");

  if (backToTop) {

    backToTop.addEventListener("click", function (event) {

      event.preventDefault();

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });

    });

  }


  /* ========================================
     5. CONTACT FORM
  ======================================== */

  // The contact link in index.html is the single source for the WhatsApp Business number.
  const whatsappBase = document.getElementById("whatsapp-contact").href;

  function whatsappUrl(message) {
    return whatsappBase + "?text=" + encodeURIComponent(message).replace(/'/g, "%27");
  }

  function track(eventName, parameters) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, parameters);
    }
  }

  document.querySelectorAll("[data-wa-location]").forEach(function (link) {
    link.href = whatsappUrl(link.dataset.waMessage);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.addEventListener("click", function () {
      track("whatsapp_click", { location: link.dataset.waLocation });
    });
  });

  document.querySelectorAll("[data-demo]").forEach(function (link) {
    link.addEventListener("click", function () {
      track("demo_open", { demo_name: link.dataset.demo });
    });
  });

  const actionBar = document.querySelector(".mobile-actions");
  if (actionBar && "IntersectionObserver" in window) {
    const hero = document.querySelector(".hero");
    const contact = document.getElementById("contact");
    const footer = document.querySelector(".site-footer");
    const mobile = window.matchMedia("(max-width: 760px)");

    function updateActionBar() {
      const beforeContact = contact.getBoundingClientRect().top > window.innerHeight;
      actionBar.hidden = !mobile.matches || hero.getBoundingClientRect().bottom > 0 ||
        !beforeContact || footer.getBoundingClientRect().top <= window.innerHeight;
    }

    const observer = new IntersectionObserver(updateActionBar);
    [hero, contact, footer].forEach(element => observer.observe(element));
    mobile.addEventListener("change", updateActionBar);
    updateActionBar();
  }

  document.querySelectorAll("button[data-copy]").forEach(function (button) {
    const source = document.getElementById(button.dataset.copy);
    const status = button.closest("details, section").querySelector(".copy-status");

    button.addEventListener("click", async function () {
      const isDraft = source instanceof HTMLTextAreaElement;
      const text = isDraft ? source.value : source.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = "Copied to clipboard.";
      } catch {
        if (isDraft) {
          source.focus();
          source.select();
        } else {
          window.getSelection().selectAllChildren(source);
        }
        status.textContent = "Text selected. Use your device’s Copy command.";
      }
    });
    button.hidden = false;
  });

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const status = document.getElementById("form-status");
    const preview = document.getElementById("draft-preview");
    const draftText = document.getElementById("draft-text");
    const need = contactForm.elements.namedItem("need");
    const heading = document.getElementById("draft-heading");
    const gmail = document.getElementById("draft-gmail");
    const emailApp = document.getElementById("draft-app");
    const recipient = document.getElementById("contact-address").textContent.trim();
    let subject = "";
    let body = "";

    function clearDraft() {
      preview.hidden = true;
      draftText.value = "";
      subject = "";
      body = "";
      status.textContent = "";
      preview.querySelector(".copy-status").textContent = "";
    }

    contactForm.addEventListener("input", clearDraft);
    contactForm.addEventListener("reset", clearDraft);
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const fields = new FormData(contactForm);
      const name = fields.get("name").trim();
      const email = fields.get("email").trim();
      const isWhatsApp = event.submitter?.value !== "email";
      const missingField = !name ? contactForm.elements.namedItem("name")
        : !isWhatsApp && !email ? contactForm.elements.namedItem("email") : null;
      if (missingField) {
        clearDraft();
        missingField.setCustomValidity(!name ? "Enter your name." : "Enter an email address for the email draft.");
        missingField.reportValidity();
        missingField.setCustomValidity("");
        return;
      }

      subject = "Website enquiry from " + name;
      const lines = [
        "Hello Narendra,",
        "",
        "I would like to discuss a website project.",
        "",
        "Name: " + name,
        "Requirement: " + need.selectedOptions[0].textContent.trim()
      ];
      if (email) lines.push("Email: " + email);
      const website = fields.get("website").trim();
      if (website) lines.push("Existing website: " + website);
      const notes = fields.get("notes").trim();
      if (notes) lines.push("", "Additional information:", notes);
      body = lines.join("\n");

      gmail.hidden = isWhatsApp;
      emailApp.hidden = isWhatsApp;
      if (isWhatsApp) {
        heading.textContent = "Your WhatsApp draft";
        draftText.value = body;
        window.open(whatsappUrl(body), "_blank", "noopener,noreferrer");
        track("whatsapp_click", { location: "contact_form" });
      } else {
        heading.textContent = "Your email draft is ready";
        draftText.value = "To: " + recipient + "\nSubject: " + subject + "\n\n" + body;
        track("email_draft_generated", { location: "contact_form" });
      }
      preview.querySelector(".copy-status").textContent = "";
      status.textContent = "";
      preview.hidden = false;
      heading.focus();
    });

    gmail.addEventListener("click", function () {
      const params = new URLSearchParams({view: "cm", fs: "1", to: recipient, su: subject, body});
      window.open("https://mail.google.com/mail/?" + params, "_blank", "noopener,noreferrer");
    });

    emailApp.addEventListener("click", function () {
      window.location.href = "mailto:" + recipient + "?subject=" + encodeURIComponent(subject)
        + "&body=" + encodeURIComponent(body);
    });

    document.querySelectorAll("[data-enquiry]").forEach(function (link) {
      link.addEventListener("click", function () {
        need.value = link.dataset.enquiry;
        clearDraft();
      });
    });
    contactForm.hidden = false;
  }


  /* ========================================
     6. SMOOTH BACK-TO-TOP FALLBACK
  ======================================== */

  // This also supports any additional element
  // given the data-scroll-top attribute.

  document.querySelectorAll("[data-scroll-top]").forEach(function (element) {

    element.addEventListener("click", function (event) {

      event.preventDefault();

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });

    });

  });


  /* ========================================
     7. CLOSE MENU WHEN PAGE NAVIGATION OCCURS
  ======================================== */

  // Prevent the mobile navigation from remaining open
  // after the user navigates to a new page.

  window.addEventListener("pageshow", function () {

    if (menuToggle && primaryNav) {
      primaryNav.classList.remove("open");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    }

  });

});