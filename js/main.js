/* Baraka Collection — prototype JS */

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initScroll();
  initBookingForm();
  prefillLocationFromQuery();
});

/* --- Mobile nav toggle ---------------------------------- */
function initNav() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!nav || !toggle || !links) return;

  const setOpen = (isOpen) => {
    nav.classList.toggle("menu-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Menu");
  };

  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("menu-open"));
  });

  // Close when a nav link is tapped
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });

  // Also close when the CTA is tapped (it's inside nav on mobile)
  const cta = document.querySelector(".nav-cta");
  if (cta) cta.addEventListener("click", () => setOpen(false));

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("menu-open")) setOpen(false);
  });

  // If the viewport resizes past the mobile breakpoint while open, close it
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860 && nav.classList.contains("menu-open")) setOpen(false);
  });
}

/* --- Add .scrolled class on nav when past the fold ------ */
function initScroll() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  // Only apply scrolled state on pages with dark hero
  if (!nav.classList.contains("on-dark")) return;

  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* --- Booking form (prototype: fake submit + success) ---- */
function initBookingForm() {
  const form = document.querySelector("#booking-form");
  const success = document.querySelector("#booking-success");
  if (!form || !success) return;

  // Set min date on check-in to today; check-out to day after check-in
  const checkIn = form.querySelector('input[name="check_in"]');
  const checkOut = form.querySelector('input[name="check_out"]');
  const today = new Date().toISOString().split("T")[0];
  if (checkIn) checkIn.min = today;
  if (checkOut) checkOut.min = today;
  if (checkIn && checkOut) {
    checkIn.addEventListener("change", () => {
      checkOut.min = checkIn.value || today;
      if (checkOut.value && checkOut.value < checkIn.value) checkOut.value = "";
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Prototype only — no data is sent anywhere.
    // Wire to Formspree here: form.action = "https://formspree.io/f/YOUR_ID"; form.method = "POST";
    form.style.display = "none";
    success.classList.add("show");
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* --- Prefill location dropdown from ?location=diani ----- */
function prefillLocationFromQuery() {
  const select = document.querySelector('#booking-form select[name="location"]');
  if (!select) return;
  const params = new URLSearchParams(window.location.search);
  const loc = params.get("location");
  if (!loc) return;
  const match = Array.from(select.options).find(
    (o) => o.value.toLowerCase() === loc.toLowerCase()
  );
  if (match) select.value = match.value;
}
