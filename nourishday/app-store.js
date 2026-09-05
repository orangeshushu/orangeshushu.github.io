(() => {
  const webURL = "https://apps.apple.com/app/id6798932418";
  const nativeURL = "itms-apps://apps.apple.com/app/id6798932418";
  const zh = document.documentElement.lang.startsWith("zh");
  const isWeChat = /MicroMessenger/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const copyLabel = zh ? "复制下载链接" : "Copy download link";
  const visualGuide = isWeChat && isIOS;
  // An illustration of WeChat's native menu, not a fake on-page menu button.
  const menuIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="4" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="20" cy="12" r="2"/></svg>';
  const browserIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/></svg>';
  const arrowIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
  const storeLinks = [...document.querySelectorAll(`a[href="${webURL}"]`)];

  // Normal browsers retain a direct, user-initiated store action. In WeChat,
  // use an honest inline route, not a modal or repeated scheme attempts.
  // The original HTML remains an HTTPS fallback when JavaScript is unavailable.
  if (isIOS && !isWeChat) storeLinks.forEach(link => { link.href = nativeURL; });

  document.querySelectorAll(".hero-copy .actions, .final-cta").forEach((container, index) => {
    const help = document.createElement(isWeChat ? "div" : "details");
    help.className = `download-help${isWeChat ? " wechat-download" : ""}${visualGuide ? " has-visual-guide" : ""}`;
    const descriptionID = `download-description-${index}`;
    const inputID = `download-url-${index}`;
    const description = zh ? "适用于 iPhone 和 iPad。在 Safari 中打开下载链接。" : "For iPhone and iPad. Open the download link in Safari.";
    const guide = visualGuide
      ? `<div class="wechat-route" id="${descriptionID}" role="img" aria-label="${zh ? "在微信中下载：点微信右上角菜单，再选择在浏览器中打开。" : "To download in WeChat, open its top-right menu, then choose Open in browser."}">
          <span class="wechat-route-step" aria-hidden="true"><span class="wechat-route-icon menu-icon">${menuIcon}</span><span>${zh ? "微信右上角" : "Top-right menu"}</span></span>
          <span class="wechat-route-arrow" aria-hidden="true">${arrowIcon}</span>
          <span class="wechat-route-step" aria-hidden="true"><span class="wechat-route-icon">${browserIcon}</span><span>${zh ? "浏览器打开" : "Open in browser"}</span></span>
        </div>`
      : `<p id="${descriptionID}">${description}</p>`;
    help.innerHTML = `${isWeChat ? "" : `<summary>${zh ? "无法打开？其他下载方式" : "Having trouble opening the store?"}</summary>`}
      <div class="download-help-content">
        ${guide}
        <div class="download-link-field"${isWeChat ? " hidden" : ""}>
          <label for="${inputID}">${zh ? "App Store 下载链接" : "App Store download link"}</label>
          <input id="${inputID}" type="url" readonly value="${webURL}" dir="ltr" spellcheck="false">
        </div>
        ${isWeChat ? "" : `<button class="download-copy" type="button">${copyLabel}</button>`}
        <p class="download-status" role="status" aria-live="polite"></p>
      </div>`;
    if (container.classList.contains("actions")) {
      if (isWeChat) container.before(help);
      else container.after(help);
    } else container.append(help);

    let copyButton = help.querySelector(".download-copy");
    if (isWeChat) {
      const primary = container.querySelector(`a[href="${webURL}"]`);
      if (!primary) return;
      copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.className = primary.className;
      copyButton.textContent = copyLabel;
      copyButton.setAttribute("aria-describedby", descriptionID);
      primary.replaceWith(copyButton);
    }

    copyButton.addEventListener("click", async () => {
      const status = help.querySelector(".download-status");
      try {
        await navigator.clipboard.writeText(webURL);
        status.textContent = zh ? "已复制。在 iPhone 或 iPad 的 Safari 中粘贴打开。" : "Copied. Paste into Safari on your iPhone or iPad.";
      } catch {
        // Clipboard permission is not guaranteed in embedded browsers.
        help.querySelector(".download-link-field").hidden = false;
        const input = help.querySelector("input");
        input.focus({ preventScroll: true });
        input.select();
        input.setSelectionRange(0, input.value.length);
        status.textContent = zh ? "请选中或长按上方链接复制，再到 iPhone 或 iPad 打开。" : "Select or touch and hold the link to copy it, then open it on your iPhone or iPad.";
      }
    });
  });

  // Other download entry points lead to the visible instructions in WeChat.
  // No click interception and no automatic external-app launch.
  if (isWeChat) storeLinks.filter(link => link.isConnected).forEach(link => {
    link.href = "#availability";
    link.setAttribute("aria-label", zh ? "查看下载方式" : "See download options");
  });
})();
