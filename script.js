// ─────────────────────────────────────────────
//  CONFIG — Update these when your token launches
// ─────────────────────────────────────────────
const CONFIG = {
  tokenAddress: "0x62906ca1a6ec929c6dd487a696aca5f1abb6633f",

  // Optional: DexScreener pair address (overrides tokenAddress for chart)
  dexScreenerPair: "",

  // uniswap coin page — auto-built from tokenAddress if left empty
  pumpFunUrl: "",

  twitter: "https://x.com/WSBOnRobin",
  telegram: "https://t.me/WSBOnRobinTG",
};

const PLACEHOLDER_CA = "COMING_SOON — paste your token address in script.js";

function getChartId() {
  return CONFIG.dexScreenerPair || CONFIG.tokenAddress;
}

function getPumpFunUrl() {
  if (CONFIG.pumpFunUrl) return CONFIG.pumpFunUrl;
  if (CONFIG.tokenAddress && CONFIG.tokenAddress !== "0x62906ca1a6ec929c6dd487a696aca5f1abb6633f") {
    return `https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=${CONFIG.tokenAddress}&chain=robinhood`;
  }
  return "https://app.uniswap.org/swap?inputCurrency=ETH&chain=robinhood";
}

function buildDexScreenerEmbedUrl(id) {
  const params = new URLSearchParams({
    embed: "1",
    loadChartSettings: "0",
    trades: "0",
    tabs: "0",
    info: "0",
    chartLeftToolbar: "0",
    chartDefaultOnMobile: "1",
    chartTheme: "light",
    chartStyle: "1",
    chartType: "usd",
    interval: "15",
  });
  return `https://dexscreener.com/robinhood/${id}?${params.toString()}`;
}

function initContract() {
  const display = document.getElementById("ca-display");
  const copyBtn = document.getElementById("copy-ca");
  const toast = document.getElementById("copy-toast");
  const address = CONFIG.tokenAddress || PLACEHOLDER_CA;

  display.textContent = address;

  copyBtn.addEventListener("click", async () => {
    if (!CONFIG.tokenAddress) {
      toast.textContent = "Token address not set yet!";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
      return;
    }

    try {
      await navigator.clipboard.writeText(CONFIG.tokenAddress);
      copyBtn.classList.add("copied");
      copyBtn.querySelector("span").textContent = "Copied!";
      toast.textContent = "Contract address copied!";
      toast.classList.add("show");

      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.querySelector("span").textContent = "Copy";
        toast.classList.remove("show");
      }, 2500);
    } catch {
      toast.textContent = "Copy failed — select and copy manually.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    }
  });
}

function initChart() {
  const iframe = document.getElementById("dexscreener-embed");
  const placeholder = document.getElementById("chart-placeholder");
  const link = document.getElementById("dexscreener-link");
  const chartId = getChartId();

  if (!chartId) {
    iframe.classList.add("hidden");
    placeholder.classList.remove("hidden");
    link.href = "https://dexscreener.com/robinhood";
    link.textContent = "Browse WallStreetBets Chain pairs on DexScreener →";
    return;
  }

  iframe.src = buildDexScreenerEmbedUrl(chartId);
  link.href = `https://dexscreener.com/robinhood/${chartId}`;
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initSocialLinks() {
  const pumpUrl = getPumpFunUrl();

  document.querySelectorAll("[data-pumpfun]").forEach((el) => {
    el.href = pumpUrl;
  });

  document.querySelectorAll("[data-telegram]").forEach((el) => {
    el.href = CONFIG.telegram;
  });

  document.querySelectorAll("[data-twitter]").forEach((el) => {
    el.href = CONFIG.twitter;
  });
}

function initGallery() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("lightbox-close");
  if (!lightbox || !lightboxImg) return;

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-gallery-src]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-gallery-src");
      const img = btn.querySelector("img");
      openLightbox(src, img ? img.alt : "");
    });
  });

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initContract();
  initChart();
  initNav();
  initSocialLinks();
  initGallery();
});
