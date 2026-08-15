// Highlight the current page in the nav based on the document path
(function () {
  var navLinks = document.querySelectorAll(".main-nav a");
  var current = location.pathname.split("/").pop() || "index.html";

  navLinks.forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === current || (current === "index.html" && href === "./")) {
      link.classList.add("active");
    }
  });
})();

// Footer year
(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();

// Mobile nav toggle — nav collapses behind this button under 640px
(function () {
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
  });

  // Collapse again once a link is picked, so it doesn't stay open on navigation
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();
