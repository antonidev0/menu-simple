/* ============================================
   CALYPSO — script.js
   • Letter-by-letter title animation
   • Sticky category indicator on scroll
   • Scroll-reveal for dishes & section heads
   • Subtle parallax on hero wave
============================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ─── 1. Split hero title into animated letters ─── */
  const title = document.querySelector(".hero-title em");
  if (title) {
    const text = title.textContent;
    title.innerHTML = "";
    [...text].forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = "char";
      span.style.setProperty("--i", i);
      // preserve spaces
      span.textContent = ch === " " ? "\u00A0" : ch;
      title.appendChild(span);
    });
  }

  /* ─── 2. Active category pill on scroll ─── */
  const pills = document.querySelectorAll(".cat-pill");
  const sections = Array.from(pills)
    .map((p) => document.querySelector(p.getAttribute("href")))
    .filter(Boolean);

  const setActive = (id) => {
    pills.forEach((p) => {
      const isActive = p.getAttribute("href") === "#" + id;
      p.classList.toggle("active", isActive);
      if (isActive) {
        p.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    });
  };

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-140px 0px -55% 0px", threshold: 0 },
  );

  sections.forEach((s) => navObserver.observe(s));

  // immediate visual feedback on click
  pills.forEach((p) => {
    p.addEventListener("click", () => {
      pills.forEach((x) => x.classList.remove("active"));
      p.classList.add("active");
    });
  });

  /* ─── 3. Scroll reveal for dishes (with stagger) ─── */
  const dishes = document.querySelectorAll(".dish");
  const heads = document.querySelectorAll(".section-head");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // stagger by index within the same batch
          const target = entry.target;
          const delay = (idx % 5) * 80;
          setTimeout(() => target.classList.add("in-view"), delay);
          revealObserver.unobserve(target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
  );

  dishes.forEach((d) => revealObserver.observe(d));
  heads.forEach((h) => revealObserver.observe(h));

  /* ─── 4. Subtle parallax on hero wave ─── */
  const wave = document.querySelector(".hero-wave");
  if (wave) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const y = window.scrollY;
            if (y < 600) {
              wave.style.transform = `translateY(${y * 0.3}px)`;
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true },
    );
  }

  /* ─── 5. Brandmark hide on scroll-down, show on scroll-up ─── */
  const topbar = document.querySelector(".topbar");
  let lastY = 0;
  let topbarTicking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!topbarTicking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y > 200 && y > lastY) {
            topbar.style.transform = "translateY(-100%)";
          } else {
            topbar.style.transform = "translateY(0)";
          }
          topbar.style.transition =
            "transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)";
          lastY = y;
          topbarTicking = false;
        });
        topbarTicking = true;
      }
    },
    { passive: true },
  );
});
