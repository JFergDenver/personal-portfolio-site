// Basic client-side handling for the contact form.
// No backend wired up yet — replace the submit handler with a fetch()
// call to your form endpoint (e.g. Formspree, Netlify Forms, your own API).
(function () {
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      status.textContent = "Please fill out all fields with a valid email.";
      return;
    }

    status.textContent = "Thanks! Your message has been noted.";
    form.reset();
  });
})();
