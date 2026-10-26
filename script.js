document.addEventListener("DOMContentLoaded", () => {
  // Always start at the top on refresh (unless the URL has a #section)
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (!location.hash) window.scrollTo(0, 0);

  const header = document.getElementById("header");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  /* Footer year */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* Mobile menu */
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navMenu.classList.toggle("open");
  });
  navLinks.forEach((link) =>
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navMenu.classList.remove("open");
    })
  );

  /* Header style + active link on scroll */
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
    let current = "home";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach((link) =>
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`)
    );
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Reveal on scroll */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), i * 90);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* Skill bars */
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".fill").forEach((bar) => {
            bar.style.width = bar.dataset.width + "%";
          });
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  const skillBars = document.querySelector(".skill-bars");
  if (skillBars) barObserver.observe(skillBars);

  /* Animated counters */
  const animateCounter = (el) => {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".counter").forEach((c) => counterObserver.observe(c));

  /* Testimonial slider (mobile) - FIXED: never scrolls the page */
  const testiGrid = document.getElementById("testi-grid");
  const testiSection = document.getElementById("testimonials");
  const dots = document.querySelectorAll(".dot-btn");
  let currentSlide = 0;
  let testiVisible = false;

  const setActiveDot = (index) => {
    currentSlide = index;
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  };

  const goToSlide = (index) => {
    setActiveDot(index);
    const card = testiGrid.children[index];
    if (window.innerWidth <= 860 && card) {
      // scrolls only the slider sideways, not the page
      testiGrid.scrollTo({
        left: card.offsetLeft - testiGrid.children[0].offsetLeft,
        behavior: "smooth",
      });
    }
  };

  dots.forEach((dot, i) => dot.addEventListener("click", () => goToSlide(i)));

  // auto-rotate only while the section is visible
  new IntersectionObserver(
    ([entry]) => { testiVisible = entry.isIntersecting; },
    { threshold: 0.3 }
  ).observe(testiSection);

  setInterval(() => {
    if (testiVisible) goToSlide((currentSlide + 1) % dots.length);
  }, 5000);

  // keep dots in sync when the user swipes
  testiGrid.addEventListener(
    "scroll",
    () => {
      if (window.innerWidth > 860) return;
      const i = Math.round(testiGrid.scrollLeft / testiGrid.clientWidth);
      if (i !== currentSlide && dots[i]) setActiveDot(i);
    },
    { passive: true }
  );

  /* Contact form */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "");

    if (!data.name || !emailOk || !data.type || !data.budget || !data.message) {
      status.textContent = "Please fill in all fields with a valid email.";
      status.className = "form-status err";
      return;
    }

    // TODO: replace with a real endpoint (Formspree, EmailJS, your own API...)
    console.log("Form submitted:", data);
    status.textContent = "Thanks! Your message has been sent. I'll reply within 24 hours.";
    status.className = "form-status ok";
    form.reset();
  });
});