import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const root = process.cwd();
const qaDir = path.join(root, "qa");
const profileDir = path.join(os.tmpdir(), "xudeming-portfolio-qa-profile");
const port = 9228;

await mkdir(qaDir, { recursive: true });
await rm(profileDir, { recursive: true, force: true });

const browser = spawn(chrome, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  "--disable-gpu",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-renderer-backgrounding",
  "--hide-scrollbars",
  "--autoplay-policy=no-user-gesture-required",
  "about:blank",
], { stdio: "ignore" });

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let target;
for (let attempt = 0; attempt < 40; attempt += 1) {
  try {
    const targets = await fetch(`http://127.0.0.1:${port}/json`).then(response => response.json());
    target = targets.find(item => item.type === "page");
    if (target) break;
  } catch {}
  await sleep(125);
}
if (!target) throw new Error("无法连接无头浏览器");

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let id = 0;
const pending = new Map();
const consoleErrors = [];
socket.addEventListener("message", event => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }
  if (message.method === "Runtime.exceptionThrown") consoleErrors.push(message.params.exceptionDetails.text);
  if (message.method === "Log.entryAdded" && message.params.entry.level === "error") consoleErrors.push(message.params.entry.text);
  if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
    consoleErrors.push(message.params.args.map(arg => arg.value ?? arg.description ?? "").join(" "));
  }
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const messageId = ++id;
  pending.set(messageId, { resolve, reject });
  socket.send(JSON.stringify({ id: messageId, method, params }));
});
const evaluate = async expression => {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  }
  return result.result.value;
};
const viewport = (width, height, mobile = false) => send("Emulation.setDeviceMetricsOverride", {
  width, height, deviceScaleFactor: 1, mobile, screenWidth: width, screenHeight: height,
});
const capture = async name => {
  const { data } = await send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
  await writeFile(path.join(qaDir, name), Buffer.from(data, "base64"));
};
const navigate = async url => {
  const navigation = await send("Page.navigate", { url });
  if (navigation.errorText) throw new Error(navigation.errorText);
  await sleep(5000);
};

try {
  await Promise.all([send("Page.enable"), send("Runtime.enable"), send("Log.enable")]);
  await viewport(1265, 712);
  await navigate("http://127.0.0.1:4173/#home");
  await capture("implementation-hero-desktop.png");

  const desktop = await evaluate(`(() => ({
    url: location.href,
    title: document.title,
    body: document.body.innerText.slice(0, 120),
    viewport: [innerWidth, innerHeight],
    overflow: document.documentElement.scrollWidth > innerWidth,
    heroTitle: document.querySelector('.hero h1')?.innerText,
    videos: [...document.querySelectorAll('video')].map(video => ({ readyState: video.readyState, paused: video.paused }))
  }))()`);

  await evaluate(`document.querySelector('#works')?.scrollIntoView()`);
  await sleep(1000);
  await capture("implementation-works-desktop.png");

  await evaluate(`document.querySelector('#process')?.scrollIntoView()`);
  await sleep(500);
  const filterCount = await evaluate(`(() => {
    [...document.querySelectorAll('.filters button')].find(button => button.textContent.trim() === '推广图')?.click();
    return true;
  })()`);
  await sleep(350);
  const filteredCards = await evaluate(`document.querySelectorAll('.gallery-grid button').length`);
  await evaluate(`document.querySelector('.gallery-grid button')?.click()`);
  await sleep(250);
  const galleryLightbox = await evaluate(`Boolean(document.querySelector('.lightbox'))`);
  await evaluate(`document.querySelector('.lightbox-bar button')?.click()`);

  await evaluate(`document.querySelector('#contact').scrollIntoView()`);
  await sleep(300);
  await evaluate(`document.querySelector('button[aria-label="复制电话"]')?.click()`);
  await sleep(150);
  const phoneCopyFeedback = await evaluate(`document.querySelector('button[aria-label="已复制电话"], button[aria-label="电话复制失败，请手动选择号码"]')?.getAttribute('aria-label') ?? null`);
  await evaluate(`document.querySelector('button[aria-label="复制邮箱"]')?.click()`);
  await sleep(150);
  const mailCopyFeedback = await evaluate(`document.querySelector('button[aria-label="已复制邮箱"], button[aria-label="邮箱复制失败，请手动选择地址"]')?.getAttribute('aria-label') ?? null`);

  await viewport(390, 844, true);
  await navigate("http://127.0.0.1:4173/#home");
  await capture("implementation-hero-mobile.png");
  const mobile = await evaluate(`(() => ({
    viewport: [innerWidth, innerHeight],
    overflow: document.documentElement.scrollWidth > innerWidth,
    titleRect: (() => { const r = document.querySelector('.hero h1')?.getBoundingClientRect(); return r ? { left:r.left, right:r.right, top:r.top, bottom:r.bottom } : null; })(),
    statRects: Array.from(document.querySelectorAll('.stat'), el => { const r=el.getBoundingClientRect(); return {left:r.left,right:r.right,width:r.width}; })
  }))()`);
  await evaluate(`document.querySelector('.mobile-menu')?.click()`);
  await sleep(150);
  const mobileMenu = await evaluate(`Boolean(document.querySelector('.mobile-panel'))`);
  await evaluate(`document.querySelector('.mobile-menu')?.click()`);
  await sleep(150);

  await evaluate(`document.querySelector('#works').scrollIntoView()`);
  await sleep(1000);
  await capture("implementation-works-mobile.png");
  const mobileWorks = await evaluate(`(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, cards: Array.from(document.querySelectorAll('.work-card'), el => el.getBoundingClientRect().height) }))()`);

  const report = {
    desktop,
    interactions: { filterTriggered: filterCount, filteredCards, galleryLightbox, phoneCopyFeedback, mailCopyFeedback, mobileMenu },
    mobile,
    mobileWorks,
    consoleErrors,
  };
  await writeFile(path.join(qaDir, "browser-results.json"), JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify(report, null, 2));
} finally {
  socket.close();
  browser.kill();
  await sleep(500);
  await rm(profileDir, { recursive: true, force: true }).catch(() => {});
}
