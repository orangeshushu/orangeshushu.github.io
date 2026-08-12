(function () {
  "use strict";

  var storageKey = "nourishday-language";
  var root = document.documentElement;

  function storedLanguage() {
    try {
      var value = localStorage.getItem(storageKey);
      if (value === "zh" || value === "en") return value;
    } catch (_) {}
    return /^zh\b/i.test(navigator.language || "") ? "zh" : "en";
  }

  function remember(language) {
    try { localStorage.setItem(storageKey, language); } catch (_) {}
  }

  function bindSwitches(language) {
    document.querySelectorAll("[data-language-switch]").forEach(function (button) {
      button.addEventListener("click", function () {
        remember(language === "zh" ? "en" : "zh");
        location.reload();
      });
    });
  }

  function copyHead(source) {
    document.title = source.title;
    [
      "meta[name='description']",
      "meta[name='keywords']",
      "meta[property='og:locale']",
      "meta[property='og:locale:alternate']",
      "meta[property='og:site_name']",
      "meta[property='og:title']",
      "meta[property='og:description']",
      "meta[property='og:image:alt']"
    ].forEach(function (selector) {
      var current = document.head.querySelector(selector);
      var replacement = source.head.querySelector(selector);
      if (current && replacement) current.setAttribute("content", replacement.getAttribute("content") || "");
    });
  }

  function normalizeTemplatePaths(container) {
    container.querySelectorAll("[src^='../']").forEach(function (element) {
      element.setAttribute("src", element.getAttribute("src").slice(3));
    });
  }

  function reveal(language) {
    root.lang = language === "zh" ? "zh-CN" : "en";
    root.dataset.locale = language;
    root.dataset.localeReady = "true";
    bindSwitches(language);
  }

  var language = storedLanguage();
  if (language === "zh") {
    reveal("zh");
    return;
  }

  fetch("en/index.html", { credentials: "same-origin" })
    .then(function (response) {
      if (!response.ok) throw new Error("English content unavailable");
      return response.text();
    })
    .then(function (markup) {
      var source = new DOMParser().parseFromString(markup, "text/html");
      normalizeTemplatePaths(source.body);
      copyHead(source);
      document.body.replaceWith(source.body);
      reveal("en");
    })
    .catch(function () {
      remember("zh");
      reveal("zh");
    });
})();
