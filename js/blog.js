// Blog engine — fetches Markdown posts from blog/posts/ and renders them
// client-side. No build step: add a .md file, list its slug in
// blog/posts/manifest.json, commit.

(function () {
  var POSTS_DIR = "blog/posts/";
  var MANIFEST_URL = POSTS_DIR + "manifest.json";

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Splits a Markdown file into { meta, body }. Front matter is a simple
  // "key: value" block between two "---" lines — no nested structures.
  function parsePost(raw) {
    var meta = {};
    var body = raw;

    if (/^---\s*\n/.test(raw)) {
      var end = raw.indexOf("\n---", 4);
      if (end !== -1) {
        var frontMatter = raw.slice(raw.indexOf("\n") + 1, end);
        body = raw.slice(end + 4).replace(/^\s*\n/, "");
        frontMatter.split("\n").forEach(function (line) {
          var m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
          if (m) meta[m[1]] = m[2].trim();
        });
      }
    }

    return { meta: meta, body: body };
  }

  function formatDate(dateStr) {
    var d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Minimal Markdown -> HTML converter covering the subset used in posts:
  // headings, paragraphs, bold/italic, inline code, fenced code blocks,
  // links, blockquotes, and unordered/ordered lists.
  function renderInline(text) {
    var escaped = escapeHtml(text);
    escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    escaped = escaped.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    escaped = escaped.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2">$1</a>'
    );
    return escaped;
  }

  function markdownToHtml(md) {
    var lines = md.replace(/\r\n/g, "\n").split("\n");
    var html = [];
    var i = 0;
    var listType = null; // "ul" | "ol" | null

    function closeList() {
      if (listType) {
        html.push("</" + listType + ">");
        listType = null;
      }
    }

    while (i < lines.length) {
      var line = lines[i];

      // Fenced code block
      if (/^```/.test(line)) {
        closeList();
        var codeLines = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) {
          codeLines.push(lines[i]);
          i++;
        }
        html.push(
          "<pre><code>" + escapeHtml(codeLines.join("\n")) + "</code></pre>"
        );
        i++;
        continue;
      }

      // Headings
      var headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        closeList();
        var level = headingMatch[1].length;
        html.push(
          "<h" + level + ">" + renderInline(headingMatch[2]) + "</h" + level + ">"
        );
        i++;
        continue;
      }

      // Blockquote
      if (/^>\s?/.test(line)) {
        closeList();
        var quoteLines = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          quoteLines.push(lines[i].replace(/^>\s?/, ""));
          i++;
        }
        html.push("<blockquote><p>" + renderInline(quoteLines.join(" ")) + "</p></blockquote>");
        continue;
      }

      // Unordered list
      var ulMatch = line.match(/^[-*]\s+(.*)$/);
      if (ulMatch) {
        if (listType !== "ul") {
          closeList();
          html.push("<ul>");
          listType = "ul";
        }
        html.push("<li>" + renderInline(ulMatch[1]) + "</li>");
        i++;
        continue;
      }

      // Ordered list
      var olMatch = line.match(/^\d+\.\s+(.*)$/);
      if (olMatch) {
        if (listType !== "ol") {
          closeList();
          html.push("<ol>");
          listType = "ol";
        }
        html.push("<li>" + renderInline(olMatch[1]) + "</li>");
        i++;
        continue;
      }

      // Blank line
      if (/^\s*$/.test(line)) {
        closeList();
        i++;
        continue;
      }

      // Paragraph — collect until a blank line or a new block starts
      closeList();
      var paraLines = [line];
      i++;
      while (
        i < lines.length &&
        !/^\s*$/.test(lines[i]) &&
        !/^(#{1,6})\s+/.test(lines[i]) &&
        !/^```/.test(lines[i]) &&
        !/^[-*]\s+/.test(lines[i]) &&
        !/^\d+\.\s+/.test(lines[i]) &&
        !/^>\s?/.test(lines[i])
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      html.push("<p>" + renderInline(paraLines.join(" ")) + "</p>");
    }

    closeList();
    return html.join("\n");
  }

  function fetchPost(slug) {
    return fetch(POSTS_DIR + slug + ".md").then(function (res) {
      if (!res.ok) throw new Error("Post not found: " + slug);
      return res.text().then(function (raw) {
        var parsed = parsePost(raw);
        parsed.slug = slug;
        return parsed;
      });
    });
  }

  function fetchManifest() {
    return fetch(MANIFEST_URL).then(function (res) {
      if (!res.ok) throw new Error("Could not load post list");
      return res.json();
    });
  }

  function renderList() {
    var container = document.getElementById("blog-list");
    if (!container) return;

    fetchManifest()
      .then(function (slugs) {
        return Promise.all(slugs.map(fetchPost));
      })
      .then(function (posts) {
        posts.sort(function (a, b) {
          return (b.meta.date || "").localeCompare(a.meta.date || "");
        });

        if (posts.length === 0) {
          container.innerHTML = "<p>No posts yet — check back soon.</p>";
          return;
        }

        container.innerHTML = posts
          .map(function (post) {
            return (
              '<a class="card post-card" href="blog-post.html?slug=' +
              encodeURIComponent(post.slug) +
              '">' +
              "<h3>" + escapeHtml(post.meta.title || post.slug) + "</h3>" +
              '<p class="post-meta">' + escapeHtml(formatDate(post.meta.date || "")) + "</p>" +
              "<p>" + escapeHtml(post.meta.excerpt || "") + "</p>" +
              "</a>"
            );
          })
          .join("");
      })
      .catch(function (err) {
        container.innerHTML = "<p>Couldn't load posts right now.</p>";
        console.error(err);
      });
  }

  function renderPost() {
    var container = document.getElementById("post-content");
    if (!container) return;

    var params = new URLSearchParams(location.search);
    var slug = params.get("slug");

    if (!slug) {
      container.innerHTML = "<p>No post specified.</p>";
      return;
    }

    fetchPost(slug)
      .then(function (post) {
        document.title = "Jeff Ferguson — " + (post.meta.title || post.slug);
        var titleEl = document.getElementById("post-title");
        var metaEl = document.getElementById("post-meta");
        if (titleEl) titleEl.textContent = post.meta.title || post.slug;
        if (metaEl) metaEl.textContent = formatDate(post.meta.date || "");
        container.innerHTML = markdownToHtml(post.body);
      })
      .catch(function (err) {
        container.innerHTML = "<p>That post couldn't be found.</p>";
        console.error(err);
      });
  }

  renderList();
  renderPost();
})();
