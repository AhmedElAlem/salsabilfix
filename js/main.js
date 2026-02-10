(() => {
  // ====== Config from body ======
  const phone = document.body.dataset.phone || "+966500000000";
  const whatsapp = document.body.dataset.whatsapp || "966500000000";

  // Update links
  const phoneLink = document.getElementById("phoneLink");
  const waLink = document.getElementById("waLink");
  const floatWa = document.getElementById("floatWa");

  if (phoneLink) phoneLink.href = `tel:${phone}`;
  if (waLink) waLink.href = `https://wa.me/${whatsapp}`;
  if (floatWa) floatWa.href = `https://wa.me/${whatsapp}`;

  document.querySelectorAll('[data-action="call"]').forEach(a => a.href = `tel:${phone}`);
  document.querySelectorAll('[data-action="wa"]').forEach(a => a.href = `https://wa.me/${whatsapp}`);

  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // ====== Mobile Nav ======
  const navBtn = document.getElementById("navBtn");
  const nav = document.getElementById("nav");
  if (navBtn && nav) {
    navBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navBtn.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

 // ====== Active menu (scroll spy) - deterministic ======
const header = document.querySelector(".header");
const links = Array.from(document.querySelectorAll(".nav__link"));

const sectionIds = links
  .map(a => (a.getAttribute("href") || "").trim())
  .filter(h => h.startsWith("#"))
  .map(h => h.slice(1));

const sections = sectionIds
  .map(id => document.getElementById(id))
  .filter(Boolean);

function setActiveById(id){
  links.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
}

function updateHeaderOffsetVar(){
  const h = header?.offsetHeight || 70;
  document.documentElement.style.setProperty("--header-offset", `${h + 12}px`);
  return h;
}

function updateActive(){
  const headerH = updateHeaderOffsetVar();
  const y = window.scrollY + headerH + 20; // 20px buffer

  // افتراضيًا: أول سكشن (الرئيسية)
  let currentId = sections[0]?.id || "home";

  // آخر سكشن تعديته يبقى هو النشط
  for (const sec of sections){
    if (y >= sec.offsetTop) currentId = sec.id;
  }
  setActiveById(currentId);
}

// Highlight فورًا عند الضغط
links.forEach(a => {
  a.addEventListener("click", () => {
    const id = (a.getAttribute("href") || "#").slice(1);
    if (id) setActiveById(id);
  });
});

// Scroll listener (خفيف وآمن)
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking){
    requestAnimationFrame(() => {
      updateActive();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

window.addEventListener("resize", updateActive);
window.addEventListener("load", updateActive);


  // ====== Slider ======
  const slidesWrap = document.getElementById("slides");
  const slider = document.getElementById("slider");
  const dotsWrap = document.getElementById("dots");
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");

  if (!slidesWrap || !slider) return;

  const slides = Array.from(slidesWrap.querySelectorAll(".slide"));
  let index = 0;
  let timer = null;
  const INTERVAL = 5000;

  // Create dots
  slides.forEach((_, i) => {
    const d = document.createElement("button");
    d.className = "dot" + (i === 0 ? " is-active" : "");
    d.type = "button";
    d.setAttribute("aria-label", `انتقل للسلايد رقم ${i+1}`);
    d.addEventListener("click", () => goTo(i, true));
    dotsWrap && dotsWrap.appendChild(d);
  });

  const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll(".dot")) : [];

  function paint() {
    slides.forEach((s, i) => {
      const active = i === index;
      s.classList.toggle("is-active", active);
      s.setAttribute("aria-hidden", active ? "false" : "true");
    });
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  }

  function goTo(i, userAction = false) {
    index = (i + slides.length) % slides.length;
    paint();
    if (userAction) restart();
  }

  function next() { goTo(index + 1, true); }
  function prev() { goTo(index - 1, true); }

  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);

  // Auto play
  function start() { timer = setInterval(() => goTo(index + 1, false), INTERVAL); }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  // Touch swipe (mobile)
  let x0 = null;
  slider.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, {passive:true});
  slider.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const x1 = e.changedTouches[0].clientX;
    const dx = x1 - x0;
    if (Math.abs(dx) > 40) (dx > 0 ? prev() : next());
    x0 = null;
  }, {passive:true});

  paint();
  start();

  // ====== Gallery Lightbox ======
  const gallery = document.getElementById("gallery");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbClose = document.getElementById("lbClose");
  const lbNext = document.getElementById("lbNext");
  const lbPrev = document.getElementById("lbPrev");

  if (gallery && lightbox && lbImg) {
    const imgs = Array.from(gallery.querySelectorAll("img"));
    let gIndex = 0;

    const open = (i) => {
      gIndex = i;
      lbImg.src = imgs[gIndex].src;
      lbImg.alt = imgs[gIndex].alt || "صورة عمل";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    };

    const close = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
    };

    const gNext = () => open((gIndex + 1) % imgs.length);
    const gPrev = () => open((gIndex - 1 + imgs.length) % imgs.length);

    imgs.forEach((im, i) => im.addEventListener("click", () => open(i)));
    lbClose && lbClose.addEventListener("click", close);
    lbNext && lbNext.addEventListener("click", gNext);
    lbPrev && lbPrev.addEventListener("click", gPrev);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });

    window.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") gPrev();
      if (e.key === "ArrowLeft") gNext();
    });
  }

  // ====== Contact form => WhatsApp message ======
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get("name") || "").toString().trim();
      const p = (fd.get("phone") || "").toString().trim();
      const device = (fd.get("device") || "").toString().trim();
      const msg = (fd.get("msg") || "").toString().trim();

      const text =
        `مرحبًا، أنا ${name}%0A` +
        `رقمي: ${p}%0A` +
        `نوع الجهاز: ${device}%0A` +
        `المشكلة: ${msg}`;

      window.open(`https://wa.me/${whatsapp}?text=${text}`, "_blank", "noopener");
    });
  }
})();

// ====== Back to Top Button ======
const toTop = document.getElementById("toTop");
if (toTop) {
  const toggleToTop = () => {
    // يظهر بعد 400px نزول
    if (window.scrollY > 400) toTop.classList.add("is-show");
    else toTop.classList.remove("is-show");
  };

  toggleToTop();
  window.addEventListener("scroll", toggleToTop, { passive: true });

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
// FAQ Accordion: افتح واحد فقط
const faqItems = document.querySelectorAll('.faqList .faq');

faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    }
  });
});


// ===== Reviews Carousel (independent, supports drag + dots + arrows) =====
(function initReviewsCarousel(){
  const root = document.querySelector('.rCarousel');
  if(!root) return;

  const viewport = root.querySelector('.rViewport');
  const track = root.querySelector('.rTrack');
  const slides = Array.from(root.querySelectorAll('.rSlide'));
  const btnPrev = root.querySelector('[data-rprev], .rArrow--prev');
  const btnNext = root.querySelector('[data-rnext], .rArrow--next');
  const dotsWrap = root.querySelector('.rDots');

  if(!viewport || !track || slides.length === 0) return;

  let index = 0;
  let startX = 0;
  let dx = 0;
  let dragging = false;

  // build dots if not exists
  let dots = [];
  if(dotsWrap){
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rDot' + (i === 0 ? ' is-active' : '');
      b.setAttribute('aria-label', `انتقال إلى الشهادة رقم ${i+1}`);
      b.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(b);
      dots.push(b);
    });
  }

  function update(){
    track.style.transform = `translateX(-${index * 100}%)`;

    // aria (اختياري)
    slides.forEach((s, i) => s.setAttribute('aria-hidden', i === index ? 'false' : 'true'));

    if(dots.length){
      dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    }
  }

  function next(){
    index = (index + 1) % slides.length;
    update();
  }
  function prev(){
    index = (index - 1 + slides.length) % slides.length;
    update();
  }
  function goTo(i){
    index = Math.max(0, Math.min(slides.length - 1, i));
    update();
  }

  // arrows
  if(btnPrev) btnPrev.addEventListener('click', prev);
  if(btnNext) btnNext.addEventListener('click', next);

  // drag (mouse + touch via pointer events)
  viewport.addEventListener('pointerdown', (e) => {
    dragging = true;
    startX = e.clientX;
    dx = 0;
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture(e.pointerId);
    track.style.transition = 'none';
  });

  viewport.addEventListener('pointermove', (e) => {
    if(!dragging) return;
    dx = e.clientX - startX;
    track.style.transform = `translateX(calc(-${index * 100}% + ${dx}px))`;
  });

  function endDrag(){
    if(!dragging) return;
    dragging = false;
    viewport.classList.remove('is-dragging');
    track.style.transition = ''; // يرجع الانتقال

    const TH = 60; // threshold
    if(dx <= -TH) next();      // سحب لليسار -> التالي
    else if(dx >= TH) prev();  // سحب لليمين -> السابق
    else update();             // رجوع
    dx = 0;
  }

  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  // wheel (trackpad/mouse horizontal)
  viewport.addEventListener('wheel', (e) => {
    const ax = Math.abs(e.deltaX);
    const ay = Math.abs(e.deltaY);
    if(ax > ay && ax > 8){
      e.preventDefault();
      if(e.deltaX > 0) next();
      else prev();
    }
  }, { passive:false });

  update();
})();
