(function () {
  var STORAGE_KEY = "ew-theme";

  /**
   * Featured project demos — open in a modal when the card is clicked.
   * Per clip: set embed (YouTube/Vimeo URL) and/or file: "videos/name.mp4"
   */
  var PROJECT_SHOWCASE = {
    "personal-vibe": {
      title: "Personal Vibe Coded Projects",
      subtitle: "Personal · 2025",
      intro: "Side projects built for fun and learning.",
      videos: [
        {
          title: "CommunityOS",
          embed:
            "https://community-os-git-main-mseggmily-s-projects.vercel.app",
        },
        {
          title: "TrendOS (Cursor)",
          embed: "https://trend-os-2026.vercel.app/dashboard",
        },
        {
          title: "Mini Game (Replit)",
          url: "https://x.com/MsEggmily/status/1915622815409328554?s=20",
        },
        {
          title: "Leftovers Co-Pilot (Cursor)",
          url: "https://x.com/MsEggmily/status/1947871872277999784?s=20",
        },
        {
          title: "Paper Trading Agent / Dashboard (Cursor)",
          embed: "https://www.youtube.com/watch?v=NLxtTKHi7kE",
        },
        {
          title: "Marketing SaaS App (Cursor)",
          embed:
            "https://vimeo.com/1194834401?share=copy&fl=sv&fe=ci",
        },
      ],
    },
    "recall-merge": {
      title: "Recall Social Accounts",
      subtitle: "3Box Labs → Recall Foundation",
      intro: "Social accounts I contributed to and managed at Recall.",
      links: [
        { label: "Recall on X", url: "https://x.com/recallnet" },
        { label: "Recall docs", url: "https://docs.recall.network" },
      ],
    },
    "pxn-growth": {
      title: "PNHQ: Marketing",
      subtitle: "Phantom Network/PNHQ · 2021–2024",
      intro: "Social accounts I contributed to and managed at PNHQ.",
      links: [
        { label: "PXN on X", url: "https://x.com/projectPXN" },
        { label: "GM product · gm.co", url: "https://gm.co" },
      ],
    },
  };

  var PALETTE_ITEMS = [
    { label: "Home", href: "#intro", q: "intro home" },
    { label: "About", href: "#about", q: "about me bio" },
    { label: "Experience", href: "#experience", q: "experience work jobs" },
    { label: "Projects", href: "#projects", q: "projects featured stories" },
    { label: "Certificates", href: "#certificates", q: "certificates creds" },
    { label: "Skills", href: "#skills", q: "skills toolkit" },
    { label: "Contact", href: "#contact", q: "contact email" },
  ];

  function getResolvedTheme() {
    var attr = document.documentElement.getAttribute("data-theme");
    if (attr === "dark") return "dark";
    if (attr === "light") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function setStoredTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {}
    syncToggleUi();
  }

  function flipTheme() {
    setStoredTheme(getResolvedTheme() === "dark" ? "light" : "dark");
  }

  function syncToggleUi() {
    var dark = getResolvedTheme() === "dark";
    var label = dark ? "Switch to light mode" : "Switch to dark mode";
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.setAttribute("aria-label", label);
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.setAttribute("title", dark ? "Light mode" : "Dark mode");
    });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", flipTheme);
  });
  syncToggleUi();

  try {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function () {
        if (
          document.documentElement.getAttribute("data-theme") !== "light" &&
          document.documentElement.getAttribute("data-theme") !== "dark"
        ) {
          syncToggleUi();
        }
      });
  } catch (e) {
    try {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addListener(function () {
          if (
            document.documentElement.getAttribute("data-theme") !== "light" &&
            document.documentElement.getAttribute("data-theme") !== "dark"
          ) {
            syncToggleUi();
          }
        });
    } catch (e2) {}
  }

  /* Command palette (⌘K / Ctrl+K) — monolithic.space–style navigation */
  var palette = document.getElementById("palette");
  var paletteInput = document.getElementById("palette-input");
  var paletteList = document.getElementById("palette-list");
  var activeIndex = 0;

  function buildPaletteList() {
    if (!paletteList) return;
    paletteList.innerHTML = "";
    PALETTE_ITEMS.forEach(function (item, i) {
      var li = document.createElement("li");
      li.className = "palette__item";
      li.dataset.index = String(i);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = item.label;
      btn.addEventListener("click", function () {
        navigate(item.href);
      });
      li.appendChild(btn);
      paletteList.appendChild(li);
    });
  }

  function getVisibleItems() {
    return Array.prototype.slice
      .call(paletteList.querySelectorAll(".palette__item"))
      .filter(function (li) {
        return !li.hasAttribute("hidden");
      });
  }

  function setActiveItem(index) {
    var items = getVisibleItems();
    if (!items.length) return;
    activeIndex = Math.max(0, Math.min(index, items.length - 1));
    items.forEach(function (li, j) {
      var btn = li.querySelector("button");
      if (btn) {
        btn.classList.toggle("is-active", j === activeIndex);
        btn.blur();
      }
    });
  }

  function filterPalette(query) {
    var q = (query || "").trim().toLowerCase();
    PALETTE_ITEMS.forEach(function (item, i) {
      var li = paletteList.querySelector('[data-index="' + i + '"]');
      if (!li) return;
      var hay = (item.label + " " + item.q).toLowerCase();
      if (!q || hay.indexOf(q) !== -1) {
        li.removeAttribute("hidden");
      } else {
        li.setAttribute("hidden", "");
      }
    });
    activeIndex = 0;
    setActiveItem(0);
  }

  function openPalette() {
    if (!palette || !paletteInput) return;
    buildPaletteList();
    palette.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    paletteInput.value = "";
    filterPalette("");
    setTimeout(function () {
      paletteInput.focus();
    }, 10);
  }

  function closePalette() {
    if (!palette) return;
    palette.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }

  function navigate(href) {
    closePalette();
    var id = href.replace(/^#/, "");
    window.location.hash = "#" + id;
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  buildPaletteList();

  document.addEventListener("keydown", function (e) {
    var mod = e.metaKey || e.ctrlKey;
    if (mod && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      if (palette && !palette.hasAttribute("hidden")) {
        closePalette();
      } else {
        openPalette();
      }
      return;
    }

    if (!palette || palette.hasAttribute("hidden")) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      var vis = getVisibleItems();
      if (vis.length)
        setActiveItem(
          activeIndex + 1 >= vis.length ? 0 : activeIndex + 1
        );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      var vis2 = getVisibleItems();
      if (vis2.length)
        setActiveItem(
          activeIndex - 1 < 0 ? vis2.length - 1 : activeIndex - 1
        );
      return;
    }

    if (e.key === "Enter") {
      var items = getVisibleItems();
      var cur = items[activeIndex];
      if (cur) {
        var b = cur.querySelector("button");
        if (b) b.click();
      }
    }
  });

  if (paletteInput) {
    paletteInput.addEventListener("input", function () {
      filterPalette(paletteInput.value);
    });
  }

  document.querySelectorAll("[data-palette-close]").forEach(function (el) {
    el.addEventListener("click", closePalette);
  });

  function isTwitterUrl(url) {
    return /(?:twitter\.com|x\.com)\//i.test(url || "");
  }

  function parseYouTubeId(url) {
    if (!url) return "";
    var m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    m = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    m = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    m = url.match(/youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    return "";
  }

  function parseVimeoId(url) {
    if (!url) return "";
    var m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? m[1] : "";
  }

  /** @returns {{ embed: string, watch: string } | null} */
  function normalizeVideoEmbed(url) {
    if (!url || typeof url !== "string") return null;
    url = url.trim();
    if (!url) return null;

    var ytId = parseYouTubeId(url);
    if (ytId) {
      return {
        embed:
          "https://www.youtube.com/embed/" + ytId + "?rel=0&modestbranding=1",
        watch: "https://www.youtube.com/watch?v=" + ytId,
      };
    }

    var vimeoId = parseVimeoId(url);
    if (vimeoId) {
      return {
        embed: "https://player.vimeo.com/video/" + vimeoId,
        watch: "https://vimeo.com/" + vimeoId,
      };
    }

    if (url.indexOf("player.vimeo.com/video/") !== -1) {
      vimeoId = parseVimeoId(url.replace("player.vimeo.com/video/", "vimeo.com/"));
      if (vimeoId) {
        return {
          embed: url.split("?")[0],
          watch: "https://vimeo.com/" + vimeoId,
        };
      }
    }

    return null;
  }

  function getWebsiteEmbed(url) {
    if (!url || typeof url !== "string") return null;
    url = url.trim();
    if (!/^https?:\/\//i.test(url)) return null;
    if (isTwitterUrl(url)) return null;
    if (normalizeVideoEmbed(url)) return null;
    return { embed: url, watch: url };
  }

  function appendIframeEmbed(block, embedUrl, title, watchLabel) {
    var wrap = document.createElement("div");
    wrap.className = "project-modal__iframe-wrap";
    var iframe = document.createElement("iframe");
    iframe.src = embedUrl;
    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
    );
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.title = title || "Embedded preview";
    wrap.appendChild(iframe);
    block.appendChild(wrap);
    if (watchLabel) {
      appendWatchFallback(block, watchLabel, embedUrl);
    }
  }

  var twitterWidgetsPromise = null;

  function loadTwitterWidgets() {
    if (window.twttr && window.twttr.widgets) {
      return Promise.resolve(window.twttr);
    }
    if (twitterWidgetsPromise) return twitterWidgetsPromise;
    twitterWidgetsPromise = new Promise(function (resolve, reject) {
      var existing = document.getElementById("twitter-wjs");
      if (existing) {
        existing.addEventListener("load", function () {
          resolve(window.twttr);
        });
        return;
      }
      var script = document.createElement("script");
      script.id = "twitter-wjs";
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      script.onload = function () {
        resolve(window.twttr);
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
    return twitterWidgetsPromise;
  }

  function appendWatchFallback(block, label, watchUrl) {
    var fallback = document.createElement("a");
    fallback.className = "project-modal__item-link project-modal__item-link--fallback";
    fallback.href = watchUrl;
    fallback.target = "_blank";
    fallback.rel = "noopener noreferrer";
    fallback.textContent = label;
    block.appendChild(fallback);
  }

  function appendSiteCard(block, v, siteUrl) {
    var card = document.createElement("div");
    card.className = "project-modal__site-card";
    var name = document.createElement("p");
    name.className = "project-modal__site-card-name";
    name.textContent = v.title || "Project";
    card.appendChild(name);
    if (v.description) {
      var desc = document.createElement("p");
      desc.className = "project-modal__site-card-desc";
      desc.textContent = v.description;
      card.appendChild(desc);
    }
    var open = document.createElement("a");
    open.className = "project-modal__site-card-cta";
    open.href = siteUrl;
    open.target = "_blank";
    open.rel = "noopener noreferrer";
    open.textContent = "Open " + (v.title || "site") + " →";
    card.appendChild(open);
    var hint = document.createElement("p");
    hint.className = "project-modal__site-card-hint";
    hint.textContent =
      "Live preview in this window needs Vercel deployment protection turned off and embed headers enabled on the CommunityOS project.";
    card.appendChild(hint);
    block.appendChild(card);
  }

  function appendTwitterEmbed(block, tweetUrl) {
    var wrap = document.createElement("div");
    wrap.className = "project-modal__twitter-wrap";
    var cleanUrl = tweetUrl.replace(/[?#].*$/, "");
    var bq = document.createElement("blockquote");
    bq.className = "twitter-tweet";
    bq.setAttribute("data-dnt", "true");
    bq.setAttribute("data-theme", getResolvedTheme() === "dark" ? "dark" : "light");
    var link = document.createElement("a");
    link.href = cleanUrl;
    bq.appendChild(link);
    wrap.appendChild(bq);
    block.appendChild(wrap);
    appendWatchFallback(block, "Open post on X if video does not load →", cleanUrl);
    loadTwitterWidgets()
      .then(function (twttr) {
        if (twttr && twttr.widgets) twttr.widgets.load(wrap);
      })
      .catch(function () {});
  }

  var projectModal = document.getElementById("project-modal");
  var projectModalTitle = document.getElementById("project-modal-title");
  var projectModalSubtitle = document.getElementById("project-modal-subtitle");
  var projectModalIntro = document.getElementById("project-modal-intro");
  var projectModalVideos = document.getElementById("project-modal-videos");
  var lastProjectTrigger = null;

  function closeProjectModal() {
    if (!projectModal || projectModal.hasAttribute("hidden")) return;
    projectModal.setAttribute("hidden", "");
    document.body.style.overflow = "";
    if (projectModalVideos) {
      projectModalVideos.querySelectorAll("iframe").forEach(function (ifr) {
        ifr.removeAttribute("src");
      });
      projectModalVideos.querySelectorAll("video").forEach(function (v) {
        v.removeAttribute("src");
        v.load();
      });
    }
    if (lastProjectTrigger && typeof lastProjectTrigger.focus === "function") {
      lastProjectTrigger.focus();
    }
  }

  function openProjectModal(key) {
    var data = PROJECT_SHOWCASE[key];
    if (!data || !projectModal || !projectModalVideos) return;
    lastProjectTrigger = document.activeElement;
    if (projectModalTitle) projectModalTitle.textContent = data.title || "";
    if (projectModalSubtitle)
      projectModalSubtitle.textContent = data.subtitle || "";
    if (projectModalIntro)
      projectModalIntro.textContent = data.intro || "";

    projectModalVideos.innerHTML = "";

    if (data.links && data.links.length) {
      var linksWrap = document.createElement("ul");
      linksWrap.className = "project-modal__links";
      data.links.forEach(function (link) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = link.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = link.label;
        li.appendChild(a);
        linksWrap.appendChild(li);
      });
      projectModalVideos.appendChild(linksWrap);
    }

    (data.videos || []).forEach(function (v, i) {
      var block = document.createElement("div");
      block.className = "project-modal__video-block";

      var ht = document.createElement("h3");
      ht.className = "project-modal__video-title";
      ht.textContent = v.title || "Video " + (i + 1);
      block.appendChild(ht);

      var file = (v.file && String(v.file).trim()) || "";
      var rawEmbed = (v.embed && String(v.embed).trim()) || "";
      var externalUrl = (v.url && String(v.url).trim()) || "";
      var tweetUrl =
        (isTwitterUrl(rawEmbed) && rawEmbed) ||
        (isTwitterUrl(externalUrl) && externalUrl) ||
        "";
      var video = normalizeVideoEmbed(rawEmbed || externalUrl);
      var website =
        getWebsiteEmbed(rawEmbed) || getWebsiteEmbed(externalUrl);

      if (file) {
        var vwrap = document.createElement("div");
        vwrap.className =
          "project-modal__iframe-wrap project-modal__iframe-wrap--native";
        var vid = document.createElement("video");
        vid.controls = true;
        vid.preload = "metadata";
        vid.src = file;
        vid.title = v.title || "Video " + (i + 1);
        vwrap.appendChild(vid);
        block.appendChild(vwrap);
      } else if (v.siteCard && externalUrl) {
        appendSiteCard(block, v, externalUrl);
      } else if (tweetUrl) {
        appendTwitterEmbed(block, tweetUrl);
      } else if (video && video.embed) {
        var fallbackLabel =
          video.watch.indexOf("youtube") !== -1
            ? "Watch on YouTube if player does not load →"
            : "Watch on Vimeo if player does not load →";
        appendIframeEmbed(
          block,
          video.embed,
          v.title || "Video " + (i + 1),
          fallbackLabel
        );
      } else if (website) {
        var siteWrap = document.createElement("div");
        siteWrap.className =
          "project-modal__iframe-wrap project-modal__iframe-wrap--site";
        var siteFrame = document.createElement("iframe");
        siteFrame.src = website.embed;
        siteFrame.setAttribute(
          "allow",
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        );
        siteFrame.setAttribute("allowfullscreen", "");
        siteFrame.setAttribute("loading", "lazy");
        siteFrame.setAttribute(
          "referrerpolicy",
          "strict-origin-when-cross-origin"
        );
        siteFrame.title = v.title || "Site preview";
        siteWrap.appendChild(siteFrame);
        block.appendChild(siteWrap);
        appendWatchFallback(
          block,
          "Open site in a new tab if preview does not load →",
          website.watch
        );
      } else if (externalUrl) {
        var ext = document.createElement("a");
        ext.className = "project-modal__item-link";
        ext.href = externalUrl;
        ext.target = "_blank";
        ext.rel = "noopener noreferrer";
        ext.textContent = "View link →";
        block.appendChild(ext);
      } else {
        var ph = document.createElement("p");
        ph.className = "project-modal__placeholder";
        ph.innerHTML =
          "Add <code>embed</code> (YouTube/Vimeo) or <code>file</code> (e.g. <code>videos/clip.mp4</code>) in <strong>PROJECT_SHOWCASE</strong> → <code>" +
          key +
          "</code> → <code>videos[" +
          i +
          "]</code>.";
        block.appendChild(ph);
      }
      projectModalVideos.appendChild(block);
    });

    projectModal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
  }

  document.querySelectorAll("[data-project-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-project-modal");
      if (key) openProjectModal(key);
    });
  });

  document.querySelectorAll("[data-project-modal-close]").forEach(function (el) {
    el.addEventListener("click", function () {
      closeProjectModal();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!projectModal || projectModal.hasAttribute("hidden")) return;
    e.preventDefault();
    closeProjectModal();
  });

  /* light parallax reveal on main sections */
  (function sectionParallaxReveal() {
    var sections = document.querySelectorAll(".section-parallax");
    if (!sections.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sections.forEach(function (s) {
        s.classList.add("is-revealed");
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    sections.forEach(function (section) {
      if (section.classList.contains("is-revealed")) return;
      observer.observe(section);
    });
  })();

  /* ── experience row expand/collapse ── */
  document.querySelectorAll(".exp-row__head").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      var body = btn.nextElementSibling;
      if (expanded) {
        btn.setAttribute("aria-expanded", "false");
        body.hidden = true;
      } else {
        btn.setAttribute("aria-expanded", "true");
        body.hidden = false;
      }
    });
  });

})();
