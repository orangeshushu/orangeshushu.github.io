(() => {
  const webURL = "https://apps.apple.com/app/id6798932418";
  const nativeURL = "itms-apps://apps.apple.com/app/id6798932418";
  const zh = document.documentElement.lang.startsWith("zh");
  const isWeChat = /MicroMessenger/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const copyLabel = zh ? "复制下载链接" : "Copy download link";
  const storeLinks = [...document.querySelectorAll(`a[href="${webURL}"]`)];

  // Normal browsers retain a direct, user-initiated store action. In WeChat,
  // use an honest inline route, not a modal or repeated scheme attempts.
  // The original HTML remains an HTTPS fallback when JavaScript is unavailable.
  if (isIOS && !isWeChat) storeLinks.forEach(link => { link.href = nativeURL; });

  document.querySelectorAll(".hero-copy .actions, .final-cta").forEach((container, index) => {
    const help = document.createElement(isWeChat ? "div" : "details");
    help.className = `download-help${isWeChat ? " wechat-download" : ""}`;
    const descriptionID = `download-description-${index}`;
    const inputID = `download-url-${index}`;
    const description = isWeChat && isIOS
      ? (zh ? "微信内下载：点右上角 ···，选择「在浏览器中打开」。" : "In WeChat? Tap ··· at the top right, then open this page in your browser.")
      : (zh ? "适用于 iPhone 和 iPad。复制链接，在这两类设备的 Safari 中打开。" : "Available for iPhone and iPad. Copy this link and open it in Safari on either device.");
    help.innerHTML = `${isWeChat ? "" : `<summary>${zh ? "无法打开？其他下载方式" : "Having trouble opening the store?"}</summary>`}
      <div class="download-help-content">
        <p id="${descriptionID}">${description}</p>
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
