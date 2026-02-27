const COURSE_DOMAINS = [
  "Agile & Scrum",
  "AI & Machine Learning",
  "Big Data",
  "Business & Leadership",
  "Cloud Computing & DevOps",
  "Cyber Security",
  "Data Science & Business Analytics",
  "Digital Marketing",
  "Generative AI",
  "IT Service & Architecture",
  "Project Management",
  "Quality Management",
  "Software Development",
];

const EXPERIENCE_BANDS = {
  "0-1": { min: 0, max: 1 },
  "1-3": { min: 1, max: 3 },
  "3-5": { min: 3, max: 5 },
  "5-8": { min: 5, max: 8 },
  "8-12": { min: 8, max: 12 },
  "12-15": { min: 12, max: 15 },
  "15+": { min: 15, max: 22 },
};

// Approximate India-market LPA midpoints by role-family (2026-ish, practical ranges).
// We compute a range around a midpoint and then apply adjustments for experience + role shift.
const ROLE_FAMILIES = [
  {
    family: "data_analytics",
    keywords: ["data analyst", "business analyst", "analytics", "bi analyst", "power bi", "tableau"],
    baseMidLpa: 9.5,
  },
  {
    family: "data_science_ml",
    keywords: ["data scientist", "machine learning", "ml engineer", "ai engineer", "deep learning"],
    baseMidLpa: 14.5,
  },
  {
    family: "generative_ai",
    keywords: ["generative", "llm", "prompt", "genai", "rag", "ai engineer"],
    baseMidLpa: 16.5,
  },
  {
    family: "cloud_devops",
    keywords: ["devops", "cloud engineer", "site reliability", "sre", "platform engineer", "aws", "azure", "gcp"],
    baseMidLpa: 13.0,
  },
  {
    family: "software_dev",
    keywords: ["software", "developer", "engineer", "full stack", "backend", "frontend", "mobile", "java", "python", "node", "react"],
    baseMidLpa: 12.0,
  },
  {
    family: "cyber_security",
    keywords: ["security", "soc", "penetration", "pentest", "appsec", "cyber", "siem"],
    baseMidLpa: 12.5,
  },
  {
    family: "project_product",
    keywords: ["project manager", "program manager", "scrum master", "product manager", "delivery manager"],
    baseMidLpa: 15.0,
  },
  {
    family: "quality_testing",
    keywords: ["qa", "quality", "tester", "test engineer", "automation", "sdet"],
    baseMidLpa: 8.5,
  },
  {
    family: "digital_marketing",
    keywords: ["marketing", "performance marketing", "seo", "sem", "growth", "digital marketing"],
    baseMidLpa: 7.5,
  },
  {
    family: "it_service_arch",
    keywords: ["solution architect", "architect", "it service", "service management", "itil", "enterprise architect"],
    baseMidLpa: 18.0,
  },
  {
    family: "business_leadership",
    keywords: ["business", "strategy", "operations", "lead", "leadership", "consultant"],
    baseMidLpa: 13.5,
  },
  {
    family: "big_data",
    keywords: ["big data", "data engineer", "spark", "hadoop", "etl", "pipeline"],
    baseMidLpa: 14.0,
  },
];

function normalizeRole(str) {
  return String(str || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function detectFamily(role) {
  const r = normalizeRole(role);
  if (!r) return null;

  for (const f of ROLE_FAMILIES) {
    for (const kw of f.keywords) {
      if (r.includes(kw)) return f.family;
    }
  }
  return null;
}

function pickFamilyOrFallback(role) {
  const fam = detectFamily(role);
  if (fam) return fam;
  // Fallback: treat unknown target roles as "software_dev" if it smells technical, else "business_leadership"
  const r = normalizeRole(role);
  const looksTech = /(engineer|developer|dev|data|cloud|security|analyst|architect|ai|ml|devops|qa|sre)/.test(r);
  return looksTech ? "software_dev" : "business_leadership";
}

function familyBaseMidLpa(family) {
  const row = ROLE_FAMILIES.find((x) => x.family === family);
  return row ? row.baseMidLpa : 11.0;
}

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

function experienceFactor(experienceKey) {
  const band = EXPERIENCE_BANDS[experienceKey];
  if (!band) return 0.0;
  const mid = (band.min + band.max) / 2;
  // 0y => ~0.0, 10y => ~0.55, 18y => ~0.75
  return clamp(Math.log10(1 + mid) / Math.log10(1 + 18), 0, 0.85);
}

function roleShiftBoost({ currentFamily, targetFamily }) {
  if (!currentFamily) return 0.08; // career entry / unclear: modest benefit
  if (currentFamily === targetFamily) return 0.07; // same track: upskill boost

  // common transitions where upskilling tends to materially improve outcomes
  const pairs = new Set([
    "quality_testing->software_dev",
    "quality_testing->data_analytics",
    "digital_marketing->data_analytics",
    "data_analytics->data_science_ml",
    "software_dev->cloud_devops",
    "software_dev->cyber_security",
    "business_leadership->project_product",
  ]);

  const key = `${currentFamily}->${targetFamily}`;
  if (pairs.has(key)) return 0.16;
  return 0.12;
}

function computeSalaryEstimate({ experienceKey, currentRole, targetRole }) {
  const targetFamily = pickFamilyOrFallback(targetRole);
  const currentFamily = detectFamily(currentRole);

  const baseMid = familyBaseMidLpa(targetFamily);
  const expF = experienceFactor(experienceKey);
  const shift = roleShiftBoost({ currentFamily, targetFamily });

  // Construct midpoint:
  // baseMid grows with experience and then applies an "upskill" multiplier.
  const expUplift = 1 + expF * 0.85; // up to +72% for seniority
  const upskillUplift = 1 + shift; // +7%..+16% typical
  const midpoint = baseMid * expUplift * upskillUplift;

  // Range width based on experience (more experience => slightly wider variability)
  const spread = clamp(0.14 + expF * 0.10, 0.14, 0.24);
  const low = midpoint * (1 - spread);
  const high = midpoint * (1 + spread);

  // Guard rails for a "practical" output
  const practicalLow = clamp(low, 3.5, 85);
  const practicalHigh = clamp(high, practicalLow + 0.8, 95);

  return {
    targetFamily,
    currentFamily,
    lowLpa: practicalLow,
    highLpa: practicalHigh,
    midpointLpa: clamp(midpoint, 4, 95),
    shiftPct: shift,
  };
}

function formatLpaRange(low, high) {
  const l = Math.round(low * 2) / 2;
  const h = Math.round(high * 2) / 2;
  return `₹${l}–${h} LPA`;
}

function familyLabel(fam) {
  const labels = {
    data_analytics: "Data & Business Analytics",
    data_science_ml: "Data Science / ML",
    generative_ai: "Generative AI",
    cloud_devops: "Cloud / DevOps",
    software_dev: "Software Development",
    cyber_security: "Cyber Security",
    project_product: "Project / Product",
    quality_testing: "Quality / Testing",
    digital_marketing: "Digital Marketing",
    it_service_arch: "IT Service / Architecture",
    business_leadership: "Business & Leadership",
    big_data: "Big Data / Data Engineering",
  };
  return labels[fam] || "General";
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildResultHtml({ experienceKey, currentRole, targetRole, estimate }) {
  const range = formatLpaRange(estimate.lowLpa, estimate.highLpa);
  const target = escapeHtml(targetRole);
  const current = escapeHtml(currentRole);
  const exp = escapeHtml(experienceKey);
  const track = familyLabel(estimate.targetFamily);
  const upliftPct = Math.round(estimate.shiftPct * 100);

  return `
    <div class="result__headline">
      <div class="result__salary">${range}</div>
      <div class="result__range">Potential salary range aligned to “${target}”</div>
    </div>
    <div class="result__details">
      Based on <b>${exp} years</b> experience, moving from <b>${current}</b> toward <b>${target}</b>.
      This estimate assumes focused upskilling using the ₹10,000 Simplilearn partnership program and realistic hiring outcomes.
    </div>
    <div class="result__badgeRow">
      <span class="badge badge--forza">Target track: ${track}</span>
      <span class="badge badge--energia">Upskilling impact: ~${upliftPct}%</span>
      <span class="badge">India-market LPA estimate</span>
    </div>
  `;
}

function renderCarousel() {
  const track = document.getElementById("carouselTrack");
  if (!track) return;

  track.innerHTML = COURSE_DOMAINS.map(
    (d) => `<div class="chipWrap"><div class="chip" role="note">${escapeHtml(d)}</div></div>`
  ).join("");

  // Auto-scroll (one domain at a time)
  let idx = 0;
  const count = COURSE_DOMAINS.length;
  let paused = false;

  const step = () => {
    if (paused) return;
    idx = (idx + 1) % count;
    track.style.transform = `translateX(-${idx * 100}%)`;
  };

  const intervalMs = 2200;
  setInterval(step, intervalMs);

  // Pause on hover or keyboard focus anywhere in carousel
  const carousel = track.closest(".carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", () => (paused = true));
    carousel.addEventListener("mouseleave", () => (paused = false));
    carousel.addEventListener("focusin", () => (paused = true));
    carousel.addEventListener("focusout", () => (paused = false));
  }
}

function setupForm() {
  const form = document.getElementById("salaryForm");
  const result = document.getElementById("result");
  const cta = document.getElementById("cta");

  if (!form || !result || !cta) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const experienceKey = document.getElementById("experience")?.value || "";
    const currentRole = document.getElementById("currentRole")?.value || "";
    const targetRole = document.getElementById("targetRole")?.value || "";

    if (!experienceKey || !currentRole.trim() || !targetRole.trim()) {
      result.hidden = false;
      result.innerHTML =
        '<div class="result__details"><b>Please fill all fields</b> to generate an estimate.</div>';
      return;
    }

    cta.disabled = true;
    cta.textContent = "Calculating…";

    // Small delay for perceived responsiveness
    setTimeout(() => {
      const estimate = computeSalaryEstimate({ experienceKey, currentRole, targetRole });
      result.hidden = false;
      result.innerHTML = buildResultHtml({ experienceKey, currentRole, targetRole, estimate });
      cta.disabled = false;
      cta.textContent = "Get my salary estimate";
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 250);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCarousel();
  setupForm();
});
