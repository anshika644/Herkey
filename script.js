const courseDomains = [
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

const experienceBands = {
  "0-1": { min: 3.6, max: 6.5 },
  "1-3": { min: 5.4, max: 9.8 },
  "3-5": { min: 8.4, max: 14.6 },
  "5-8": { min: 12.2, max: 20.8 },
  "8-12": { min: 17.5, max: 30.4 },
  "12+": { min: 24.8, max: 42.7 },
};

const roleMultipliers = [
  { pattern: /(generative ai|gen ai|llm|machine learning|artificial intelligence|\bai\b|\bml\b)/i, value: 1.34 },
  { pattern: /(data science|data scientist|big data|analytics|analyst|business intelligence|\bbi\b)/i, value: 1.24 },
  { pattern: /(cloud|devops|sre|site reliability|platform|kubernetes)/i, value: 1.22 },
  { pattern: /(cyber|security|infosec|soc|ethical hacker|penetration)/i, value: 1.23 },
  { pattern: /(software|developer|engineer|full stack|backend|frontend|mobile)/i, value: 1.18 },
  { pattern: /(project|program|agile|scrum|pmp)/i, value: 1.17 },
  { pattern: /(architecture|architect|it service|itil)/i, value: 1.16 },
  { pattern: /(quality|qa|testing|automation)/i, value: 1.15 },
  { pattern: /(business|leadership|manager|director|head)/i, value: 1.19 },
  { pattern: /(digital marketing|seo|performance marketing|growth|content marketing)/i, value: 1.14 },
];

const salaryForm = document.getElementById("salaryForm");
const experienceSelect = document.getElementById("experience");
const currentRoleInput = document.getElementById("currentRole");
const targetRoleInput = document.getElementById("targetRole");
const formError = document.getElementById("formError");

const estimateCard = document.getElementById("estimateCard");
const potentialRangeNode = document.getElementById("potentialRange");
const currentRangeNode = document.getElementById("currentRange");
const upliftLineNode = document.getElementById("upliftLine");

const chipTrack = document.getElementById("chipTrack");
const chipIndex = document.getElementById("chipIndex");
const chipPrev = document.getElementById("chipPrev");
const chipNext = document.getElementById("chipNext");
const chipCarousel = document.getElementById("chipCarousel");

let currentChipIndex = 0;
let autoScrollId = null;
const autoScrollMs = 2200;

function clamp(value, minValue, maxValue) {
  return Math.min(Math.max(value, minValue), maxValue);
}

function formatLpa(value) {
  return value.toFixed(1);
}

function getRoleMultiplier(roleValue) {
  const role = roleValue.trim();
  if (!role) {
    return 1.04;
  }

  let detected = 1.1;
  roleMultipliers.forEach((entry) => {
    if (entry.pattern.test(role)) {
      detected = Math.max(detected, entry.value);
    }
  });
  return detected;
}

function getSeniorityIndex(roleValue) {
  const role = roleValue.toLowerCase();
  if (/(intern|trainee|fresher)/.test(role)) return 0;
  if (/(junior|associate)/.test(role)) return 1;
  if (/(engineer|analyst|developer|specialist|consultant)/.test(role)) return 2;
  if (/(senior|lead|principal)/.test(role)) return 3;
  if (/(manager|architect)/.test(role)) return 4;
  if (/(director|head|vp|chief)/.test(role)) return 5;
  return 2;
}

function getProgressionBoost(currentRole, targetRole) {
  const currentIndex = getSeniorityIndex(currentRole);
  const targetIndex = getSeniorityIndex(targetRole);
  const gain = targetIndex - currentIndex;
  return clamp(1 + gain * 0.03, 1, 1.15);
}

function buildSalaryEstimate(experienceValue, currentRole, targetRole) {
  const band = experienceBands[experienceValue];
  const currentRoleMultiplier = getRoleMultiplier(currentRole);
  const targetRoleMultiplier = getRoleMultiplier(targetRole);
  const progressionBoost = getProgressionBoost(currentRole, targetRole);
  const courseImpact = 1.09;

  const currentMin = band.min * currentRoleMultiplier * 0.9;
  const currentMax = band.max * currentRoleMultiplier * 0.97;

  let potentialMin = band.min * targetRoleMultiplier * progressionBoost * courseImpact;
  let potentialMax =
    band.max * targetRoleMultiplier * (progressionBoost + 0.05) * 1.07;

  if (potentialMin < currentMin + 0.8) {
    potentialMin = currentMin + 0.8;
  }
  if (potentialMax < potentialMin + 1.4) {
    potentialMax = potentialMin + 1.4;
  }

  const upliftMin = potentialMin - currentMin;
  const upliftMax = potentialMax - currentMax;

  return {
    currentMin,
    currentMax,
    potentialMin,
    potentialMax,
    upliftMin,
    upliftMax,
  };
}

function updateEstimateCard(estimate) {
  potentialRangeNode.textContent = `INR ${formatLpa(estimate.potentialMin)}L - INR ${formatLpa(
    estimate.potentialMax,
  )}L per annum`;
  currentRangeNode.textContent = `INR ${formatLpa(estimate.currentMin)}L - INR ${formatLpa(
    estimate.currentMax,
  )}L per annum`;
  upliftLineNode.textContent = `Potential uplift with this learning path: +INR ${formatLpa(
    estimate.upliftMin,
  )}L to +INR ${formatLpa(estimate.upliftMax)}L per annum`;
  estimateCard.hidden = false;
}

function showFormError(message) {
  formError.hidden = false;
  formError.textContent = message;
}

function clearFormError() {
  formError.hidden = true;
  formError.textContent = "";
}

salaryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const experienceValue = experienceSelect.value;
  const currentRole = currentRoleInput.value.trim();
  const targetRole = targetRoleInput.value.trim();

  if (!experienceValue || !currentRole || !targetRole) {
    showFormError("Please fill experience, current/last role, and target role.");
    return;
  }

  clearFormError();
  const estimate = buildSalaryEstimate(experienceValue, currentRole, targetRole);
  updateEstimateCard(estimate);
});

function renderCourseCarousel() {
  chipTrack.innerHTML = courseDomains
    .map(
      (domain) => `
      <div class="chip-slide">
        <span class="course-chip">${domain}</span>
      </div>`,
    )
    .join("");
}

function updateChipCarousel() {
  chipTrack.style.transform = `translateX(-${currentChipIndex * 100}%)`;
  chipIndex.textContent = `${currentChipIndex + 1} / ${courseDomains.length}`;
}

function goToNextChip() {
  currentChipIndex = (currentChipIndex + 1) % courseDomains.length;
  updateChipCarousel();
}

function goToPreviousChip() {
  currentChipIndex =
    (currentChipIndex - 1 + courseDomains.length) % courseDomains.length;
  updateChipCarousel();
}

function startAutoScroll() {
  stopAutoScroll();
  autoScrollId = window.setInterval(goToNextChip, autoScrollMs);
}

function stopAutoScroll() {
  if (autoScrollId) {
    window.clearInterval(autoScrollId);
    autoScrollId = null;
  }
}

chipPrev.addEventListener("click", () => {
  goToPreviousChip();
  startAutoScroll();
});

chipNext.addEventListener("click", () => {
  goToNextChip();
  startAutoScroll();
});

chipCarousel.addEventListener("mouseenter", stopAutoScroll);
chipCarousel.addEventListener("mouseleave", startAutoScroll);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAutoScroll();
  } else {
    startAutoScroll();
  }
});

renderCourseCarousel();
updateChipCarousel();
startAutoScroll();
