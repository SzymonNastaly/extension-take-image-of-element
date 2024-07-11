// content-script.js
function cropImage(dataUrl, rect, devicePixelRatio) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
          img,
          (rect.x + window.scrollX) * devicePixelRatio,
          (rect.y + window.scrollY) * devicePixelRatio,
          rect.width * devicePixelRatio,
          rect.height * devicePixelRatio,
          0,
          0,
          rect.width * devicePixelRatio,
          rect.height * devicePixelRatio
      );
      resolve(canvas.toDataURL());
    };
    img.src = dataUrl;
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureAndCrop") {
    // Assume we have a way to select the target element, e.g., by ID
    const targetElement = document.getElementsByClassName('lnXdpd')[0];
    if (!targetElement) {
      console.error('Target element not found');
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;

    chrome.runtime.sendMessage({ action: "takeScreenshot" }, async (response) => {
      if (response.success) {
        chrome.storage.local.get(["screenshot"], async (result) => {
          if (result.screenshot) {
            const croppedDataUrl = await cropImage(result.screenshot, rect, devicePixelRatio);

            const img = document.createElement('img');
            img.src = croppedDataUrl;
            document.body.appendChild(img);
          }
        });
      }
    });
  }
});