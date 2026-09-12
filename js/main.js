/* =========================================================
   Malewa · Clavina · Clavina Pax — site behaviour

   No dependencies. Everything degrades gracefully: the site is
   readable and navigable with JavaScript disabled, apart from the
   lightbox and the indicative rate estimate on the enquiry form.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  markMissingPhotos();
  initNav();
  initScrollState();
  initLightbox();
  initEnquiryForm();
  prefillFromQuery();
});

/* ---------------------------------------------------------
   Photography slots
   Every photo sits inside a .photo wrapper. If a file has not
   been supplied yet, the wrapper shows a labelled slot instead
   of a broken image.
   --------------------------------------------------------- */

function fillPhotoSlot(holder, img) {
  if (!holder || holder.classList.contains("is-missing")) return;
  holder.classList.add("is-missing");

  // Gallery items carry a caption overlay; suppress it while the slot is empty
  // so the label and the caption cannot collide.
  const galleryItem = holder.closest(".gallery-item");
  if (galleryItem) galleryItem.classList.add("is-missing");

  if (holder.querySelector(".photo__slot")) return;

  const slot = document.createElement("span");
  slot.className = "photo__slot";

  const label = document.createElement("span");
  label.className = "photo__slot-label";
  label.textContent = holder.dataset.slot || "Photograph";

  const file = document.createElement("span");
  file.className = "photo__slot-file";
  file.textContent = img ? img.getAttribute("src") : "";

  slot.append(label, file);
  holder.append(slot);
}

function markMissingPhotos() {
  document.querySelectorAll(".photo > img").forEach((img) => {
    if (img.complete && img.naturalWidth === 0) {
      fillPhotoSlot(img.closest(".photo"), img);
    }
  });
}

// Image error events do not bubble, so listen in the capture phase.
document.addEventListener(
  "error",
  (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) return;
    fillPhotoSlot(img.closest(".photo"), img);
  },
  true
);

/* ---------------------------------------------------------
   Navigation
   --------------------------------------------------------- */

const NAV_BREAKPOINT = 1080;

function initNav() {
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".site-nav__toggle");
  const panel = document.querySelector(".site-nav__links");
  if (!nav || !toggle || !panel) return;

  const focusables = () =>
    Array.from(nav.querySelectorAll("a[href], button:not([disabled])")).filter(
      (el) => el.offsetParent !== null
    );

  const setOpen = (isOpen, { returnFocus = false } = {}) => {
    nav.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("is-locked", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

    if (isOpen) {
      const first = panel.querySelector("a");
      if (first) first.focus({ preventScroll: true });
    } else if (returnFocus) {
      toggle.focus({ preventScroll: true });
    }
  };

  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("is-open"));
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  const cta = nav.querySelector(".site-nav__cta");
  if (cta) cta.addEventListener("click", () => setOpen(false));

  document.addEventListener("keydown", (event) => {
    if (!nav.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      setOpen(false, { returnFocus: true });
      return;
    }

    if (event.key === "Tab") {
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > NAV_BREAKPOINT && nav.classList.contains("is-open")) {
      setOpen(false);
    }
  });
}

function initScrollState() {
  const nav = document.querySelector(".site-nav--overlay");
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------------------------------------------------------
   Gallery lightbox
   --------------------------------------------------------- */

function initLightbox() {
  const items = Array.from(document.querySelectorAll("[data-lightbox-src]"));
  if (!items.length) return;

  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Property photography");
  box.innerHTML = `
    <button type="button" class="lightbox__close" aria-label="Close gallery">
      <span aria-hidden="true">&#10005;</span>
    </button>
    <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Previous photograph">
      <span aria-hidden="true">&#8249;</span>
    </button>
    <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Next photograph">
      <span aria-hidden="true">&#8250;</span>
    </button>
    <figure class="lightbox__figure">
      <img class="lightbox__img" src="" alt="" />
      <p class="lightbox__fallback"></p>
      <figcaption class="lightbox__caption"></figcaption>
    </figure>
  `;
  document.body.append(box);

  const figure = box.querySelector(".lightbox__figure");
  const img = box.querySelector(".lightbox__img");
  const fallback = box.querySelector(".lightbox__fallback");
  const caption = box.querySelector(".lightbox__caption");
  const closeBtn = box.querySelector(".lightbox__close");
  const prevBtn = box.querySelector(".lightbox__nav--prev");
  const nextBtn = box.querySelector(".lightbox__nav--next");

  let index = 0;
  let lastFocused = null;

  const showFallback = (item) => {
    figure.classList.add("is-missing");
    img.style.visibility = "hidden";
    fallback.textContent = `Photograph to be supplied — ${
      item?.dataset.lightboxCaption || "this property"
    }`;
  };

  const render = () => {
    const item = items[index];
    const missing = item
      .closest(".gallery-item")
      ?.querySelector(".photo")
      ?.classList.contains("is-missing");

    figure.classList.toggle("is-missing", Boolean(missing));
    img.style.visibility = missing ? "hidden" : "";
    fallback.textContent = missing
      ? `Photograph to be supplied — ${item.dataset.lightboxCaption || "this property"}`
      : "";
    img.src = item.dataset.lightboxSrc;
    img.alt = item.dataset.lightboxAlt || "";
    caption.textContent = item.dataset.lightboxCaption || "";

    const many = items.length > 1;
    prevBtn.hidden = !many;
    nextBtn.hidden = !many;
  };

  const open = (i) => {
    index = i;
    lastFocused = document.activeElement;
    render();
    box.classList.add("is-open");
    document.body.classList.add("is-locked");
    closeBtn.focus({ preventScroll: true });
  };

  const close = () => {
    box.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    if (lastFocused) lastFocused.focus({ preventScroll: true });
  };

  const step = (delta) => {
    index = (index + delta + items.length) % items.length;
    render();
  };

  items.forEach((item, i) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      open(i);
    });
  });

  img.addEventListener("error", () => showFallback(items[index]));
  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));

  box.addEventListener("click", (event) => {
    if (event.target === box) close();
  });

  document.addEventListener("keydown", (event) => {
    if (!box.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") step(-1);
    if (event.key === "ArrowRight") step(1);
  });
}

/* ---------------------------------------------------------
   Enquiry form

   Rates below are transcribed from the Malewa brochure and are
   quoted per room, per night, in Kenyan shillings. They apply to
   Malewa accommodation only — no rates are invented for Clavina
   or Clavina Pax.
   --------------------------------------------------------- */

const COTTAGE_RATES = {
  single: {
    "1-4": { bb: 6000, hb: 7500, fb: 9000 },
    "5-6": { bb: 6500, hb: 8000, fb: 9500 },
  },
  double: {
    "1-4": { bb: 6500, hb: 9500, fb: 12500 },
    "5-6": { bb: 7500, hb: 10000, fb: 13500 },
  },
};

const OLOLESHWA_RATES = {
  single: { bb: 5000 },
  double: { bb: 6500 },
};

const SELF_CATERING_DISCOUNT = 0.3;

const MEAL_LABELS = {
  bb: "Bed & breakfast",
  hb: "Half board",
  fb: "Full board",
  self_catering: "Self catering",
};

const nf = new Intl.NumberFormat("en-KE");

const formatKes = (amount) => `KES ${nf.format(Math.round(amount))}`;

function nightlyRate({ accommodation, occupancy, mealPlan, rooms }) {
  const band = rooms >= 5 ? "5-6" : "1-4";

  if (accommodation === "ololeshwa") {
    if (mealPlan === "self_catering") {
      const base = OLOLESHWA_RATES[occupancy]?.bb;
      return base ? base * (1 - SELF_CATERING_DISCOUNT) : null;
    }
    if (mealPlan !== "bb") return null;
    return OLOLESHWA_RATES[occupancy]?.bb ?? null;
  }

  if (accommodation === "cottages") {
    if (mealPlan === "self_catering") return null;
    return COTTAGE_RATES[occupancy]?.[band]?.[mealPlan] ?? null;
  }

  return null;
}

function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const nights = Math.round(
    (new Date(`${checkOut}T00:00:00`) - new Date(`${checkIn}T00:00:00`)) / 86400000
  );
  return nights > 0 ? nights : 0;
}

function initEnquiryForm() {
  const form = document.querySelector("#enquiry-form");
  if (!form) return;

  const status = document.querySelector("#enquiry-status");
  const amountEl = document.querySelector("#rate-amount");
  const detailEl = document.querySelector("#rate-detail");

  const fields = {
    full_name: form.elements.full_name,
    email: form.elements.email,
    phone: form.elements.phone,
    purpose: form.elements.purpose,
    property: form.elements.property,
    check_in: form.elements.check_in,
    check_out: form.elements.check_out,
    guests_stay: form.elements.guests_stay,
    accommodation: form.elements.accommodation,
    occupancy: form.elements.occupancy,
    meal_plan: form.elements.meal_plan,
    rooms: form.elements.rooms,
    dining_date: form.elements.dining_date,
    dining_time: form.elements.dining_time,
    guests_dining: form.elements.guests_dining,
    occasion: form.elements.occasion,
  };

  const sections = Array.from(form.querySelectorAll("[data-property]"));

  const activeFields = () =>
    Object.values(fields).filter(
      (field) => field && field.offsetParent !== null && !field.disabled
    );

  /* --- Date floors --------------------------------------- */
  const today = new Date().toISOString().split("T")[0];
  [fields.check_in, fields.check_out, fields.dining_date].forEach((field) => {
    if (field) field.min = today;
  });

  fields.check_in?.addEventListener("change", () => {
    fields.check_out.min = fields.check_in.value || today;
    if (fields.check_out.value && fields.check_out.value <= fields.check_in.value) {
      fields.check_out.value = "";
    }
    renderSummary();
  });

  /* --- Meal plans are limited by accommodation ------------ */
  const mealOptions = {
    cottages: ["bb", "hb", "fb"],
    ololeshwa: ["bb", "self_catering"],
    not_sure: ["bb", "hb", "fb", "self_catering"],
  };

  const syncMealPlans = () => {
    if (!fields.meal_plan) return;
    const choice = fields.accommodation?.value || "cottages";
    const allowed = mealOptions[choice] || mealOptions.cottages;

    Array.from(fields.meal_plan.options).forEach((option) => {
      if (!option.value) return;
      const permitted = allowed.includes(option.value);
      option.disabled = !permitted;
      option.hidden = !permitted;
    });

    if (!allowed.includes(fields.meal_plan.value)) {
      fields.meal_plan.value = allowed[0];
    }
  };

  /* --- Show only the fields that apply to the property ---- */
  const syncProperty = () => {
    const property = fields.property?.value || "malewa";

    sections.forEach((section) => {
      const applies = section.dataset.property.split(" ").includes(property);
      section.hidden = !applies;
      section.querySelectorAll("input, select, textarea").forEach((field) => {
        field.disabled = !applies;
        if (!applies) setError(field, "");
      });
    });

    syncMealPlans();
    renderSummary();
  };

  /* --- Indicative rate (Malewa only) ---------------------- */
  function renderSummary() {
    if (!amountEl || !detailEl) return;

    if (fields.property?.value !== "malewa") return;

    const rooms = Number(fields.rooms?.value) || 0;
    const nights = nightsBetween(fields.check_in?.value, fields.check_out?.value);
    const rate = nightlyRate({
      accommodation: fields.accommodation?.value,
      occupancy: fields.occupancy?.value,
      mealPlan: fields.meal_plan?.value,
      rooms,
    });

    if (!rate) {
      amountEl.textContent = "Rate on request";
      detailEl.textContent =
        "Tell us the accommodation, occupancy and meal plan you would like and we will confirm the applicable rate.";
      return;
    }

    amountEl.textContent = formatKes(rate);

    const parts = [
      `per room, per night · ${MEAL_LABELS[fields.meal_plan.value] || ""}`.trim(),
      `Cottage rates for ${rooms >= 5 ? "5–6" : "1–4"} rooms`,
    ];

    if (nights > 0 && rooms > 0) {
      parts.push(
        `${rooms} room${rooms > 1 ? "s" : ""} × ${nights} night${nights > 1 ? "s" : ""} — indicative total ${formatKes(
          rate * nights * rooms
        )}`
      );
    }

    detailEl.textContent = parts.join(" · ");
  }

  /* --- Validation ----------------------------------------- */
  function setError(field, message) {
    const wrapper = field.closest(".field");
    if (!wrapper) return;

    let errorEl = wrapper.querySelector(".field-error");
    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.className = "field-error";
      wrapper.append(errorEl);
    }

    if (message) {
      wrapper.classList.add("field--error");
      field.setAttribute("aria-invalid", "true");
      errorEl.id = errorEl.id || `${field.name}-error`;
      field.setAttribute("aria-describedby", errorEl.id);
      errorEl.textContent = message;
    } else {
      wrapper.classList.remove("field--error");
      field.removeAttribute("aria-invalid");
      errorEl.textContent = "";
    }
  }

  const validators = {
    full_name: (value) => (value.trim().length >= 2 ? "" : "Please tell us your name."),
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
        ? ""
        : "Please enter a valid email address.",
    phone: (value) =>
      value.replace(/[^\d]/g, "").length >= 9
        ? ""
        : "Please enter a phone number we can reach you on.",
    property: (value) => (value ? "" : "Please choose a property."),
    check_in: (value) => (value ? "" : "Please choose an arrival date."),
    check_out: (value) => {
      if (!value) return "Please choose a departure date.";
      if (fields.check_in.value && value <= fields.check_in.value) {
        return "Departure must be after arrival.";
      }
      return "";
    },
    guests_stay: (value) => (value ? "" : "Please tell us how many guests."),
    accommodation: (value) => (value ? "" : "Please choose an accommodation type."),
    occupancy: (value) => (value ? "" : "Please choose single or double occupancy."),
    meal_plan: (value) => (value ? "" : "Please choose a meal plan."),
    rooms: (value) => (value ? "" : "Please choose how many rooms you need."),
    dining_date: (value) => (value ? "" : "Please choose a date."),
    dining_time: (value) => (value ? "" : "Please choose a time."),
    guests_dining: (value) => (value ? "" : "Please tell us how many guests."),
  };

  const validateField = (field) => {
    const validator = validators[field.name];
    if (!validator) return true;
    const message = validator(field.value);
    setError(field, message);
    return !message;
  };

  Object.values(fields).forEach((field) => {
    if (!field) return;
    field.addEventListener("blur", () => validateField(field));
  });

  form.addEventListener("input", (event) => {
    if (event.target === fields.accommodation) syncMealPlans();
    if (event.target === fields.property) syncProperty();
    renderSummary();
  });

  form.addEventListener("change", (event) => {
    if (event.target === fields.property) syncProperty();
    renderSummary();
  });

  syncProperty();

  /* --- Submission ----------------------------------------- */
  const buildSummaryText = () => {
    const data = new FormData(form);
    const labels = {
      full_name: "Name",
      email: "Email",
      phone: "Phone",
      property: "Property",
      purpose: "Purpose",
      check_in: "Arrival",
      check_out: "Departure",
      guests_stay: "Guests",
      accommodation: "Accommodation",
      occupancy: "Occupancy",
      meal_plan: "Meal plan",
      rooms: "Rooms",
      dining_date: "Dining date",
      dining_time: "Dining time",
      guests_dining: "Dining guests",
      occasion: "Occasion",
      requests: "Message",
    };

    return Object.entries(labels)
      .map(([key, label]) => {
        const value = data.get(key);
        return value && String(value).trim() ? `${label}: ${value}` : null;
      })
      .filter(Boolean)
      .join("\n");
  };

  const showStatus = (sent, summaryText) => {
    if (!status) return;
    status.hidden = false;

    const mailto = `mailto:${"malewariversideresort@gmail.com"}?subject=${encodeURIComponent(
      "Booking enquiry — Malewa, Clavina & Clavina Pax"
    )}&body=${encodeURIComponent(summaryText)}`;

    status.innerHTML = sent
      ? `<strong>Thank you — your enquiry has been sent.</strong>
         <span>We will reply with availability and the applicable rate. If you would like to reach us sooner, call
         <a href="tel:+254704025999">+254 704 025 999</a> or
         <a href="tel:+254704026208">+254 704 026 208</a>.</span>`
      : `<strong>Prototype mode — this enquiry has not been sent yet.</strong>
         <span>The site is not yet connected to the group's booking inbox. To send these details now,
         <a href="${mailto}">open this enquiry in your email app</a>, or call
         <a href="tel:+254704025999">+254 704 025 999</a>.</span>`;

    status.focus({ preventScroll: true });
    status.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const results = activeFields().map(validateField);
    if (results.includes(false)) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const summaryText = buildSummaryText();
    const endpoint = form.dataset.endpoint?.trim();

    if (!endpoint) {
      showStatus(false, summaryText);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      form.hidden = true;
      showStatus(true, summaryText);
    } catch (error) {
      showStatus(false, summaryText);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send enquiry";
      }
    }
  });
}

/* ---------------------------------------------------------
   Hand context to the form from a link, e.g.
     book.html?property=clavina-pax
     book.html?property=malewa&purpose=conference
   --------------------------------------------------------- */

function prefillFromQuery() {
  const form = document.querySelector("#enquiry-form");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);

  const pick = (fieldName, value) => {
    const field = form.elements[fieldName];
    if (!field || !value) return false;

    const wanted = value.toLowerCase().trim();
    const match = Array.from(field.options).find((option) => {
      const optionValue = option.value.toLowerCase();
      return optionValue === wanted || optionValue.replace(/\s+/g, "-") === wanted;
    });

    if (!match) return false;
    field.value = match.value;
    field.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  };

  pick("property", params.get("property"));
  pick("purpose", params.get("purpose"));
}
