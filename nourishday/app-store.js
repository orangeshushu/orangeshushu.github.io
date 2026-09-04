(() => {
  const webURL = "https://apps.apple.com/app/id6798932418";
  const nativeURL = "itms-apps://apps.apple.com/app/id6798932418";
  const zh = document.documentElement.lang.startsWith("zh");
  const isWeChat = /MicroMessenger/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const dialog = document.createElement("dialog");
  // Preserve working HTTPS links in browsers without native dialog support.
  if (typeof dialog.showModal !== "function") return;

  dialog.className = "store-help";
  dialog.setAttribute("aria-labelledby", "store-help-title");
  dialog.setAttribute("aria-describedby", "store-help-description");
  dialog.innerHTML = `
    <form method="dialog"><button class="store-help-close" aria-label="${zh ? "关闭" : "Close"}">×</button></form>
    <h2 id="store-help-title">${zh ? "下载食养日历" : "Download NourishDay"}</h2>
    <p id="store-help-description"></p>
    <a class="store-help-native" href="${nativeURL}">${zh ? "打开 App Store" : "Open App Store"}</a>
    <a class="store-help-web" href="${webURL}" target="_blank" rel="noopener noreferrer">${zh ? "打开 App Store 网页" : "Open App Store website"}</a>
    <label for="store-help-url">${zh ? "官方下载链接" : "Official download link"}</label>
    <input id="store-help-url" type="url" readonly value="${webURL}" dir="ltr">
    <button class="store-help-copy" type="button">${zh ? "复制下载链接" : "Copy download link"}</button>
    <p class="store-help-status" role="status" aria-live="polite"></p>`;
  document.body.append(dialog);

  const description = dialog.querySelector("#store-help-description");
  description.textContent = isWeChat
    ? (zh ? "微信内无法打开时，请点右上角「…」，选择在浏览器中打开。也可以复制下方链接，用 Safari 打开下载。" : "If WeChat cannot open the store, tap ··· at the top right and open this page in your browser. Or copy the link below and open it in Safari.")
    : (zh ? "如果没有打开商店，请试试下方入口，或复制链接到 iPhone / iPad 的 Safari 中打开。" : "If the store did not open, try the link below or copy it into Safari on your iPhone or iPad.");
  dialog.querySelector(".store-help-native").hidden = !isIOS;
  const status = dialog.querySelector(".store-help-status");
  const input = dialog.querySelector("input");
  let timer;
  let trigger;
  function showHelp(source) {
    clearTimeout(timer);
    trigger = source;
    status.textContent = "";
    if (!dialog.open) dialog.showModal();
  }
  function cancelFallback() { clearTimeout(timer); }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelFallback();
  });
  window.addEventListener("pagehide", cancelFallback);
  dialog.addEventListener("close", () => {
    cancelFallback();
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  });
  dialog.querySelector(".store-help-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(webURL);
      status.textContent = zh ? "已复制，请在 Safari 中粘贴打开。" : "Copied. Paste the link into Safari.";
    } catch {
      input.focus();
      input.select();
      status.textContent = zh ? "请长按或选中上方链接，手动复制。" : "Select the link above and copy it manually.";
    }
  });

  // Native anchors retain the user's tap gesture, which iOS needs to open the store.
  // HTTPS remains the default in page HTML and in desktop browsers.
  document.querySelectorAll(`a[href="${webURL}"]`).forEach(link => {
    if (dialog.contains(link)) return;
    if (isIOS && !isWeChat) link.href = nativeURL;
    link.addEventListener("click", event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (isWeChat) {
        event.preventDefault();
        showHelp(link);
      } else if (isIOS) {
        cancelFallback();
        timer = setTimeout(() => {
          if (!document.hidden) showHelp(link);
        }, 1800);
      }
    });
  });
  document.querySelectorAll(".hero-copy .actions, .final-cta").forEach(container => {
    const help = document.createElement("button");
    help.type = "button";
    help.className = "store-help-trigger";
    help.textContent = zh ? "无法打开？查看下载方式" : "Having trouble? Download options";
    help.addEventListener("click", () => showHelp(help));
    if (container.classList.contains("actions")) container.after(help);
    else container.append(help);
  });
})();
