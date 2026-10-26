/* ==========================================================
   HamzaForge Portfolio - Interactions
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* ---------- Start at Home ---------- */
  // If the URL has no section hash, make sure the page starts at the top.
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }

  /* ---------- Mobile menu ---------- */
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      navMenu.classList.toggle("open");
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (hamburger) hamburger.classList.remove("open");
      if (navMenu) navMenu.classList.remove("open");
    });
  });

  /* ---------- Header style + active link on scroll ---------- */
  const onScroll = () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 30);
    }

    let current = "home";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;

      if (window.scrollY >= sectionTop - 140) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`
      );
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  // Run once when page loads
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, index * 90);

            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* ---------- Skill bars ---------- */
  const skillBars = document.querySelector(".skill-bars");

  if (skillBars && "IntersectionObserver" in window) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll(".fill");

            bars.forEach((bar) => {
              const width = bar.dataset.width;

              if (width) {
                bar.style.width = `${width}%`;
              }
            });

            barObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    barObserver.observe(skillBars);
  }

  /* ---------- Animated counters ---------- */
  const animateCounter = (element) => {
    const target = Number(element.dataset.target);
    const suffix = element.dataset.suffix || "";

    if (Number.isNaN(target)) return;

    const duration = 1600;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      element.textContent =
        Math.floor(eased * target) + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const counters = document.querySelectorAll(".counter");

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.6,
      }
    );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach((counter) => {
      const target = Number(counter.dataset.target);
      const suffix = counter.dataset.suffix || "";

      counter.textContent = target + suffix;
    });
  }

  /* ---------- Testimonial dots / mobile slider ---------- */
  const testiGrid = document.getElementById("testi-grid");
  const dots = document.querySelectorAll(".dot-btn");

  let currentSlide = 0;

  if (testiGrid && dots.length > 0) {
    const goToSlide = (index) => {
      if (!testiGrid.children[index]) return;

      currentSlide = index;

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });

      // Only scroll the testimonial card on mobile.
      if (window.innerWidth <= 860) {
        const card = testiGrid.children[index];

        card.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    };

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        goToSlide(index);
      });
    });

    // Auto-slide only on mobile
    setInterval(() => {
      if (window.innerWidth <= 860) {
        const nextSlide =
          (currentSlide + 1) % dots.length;

        goToSlide(nextSlide);
      }
    }, 5000);
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  if (form && status) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = Object.fromEntries(
        new FormData(form).entries()
      );

      const name = data.name?.trim();
      const email = data.email?.trim();
      const type = data.type;
      const budget = data.budget;
      const message = data.message?.trim();

      // Correct email validation
      const emailOk =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");

      if (
        !name ||
        !emailOk ||
        !type ||
        !budget ||
        !message
      ) {
        status.textContent =
          "Please fill in all fields with a valid email.";

        status.className = "form-status err";

        return;
      }

      /*
        IMPORTANT:
        This currently does NOT actually send an email.

        You need Formspree, EmailJS, FormSubmit,
        or your own backend/API for real email delivery.
      */

      console.log("Form submitted:", data);

      status.textContent =
        "Thanks! Your message has been received. I'll reply within 24 hours.";

      status.className = "form-status ok";

      form.reset();
    });
  }
});