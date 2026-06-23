(function () {
  var STORAGE_KEY = "ppr2026_drafted";

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function applyDrafted(checkbox, drafted) {
    checkbox.checked = drafted;
    checkbox.closest("tr").classList.toggle("drafted", drafted);
  }

  var state = loadState();

  document.querySelectorAll(".drafted-check").forEach(function (cb) {
    var idx = cb.getAttribute("data-idx");
    applyDrafted(cb, !!state[idx]);

    cb.addEventListener("change", function () {
      if (cb.checked) {
        state[idx] = true;
      } else {
        delete state[idx];
      }
      applyDrafted(cb, cb.checked);
      saveState(state);
    });
  });
})();
