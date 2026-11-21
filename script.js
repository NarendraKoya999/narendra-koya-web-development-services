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

  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  const contactEmail = "narendra.koya.in@gmail.com";

  if (contactForm) {
    const needSelect = contactForm.elements.namedItem("need");

    contactForm.addEventListener("submit", function (event) {

      event.preventDefault();

      // Read the form values.
      const formData = new FormData(contactForm);

      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const need = needSelect.value ? needSelect.selectedOptions[0].textContent.trim() : "";
      const website = String(formData.get("website") || "").trim();
      const message = String(formData.get("message") || "").trim();

      // Basic validation.
      if (!name || !email || !need) {

        if (formStatus) {
          formStatus.textContent =
            "Please complete the required fields.";
        }

        return;
      }

      // Prepare the email subject.
      const subject =
        "Website enquiry from " + name;

      // Prepare the email body.
      const body = [
        "Hello Narendra,",
        "",
        "I would like to discuss a website project.",
        "",
        "Name: " + name,
        "Email: " + email,
        "Requirement: " + need,
        "Existing website: " + (website || "Not provided"),
        "",
        "Additional information:",
        message || "No additional information provided.",
        "",
        "Thank you."
      ].join("\n");

      // Create the mailto link.
      const mailtoLink =
        "mailto:" + contactEmail +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      if (formStatus) {
        formStatus.textContent =
          "Opening your email application...";
      }

      // Open the visitor's default email application.
      window.location.href = mailtoLink;

    });

    document.querySelectorAll("[data-enquiry]").forEach(function (link) {
      link.addEventListener("click", function () {
        needSelect.value = link.dataset.enquiry;
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