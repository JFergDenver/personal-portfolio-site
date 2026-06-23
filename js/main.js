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
