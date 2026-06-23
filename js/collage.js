(function () {
  var collage = document.getElementById("collage");
  var layoutSelect = document.getElementById("layout-select");
  var resetBtn = document.getElementById("reset-btn");
  var downloadBtn = document.getElementById("download-btn");

  if (!collage) return;

  var tiles = Array.prototype.slice.call(collage.querySelectorAll(".collage-tile"));
  var images = {}; // slot -> HTMLImageElement

  function applyImageToTile(tile, src) {
    var slot = tile.getAttribute("data-slot");
    tile.style.backgroundImage = "url(" + src + ")";
    tile.classList.add("has-image");
    tile.querySelector(".tile-input").style.pointerEvents = "none";

    var img = new Image();
    img.onload = function () {
      images[slot] = img;
    };
    img.src = src;
  }

  var COLLAGE_FOLDER = "images/collage/";

  function loadConfiguredImages() {
    if (typeof COLLAGE_IMAGES === "undefined") return;

    tiles.forEach(function (tile) {
      var slot = tile.getAttribute("data-slot");
      var filename = COLLAGE_IMAGES[slot];
      if (filename) {
        var src = /^[a-z]+:\/\//i.test(filename) || filename.indexOf("/") !== -1
          ? filename
          : COLLAGE_FOLDER + filename;
        applyImageToTile(tile, src);
      }
    });
  }

  function loadFile(tile, file) {
    if (!file || !file.type.match(/^image\//)) return;

    var reader = new FileReader();

    reader.onload = function (event) {
      applyImageToTile(tile, event.target.result);
    };

    reader.readAsDataURL(file);
  }

  tiles.forEach(function (tile) {
    var input = tile.querySelector(".tile-input");

    input.addEventListener("change", function () {
      loadFile(tile, input.files[0]);
    });

    tile.addEventListener("dragover", function (event) {
      event.preventDefault();
      tile.classList.add("drag-over");
    });

    tile.addEventListener("dragleave", function () {
      tile.classList.remove("drag-over");
    });

    tile.addEventListener("drop", function (event) {
      event.preventDefault();
      tile.classList.remove("drag-over");
      var file = event.dataTransfer.files[0];
      loadFile(tile, file);
    });

    tile.addEventListener("click", function () {
      if (tile.classList.contains("has-image")) {
        openLightbox(tile.style.backgroundImage.slice(5, -2));
      }
    });
  });

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");

  function openLightbox(src) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightbox.classList.add("open");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightboxImg.src = "";
  }

  if (lightbox) {
    lightbox.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeLightbox();
    });
  }

  layoutSelect.addEventListener("change", function () {
    collage.setAttribute("data-layout", layoutSelect.value);
  });

  resetBtn.addEventListener("click", function () {
    tiles.forEach(function (tile) {
      tile.style.backgroundImage = "";
      tile.classList.remove("has-image");
      var input = tile.querySelector(".tile-input");
      input.value = "";
      input.style.pointerEvents = "";
    });
    images = {};
  });

  function drawImageCover(ctx, img, x, y, w, h) {
    var scale = Math.max(w / img.width, h / img.height);
    var sw = w / scale;
    var sh = h / scale;
    var sx = (img.width - sw) / 2;
    var sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  downloadBtn.addEventListener("click", function () {
    var rect = collage.getBoundingClientRect();
    var scale = 1000 / rect.width;
    var canvas = document.createElement("canvas");
    canvas.width = Math.round(rect.width * scale);
    canvas.height = Math.round(rect.height * scale);

    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0d0f12";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    tiles.forEach(function (tile) {
      if (tile.offsetParent === null) return; // hidden in current layout

      var tileRect = tile.getBoundingClientRect();
      var x = (tileRect.left - rect.left) * scale;
      var y = (tileRect.top - rect.top) * scale;
      var w = tileRect.width * scale;
      var h = tileRect.height * scale;
      var slot = tile.getAttribute("data-slot");
      var img = images[slot];

      if (img) {
        drawImageCover(ctx, img, x, y, w, h);
      } else {
        ctx.fillStyle = "#15181d";
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = "#2a2f37";
        ctx.strokeRect(x, y, w, h);
      }
    });

    var link = document.createElement("a");
    link.download = "collage.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  loadConfiguredImages();
})();
