// Open every external link in a new tab. rel="noopener" (not "noreferrer") keeps the referrer for analytics.
(function () {
  function openExternalInNewTab() {
    document.querySelectorAll("a[href]").forEach(function (a) {
      if (a.hostname && a.hostname !== window.location.hostname) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
      }
    });
  }
  if (typeof document$ !== "undefined") {
    document$.subscribe(openExternalInNewTab); // Material's page-load observable
  } else {
    document.addEventListener("DOMContentLoaded", openExternalInNewTab);
  }
})();
