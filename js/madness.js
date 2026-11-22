/* madness.js — renders the March Madness 2027 tracker from MM_DATA
   (js/madness-data.js). Same plain-JS style as the rest of the site. */
(function () {
  "use strict";

  var D = window.MM_DATA;
  if (!D) return;
  var FOLLOW = D.FOLLOW, TEAMS = D.TEAMS, GAMES = D.GAMES, TOP = D.TOP;
  var ABBR = { "Villanova": "NOVA", "Penn State": "PSU", "Denver": "DU", "Michigan": "MICH", "Ohio State": "OSU" };
  var WATCH_KEY = "mm2027_watch";

  var ROWS = TOP.map(function (a) {
    return { rank: a[0], team: a[1], conf: a[2], wl: a[3], oe: a[4], de: a[5], net: Math.round((a[4] - a[5]) * 10) / 10,
      bar: a[6], wab: a[7], sos: a[8], ap: a[9], bpi: a[10], tempo: a[11], note: a[12] };
  });

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function badge(name) {
    var t = FOLLOW[name];
    var b = el("span", "team-logo", ABBR[name] || name.slice(0, 4).toUpperCase());
    if (t) b.style.background = t.c1;
    return b;
  }
  function signed(v, d) {
    var s = Math.abs(v).toFixed(d);
    return v > 0 ? "+" + s : v < 0 ? "−" + s : s;
  }
  function pct(v) { return (v >= 10 ? Math.round(v) : v.toFixed(1)) + "%"; }

  /* ---- Watch list (per browser, like the draft board's drafted boxes) ---- */
  function loadWatch() {
    try { return JSON.parse(localStorage.getItem(WATCH_KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  function saveWatch(state) {
    try { localStorage.setItem(WATCH_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }
  var watch = loadWatch();
  function isFollowed(team) { return !!FOLLOW[team] || !!watch[team]; }

  /* ---- Header strip ---- */
  var asOf = document.getElementById("asof");
  if (asOf) asOf.textContent = D.asOf;

  /* ---- This week ---- */
  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function teamSpan(parent, name) {
    var s = el("span");
    if (FOLLOW[name]) { s.appendChild(badge(name)); s.appendChild(el("strong", null, name)); }
    else s.textContent = name;
    parent.appendChild(s);
  }
  function renderGames() {
    var box = document.getElementById("days");
    if (!box) return;
    var today = todayKey();
    var byDay = {};
    GAMES.forEach(function (g) { (byDay[g.d] = byDay[g.d] || []).push(g); });
    Object.keys(byDay).sort().forEach(function (d) {
      var day = el("div", "sched-day");
      if (d < today) day.classList.add("past");
      var label = el("div", "sched-date");
      label.appendChild(el("span", null, new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })));
      if (d === today) label.appendChild(el("span", "flag", "TODAY"));
      day.appendChild(label);
      var list = el("div", "sched-games");
      byDay[d].forEach(function (g) {
        var line = el("div", "sched-game");
        var m = el("div", "matchup");
        teamSpan(m, g.a);
        m.appendChild(el("span", "at", g.neutral ? " vs " : " at "));
        teamSpan(m, g.h);
        if (g.neutral) m.appendChild(el("span", "at", " (neutral site)"));
        line.appendChild(m);
        var meta = el("div", "meta num");
        if (g.time) { meta.appendChild(el("b", null, g.time)); meta.appendChild(document.createTextNode(" · ")); }
        meta.appendChild(document.createTextNode("Torvik: " + g.p[0] + " " + g.p[1] + "%"));
        line.appendChild(meta);
        list.appendChild(line);
      });
      day.appendChild(list);
      box.appendChild(day);
    });
  }

  /* ---- Your teams ---- */
  function boxCell(dl, label, value) {
    var d = el("div");
    d.appendChild(el("dt", null, label));
    d.appendChild(el("dd", "num", value));
    dl.appendChild(d);
  }
  function renderStories() {
    var box = document.getElementById("stories");
    if (!box) return;
    TEAMS.forEach(function (t) {
      var s = el("article", "story");
      var head = el("header");
      var h = el("h3");
      h.appendChild(badge(t.name));
      h.appendChild(document.createTextNode(t.name));
      head.appendChild(h);
      head.appendChild(el("p", "story-meta num", t.conf + " · " + t.wl + " · T-Rank #" + t.trank));
      s.appendChild(head);

      var dl = el("dl", "box");
      boxCell(dl, "T-Rank", "#" + t.trank);
      boxCell(dl, "Net eff.", signed(t.oe - t.de, 1));
      boxCell(dl, "WAB", signed(t.wab, 2));
      boxCell(dl, "Proj. seed", t.seed.toFixed(1));
      s.appendChild(dl);

      var odds = el("div", "odds");
      var line = el("div", "odds-line");
      var l = el("span");
      l.appendChild(document.createTextNode("Chance of an NCAA bid: "));
      l.appendChild(el("b", "num", pct(t.any)));
      line.appendChild(l);
      line.appendChild(el("span", "num", "Projected " + t.proj));
      odds.appendChild(line);
      var meter = el("div", "meter");
      meter.setAttribute("role", "img");
      meter.setAttribute("aria-label", "Chance of an NCAA bid " + pct(t.any));
      var fill = el("span");
      fill.style.width = Math.max(t.any, 0.5) + "%";
      meter.appendChild(fill);
      odds.appendChild(meter);
      s.appendChild(odds);

      var cols = el("div", "story-cols");
      var nx = el("div");
      nx.appendChild(el("h4", null, "Next 3 games"));
      var ul = el("ul", "next-list");
      t.next.forEach(function (n) {
        var li = el("li");
        li.appendChild(el("span", null, n[0] + " " + n[1]));
        li.appendChild(el("span", "num", n[2] + "% to win"));
        ul.appendChild(li);
      });
      nx.appendChild(ul);
      cols.appendChild(nx);
      var nt = el("div");
      nt.appendChild(el("h4", null, "What to know"));
      nt.appendChild(el("p", null, t.note));
      cols.appendChild(nt);
      s.appendChild(cols);
      box.appendChild(s);
    });
  }

  /* ---- Efficiency map ---- */
  function svgEl(name, attrs, text) {
    var n = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text != null) n.textContent = text;
    return n;
  }
  var chartWidth = 0, resizeTimer;
  function renderChart() {
    var svg = document.getElementById("chart");
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var box = svg.parentNode;
    chartWidth = box.clientWidth;
    var W = Math.max(300, Math.min(760, chartWidth > 0 ? chartWidth : 760));
    var narrow = W < 520;
    var H = narrow ? 400 : 430;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    var m = { l: 58, r: 22, t: 16, b: 54 };
    var x0 = 102, x1 = 127, y0 = 91, y1 = 114;
    function sx(v) { return m.l + (v - x0) / (x1 - x0) * (W - m.l - m.r); }
    function sy(v) { return m.t + (v - y0) / (y1 - y0) * (H - m.t - m.b); }

    [105, 110, 115, 120, 125].forEach(function (v) {
      svg.appendChild(svgEl("line", { class: "fig-grid", x1: sx(v), x2: sx(v), y1: m.t, y2: H - m.b }));
      svg.appendChild(svgEl("text", { class: "fig-tick", x: sx(v), y: H - m.b + 18, "text-anchor": "middle" }, String(v)));
    });
    [95, 100, 105, 110].forEach(function (v) {
      svg.appendChild(svgEl("line", { class: "fig-grid", x1: m.l, x2: W - m.r, y1: sy(v), y2: sy(v) }));
      svg.appendChild(svgEl("text", { class: "fig-tick", x: m.l - 8, y: sy(v) + 4, "text-anchor": "end" }, String(v)));
    });
    svg.appendChild(svgEl("text", { class: "fig-axis", x: (m.l + W - m.r) / 2, y: H - 10, "text-anchor": "middle" },
      narrow ? "Offense: points per 100 possessions" : "Offense: points scored per 100 possessions"));
    var cy = (m.t + H - m.b) / 2;
    svg.appendChild(svgEl("text", { class: "fig-axis", x: 14, y: cy, "text-anchor": "middle", transform: "rotate(-90 14 " + cy + ")" },
      "Defense: points allowed per 100 (lower is better)"));
    svg.appendChild(svgEl("text", { class: "fig-note", x: W - m.r - 6, y: m.t + 16, "text-anchor": "end" }, "Better ↗"));

    ROWS.filter(function (r) { return !FOLLOW[r.team]; }).forEach(function (r) {
      var c = svgEl("circle", { class: "fig-dot", cx: sx(r.oe), cy: sy(r.de), r: 3.6 });
      c.appendChild(svgEl("title", {}, r.team + " (#" + r.rank + "): offense " + r.oe.toFixed(1) + ", defense " + r.de.toFixed(1)));
      svg.appendChild(c);
    });
    var hou = ROWS[0];
    svg.appendChild(svgEl("text", { class: "fig-lab ref", x: sx(hou.oe) - 8, y: sy(hou.de) + 4, "text-anchor": "end" }, "Houston (#1)"));

    var side = { "Villanova": "end", "Penn State": "start", "Denver": "start", "Michigan": "start", "Ohio State": "start" };
    TEAMS.forEach(function (t) {
      var col = FOLLOW[t.name];
      var x = sx(t.oe), y = sy(t.de);
      var c = svgEl("circle", { cx: x, cy: y, r: 7, fill: col.c1 });
      c.style.stroke = "var(--text)";
      c.style.strokeWidth = "2";
      c.appendChild(svgEl("title", {}, t.name + " (T-Rank #" + t.trank + "): offense " + t.oe.toFixed(1) + ", defense " + t.de.toFixed(1)));
      svg.appendChild(c);
      var anchor = side[t.name] || "start";
      svg.appendChild(svgEl("text", { class: "fig-lab", x: anchor === "end" ? x - 12 : x + 12, y: y + 4.5, "text-anchor": anchor }, t.name));
    });
  }

  /* ---- Top 50 table ---- */
  var COLS = [
    { k: "watch", l: "Watch", nosort: 1, watch: 1 },
    { k: "rank", l: "#", first: 1 },
    { k: "team", l: "Team", txt: 1, first: 1 },
    { k: "conf", l: "Conf", txt: 1, first: 1 },
    { k: "wl", l: "W-L", nosort: 1 },
    { k: "oe", l: "AdjOE", f: function (v) { return v.toFixed(1); } },
    { k: "de", l: "AdjDE", f: function (v) { return v.toFixed(1); }, first: 1 },
    { k: "net", l: "Net", f: function (v) { return v.toFixed(1); } },
    { k: "bar", l: "Barthag", f: function (v) { return v.toFixed(4); } },
    { k: "wab", l: "WAB", f: function (v) { return signed(v, 2); } },
    { k: "sos", l: "SOS", f: function (v) { return signed(v, 2); } },
    { k: "ap", l: "AP", f: function (v) { return v == null ? "—" : String(v); }, first: 1 },
    { k: "bpi", l: "BPI", f: function (v) { return String(v); }, first: 1 },
    { k: "tempo", l: "Tempo", f: function (v) { return v.toFixed(1); } },
    { k: "note", l: "Notes", txt: 1, nosort: 1 }
  ];
  var state = { key: "rank", dir: 1, q: "", conf: "", mine: false };

  function sortVal(r, k) {
    var v = r[k];
    if (k === "bpi" && v === ">50") return 51;
    return v;
  }
  function renderHead() {
    var tr = document.getElementById("thead");
    if (!tr) return;
    tr.textContent = "";
    COLS.forEach(function (c) {
      var th = el("th");
      if (c.txt) th.className = "l";
      if (c.watch) th.className = "watch-col";
      if (state.key === c.k) th.setAttribute("aria-sort", state.dir === 1 ? "ascending" : "descending");
      var b = el("button", null, c.l);
      b.type = "button";
      if (c.nosort) { b.disabled = true; b.style.cursor = "default"; }
      else {
        b.addEventListener("click", function () {
          if (state.key === c.k) state.dir = -state.dir;
          else { state.key = c.k; state.dir = c.first ? 1 : -1; }
          renderHead(); renderBody();
        });
      }
      th.appendChild(b);
      tr.appendChild(th);
    });
  }
  function renderBody() {
    var tb = document.getElementById("tbody");
    if (!tb) return;
    tb.textContent = "";
    var q = state.q.trim().toLowerCase();
    var rows = ROWS.filter(function (r) {
      if (state.conf && r.conf !== state.conf) return false;
      if (state.mine && !isFollowed(r.team)) return false;
      if (q && (r.team + " " + r.conf + " " + r.note).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    var k = state.key, dir = state.dir;
    rows.sort(function (a, b) {
      var x = sortVal(a, k), y = sortVal(b, k);
      if (x == null && y == null) return a.rank - b.rank;
      if (x == null) return 1;
      if (y == null) return -1;
      if (typeof x === "string") return x.localeCompare(y) * dir;
      return (x - y) * dir || a.rank - b.rank;
    });
    var count = document.getElementById("count");
    if (count) count.textContent = "Showing " + rows.length + " of " + ROWS.length;
    if (!rows.length) {
      var tr0 = el("tr"), td0 = el("td", "empty", "No teams match. Clear the search or filters.");
      td0.colSpan = COLS.length; tr0.appendChild(td0); tb.appendChild(tr0);
      return;
    }
    rows.forEach(function (r) {
      var tr = el("tr");
      if (isFollowed(r.team)) tr.className = "follow";
      COLS.forEach(function (c) {
        var td = el("td");
        if (c.watch) {
          td.className = "watch-col";
          var cb = el("input", "watch-check");
          cb.type = "checkbox";
          cb.checked = !!watch[r.team] || !!FOLLOW[r.team];
          cb.disabled = !!FOLLOW[r.team];
          cb.setAttribute("aria-label", FOLLOW[r.team] ? r.team + " is one of your five teams" : "Watch " + r.team);
          cb.addEventListener("change", function () {
            if (cb.checked) watch[r.team] = true; else delete watch[r.team];
            saveWatch(watch);
            renderBody();
          });
          td.appendChild(cb);
        } else if (c.k === "team") {
          td.className = "l team";
          if (FOLLOW[r.team]) td.appendChild(badge(r.team));
          td.appendChild(document.createTextNode(r.team));
        } else if (c.k === "conf") { td.className = "l conf"; td.textContent = r.conf; }
        else if (c.k === "note") { td.className = "l note"; td.textContent = r.note; }
        else td.textContent = c.f ? c.f(r[c.k]) : String(r[c.k]);
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
  }
  function initTools() {
    var sel = document.getElementById("conf");
    if (!sel) return;
    var seen = {};
    ROWS.forEach(function (r) { seen[r.conf] = (seen[r.conf] || 0) + 1; });
    Object.keys(seen).sort().forEach(function (c) {
      var o = el("option", null, c + " (" + seen[c] + ")");
      o.value = c; sel.appendChild(o);
    });
    document.getElementById("q").addEventListener("input", function (e) { state.q = e.target.value; renderBody(); });
    sel.addEventListener("change", function (e) { state.conf = e.target.value; renderBody(); });
    document.getElementById("mine").addEventListener("change", function (e) { state.mine = e.target.checked; renderBody(); });
  }

  renderGames();
  renderStories();
  renderChart();
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var svg = document.getElementById("chart");
      if (svg && Math.abs(svg.parentNode.clientWidth - chartWidth) > 8) renderChart();
    }, 150);
  });
  initTools();
  renderHead();
  renderBody();
})();
