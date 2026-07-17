function initContract() {
  const display = document.getElementById("ca-display");
  const copyButton = document.getElementById("copy-ca");
  const toast = document.getElementById("copy-toast");
  if (!display || !copyButton || !toast) return;

  const address = display.textContent.trim();

  copyButton.addEventListener("click", async () => {
    if (!address) {
      toast.textContent = "Contract address coming soon.";
      toast.classList.add("show");
      window.setTimeout(() => toast.classList.remove("show"), 2200);
      return;
    }

    try {
      await navigator.clipboard.writeText(address);
      copyButton.classList.add("copied");
      copyButton.querySelector("span").textContent = "Copied";
      toast.textContent = "Verified contract copied to clipboard.";
    } catch {
      toast.textContent = "Select the address and copy it manually.";
    }

    toast.classList.add("show");
    window.setTimeout(() => {
      copyButton.classList.remove("copied");
      copyButton.querySelector("span").textContent = "Copy";
      toast.classList.remove("show");
    }, 2200);
  });
}

function initNavigation() {
  const header = document.getElementById("site-header");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  const progress = document.getElementById("scroll-progress");
  if (!header || !toggle || !links) return;

  const closeMenu = () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const updatePageChrome = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);

    if (progress) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progress.style.width = `${Math.min(100, percentage)}%`;
    }
  };

  updatePageChrome();
  window.addEventListener("scroll", updatePageChrome, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

function initReveals() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  elements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min((index % 4) * 70, 210)}ms`;
    observer.observe(element);
  });
}

function initGallery() {
  const lightbox = document.getElementById("lightbox");
  const image = document.getElementById("lightbox-img");
  const closeButton = document.getElementById("lightbox-close");
  const galleryButtons = document.querySelectorAll("[data-gallery-src]");
  if (!lightbox || !image || !closeButton || !galleryButtons.length) return;

  let previouslyFocused = null;

  const closeLightbox = () => {
    lightbox.hidden = true;
    image.removeAttribute("src");
    image.alt = "";
    document.body.classList.remove("lightbox-open");
    previouslyFocused?.focus();
  };

  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const thumbnail = button.querySelector("img");
      previouslyFocused = button;
      image.src = button.dataset.gallerySrc;
      image.alt = thumbnail?.alt || "$WSB artwork";
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      closeButton.focus();
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}

function initVisualEffects() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const aura = document.getElementById("cursor-aura");
  const particles = document.getElementById("ambient-particles");

  if (hasFinePointer && !prefersReducedMotion && aura) {
    document.body.classList.add("has-pointer");
    let frame = null;
    let mouseX = -500;
    let mouseY = -500;

    window.addEventListener(
      "pointermove",
      (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        if (frame) return;

        frame = window.requestAnimationFrame(() => {
          aura.style.setProperty("--mouse-x", `${mouseX}px`);
          aura.style.setProperty("--mouse-y", `${mouseY}px`);
          frame = null;
        });
      },
      { passive: true }
    );

    document.querySelectorAll("[data-tilt]").forEach((element) => {
      const strength = Number(element.dataset.tiltStrength || 5);

      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.transform = `perspective(1200px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) translateZ(0)`;
      });

      element.addEventListener("pointerleave", () => {
        element.style.transform = "";
      });
    });

    document.querySelectorAll(".principle-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--card-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--card-y", `${event.clientY - rect.top}px`);
      });
    });
  }

  if (!prefersReducedMotion && particles) {
    const particleCount = window.innerWidth < 760 ? 10 : 20;
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < particleCount; index += 1) {
      const particle = document.createElement("i");
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.setProperty("--size", `${1 + Math.random() * 2.5}px`);
      particle.style.setProperty("--duration", `${12 + Math.random() * 18}s`);
      particle.style.setProperty("--delay", `${Math.random() * -24}s`);
      particle.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
      particle.style.setProperty("--opacity", `${0.12 + Math.random() * 0.3}`);
      fragment.appendChild(particle);
    }

    particles.appendChild(fragment);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initContract();
  initNavigation();
  initReveals();
  initGallery();
  initVisualEffects();
});
