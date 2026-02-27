/* ===== Course Domains ===== */
const COURSES = [
  { name: "Agile & Scrum", icon: "⚡" },
  { name: "AI & Machine Learning", icon: "🤖" },
  { name: "Big Data", icon: "📊" },
  { name: "Business & Leadership", icon: "💼" },
  { name: "Cloud Computing & DevOps", icon: "☁️" },
  { name: "Cyber Security", icon: "🔒" },
  { name: "Data Science & Business Analytics", icon: "📈" },
  { name: "Digital Marketing", icon: "📱" },
  { name: "Generative AI", icon: "✨" },
  { name: "IT Service & Architecture", icon: "🏗️" },
  { name: "Project Management", icon: "📋" },
  { name: "Quality Management", icon: "✅" },
  { name: "Software Development", icon: "💻" },
];

/* ===== Salary Data (Indian market, annual in LPA) ===== */
const SALARY_MAP = {
  "software developer":       { base: [3.5, 5, 8, 12, 18, 24, 30], keyword: "software" },
  "software engineer":        { base: [4, 6, 9, 13, 19, 25, 32], keyword: "software" },
  "frontend developer":       { base: [3, 4.5, 7, 11, 16, 22, 28], keyword: "frontend" },
  "backend developer":        { base: [3.5, 5.5, 8, 12, 18, 24, 30], keyword: "backend" },
  "full stack developer":     { base: [3.5, 5.5, 9, 14, 20, 26, 32], keyword: "fullstack" },
  "web developer":            { base: [2.5, 4, 6, 9, 14, 18, 22], keyword: "web" },
  "mobile developer":         { base: [3, 5, 8, 12, 17, 22, 28], keyword: "mobile" },
  "android developer":        { base: [3, 5, 7.5, 11, 16, 21, 26], keyword: "mobile" },
  "ios developer":            { base: [3.5, 5.5, 8, 12, 17, 22, 28], keyword: "mobile" },
  "devops engineer":          { base: [4, 6, 10, 15, 22, 30, 38], keyword: "devops" },
  "cloud engineer":           { base: [4, 6.5, 10, 15, 22, 30, 38], keyword: "cloud" },
  "cloud architect":          { base: [8, 12, 18, 25, 35, 45, 55], keyword: "cloud" },
  "data scientist":           { base: [5, 8, 12, 18, 26, 35, 45], keyword: "data" },
  "data analyst":             { base: [3, 4.5, 7, 10, 15, 20, 25], keyword: "data" },
  "data engineer":            { base: [4, 6, 10, 15, 22, 28, 35], keyword: "data" },
  "business analyst":         { base: [3.5, 5, 8, 12, 17, 22, 28], keyword: "business" },
  "machine learning engineer":{ base: [5, 8, 13, 20, 28, 38, 48], keyword: "ml" },
  "ai engineer":              { base: [5, 8, 14, 22, 30, 40, 50], keyword: "ai" },
  "generative ai engineer":   { base: [6, 10, 16, 24, 34, 44, 55], keyword: "ai" },
  "prompt engineer":          { base: [4, 6, 10, 15, 20, 26, 32], keyword: "ai" },
  "cyber security analyst":   { base: [4, 6, 9, 14, 20, 27, 34], keyword: "security" },
  "security engineer":        { base: [4.5, 7, 10, 15, 22, 30, 38], keyword: "security" },
  "penetration tester":       { base: [4, 6, 9, 13, 18, 24, 30], keyword: "security" },
  "digital marketing manager":{ base: [3, 4.5, 7, 11, 16, 22, 28], keyword: "marketing" },
  "seo specialist":           { base: [2.5, 3.5, 5, 8, 12, 16, 20], keyword: "marketing" },
  "marketing executive":      { base: [2.5, 3.5, 5, 8, 12, 16, 20], keyword: "marketing" },
  "marketing manager":        { base: [3.5, 5, 8, 12, 18, 24, 30], keyword: "marketing" },
  "content marketer":         { base: [2.5, 3.5, 5, 7, 10, 14, 18], keyword: "marketing" },
  "social media manager":     { base: [2.5, 3.5, 5, 8, 12, 16, 20], keyword: "marketing" },
  "project manager":          { base: [5, 7, 10, 15, 22, 30, 38], keyword: "pm" },
  "product manager":          { base: [6, 8, 12, 18, 26, 35, 45], keyword: "pm" },
  "scrum master":             { base: [5, 7, 10, 15, 22, 28, 35], keyword: "agile" },
  "agile coach":              { base: [6, 8, 12, 18, 25, 32, 40], keyword: "agile" },
  "qa engineer":              { base: [3, 4.5, 7, 10, 15, 20, 25], keyword: "qa" },
  "quality analyst":          { base: [3, 4.5, 6, 9, 13, 18, 22], keyword: "qa" },
  "test engineer":            { base: [3, 4.5, 7, 10, 14, 19, 24], keyword: "qa" },
  "it manager":               { base: [5, 7, 10, 15, 22, 30, 38], keyword: "it" },
  "system administrator":     { base: [3, 4.5, 7, 10, 14, 18, 22], keyword: "it" },
  "solutions architect":      { base: [8, 12, 18, 25, 35, 45, 55], keyword: "architect" },
  "technical lead":           { base: [8, 10, 14, 20, 28, 36, 44], keyword: "lead" },
  "engineering manager":      { base: [10, 14, 20, 28, 38, 48, 58], keyword: "lead" },
  "big data engineer":        { base: [5, 7, 11, 16, 24, 32, 40], keyword: "bigdata" },
  "hadoop developer":         { base: [4, 6, 9, 14, 20, 26, 32], keyword: "bigdata" },
  "etl developer":            { base: [3.5, 5, 8, 12, 17, 22, 28], keyword: "data" },
  "power bi developer":       { base: [3, 5, 7, 10, 14, 18, 22], keyword: "data" },
  "tableau developer":        { base: [3, 5, 7, 10, 14, 18, 22], keyword: "data" },
  "blockchain developer":     { base: [5, 8, 12, 18, 26, 34, 42], keyword: "software" },
  "hr executive":             { base: [2.5, 3.5, 5, 7, 10, 14, 18], keyword: "business" },
  "operations manager":       { base: [4, 6, 9, 13, 18, 24, 30], keyword: "business" },
  "fresher":                  { base: [2.5, 3, 3.5, 4, 5, 6, 8], keyword: "general" },
  "intern":                   { base: [2, 2.5, 3, 3.5, 4, 5, 6], keyword: "general" },
  "trainee":                  { base: [2, 2.5, 3, 3.5, 4, 5, 6], keyword: "general" },
};

const KEYWORD_FALLBACKS = {
  software:  [3.5, 5, 8, 12, 18, 24, 30],
  frontend:  [3, 4.5, 7, 11, 16, 22, 28],
  backend:   [3.5, 5.5, 8, 12, 18, 24, 30],
  fullstack: [3.5, 5.5, 9, 14, 20, 26, 32],
  web:       [2.5, 4, 6, 9, 14, 18, 22],
  mobile:    [3, 5, 8, 12, 17, 22, 28],
  devops:    [4, 6, 10, 15, 22, 30, 38],
  cloud:     [4, 6.5, 10, 15, 22, 30, 38],
  data:      [3.5, 5, 8, 12, 18, 24, 30],
  ml:        [5, 8, 13, 20, 28, 38, 48],
  ai:        [5, 8, 14, 22, 30, 40, 50],
  security:  [4, 6, 9, 14, 20, 27, 34],
  marketing: [3, 4.5, 7, 11, 16, 22, 28],
  pm:        [5, 7, 10, 15, 22, 30, 38],
  agile:     [5, 7, 10, 15, 22, 28, 35],
  qa:        [3, 4.5, 7, 10, 15, 20, 25],
  it:        [3.5, 5, 8, 12, 17, 22, 28],
  architect: [8, 12, 18, 25, 35, 45, 55],
  lead:      [8, 10, 14, 20, 28, 36, 44],
  bigdata:   [5, 7, 11, 16, 24, 32, 40],
  business:  [3.5, 5, 8, 12, 17, 22, 28],
  general:   [3, 4, 6, 9, 14, 18, 24],
};

function expToIndex(years) {
  if (years <= 0) return 0;
  if (years <= 2) return 1;
  if (years <= 4) return 2;
  if (years <= 7) return 3;
  if (years <= 11) return 4;
  if (years <= 15) return 5;
  return 6;
}

function findSalary(role, yearsExp) {
  const normalized = role.trim().toLowerCase();
  const idx = expToIndex(yearsExp);

  if (SALARY_MAP[normalized]) {
    return SALARY_MAP[normalized].base[idx];
  }

  for (const [key, data] of Object.entries(SALARY_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return data.base[idx];
    }
  }

  const words = normalized.split(/[\s,\-\/]+/);
  for (const word of words) {
    if (word.length < 3) continue;
    for (const [key, data] of Object.entries(SALARY_MAP)) {
      if (key.includes(word)) {
        return data.base[idx];
      }
    }
  }

  for (const word of words) {
    for (const [kw, arr] of Object.entries(KEYWORD_FALLBACKS)) {
      if (word.includes(kw) || kw.includes(word)) {
        return arr[idx];
      }
    }
  }

  return KEYWORD_FALLBACKS.general[idx];
}

function formatLPA(lpa) {
  if (lpa >= 100) {
    return `₹${(lpa / 100).toFixed(1)} Cr/yr`;
  }
  return `₹${lpa.toFixed(1)} LPA`;
}

function calculateSalary(experience, currentRole, targetRole) {
  const years = parseInt(experience, 10);
  const currentSalary = findSalary(currentRole, years);

  const boostedYears = Math.min(years + 2, 20);
  let targetSalary = findSalary(targetRole, boostedYears);

  if (targetSalary <= currentSalary) {
    targetSalary = currentSalary * 1.35;
  }

  const hike = ((targetSalary - currentSalary) / currentSalary * 100).toFixed(0);

  return { currentSalary, targetSalary, hike };
}

/* ===== Carousel ===== */
function initCarousel() {
  const track = document.getElementById("carouselTrack");
  const dotsContainer = document.getElementById("carouselDots");

  COURSES.forEach((course, i) => {
    const chip = document.createElement("div");
    chip.className = "carousel-chip";
    chip.innerHTML = `
      <div class="chip-icon">${course.icon}</div>
      <div class="chip-name">${course.name}</div>
    `;
    track.appendChild(chip);

    const dot = document.createElement("div");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  let current = 0;
  const dots = dotsContainer.querySelectorAll(".dot");

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  function next() {
    goTo((current + 1) % COURSES.length);
  }

  let interval = setInterval(next, 2500);

  track.addEventListener("mouseenter", () => clearInterval(interval));
  track.addEventListener("mouseleave", () => {
    clearInterval(interval);
    interval = setInterval(next, 2500);
  });

  let startX = 0;
  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    clearInterval(interval);
  }, { passive: true });
  track.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      dx > 0
        ? goTo((current - 1 + COURSES.length) % COURSES.length)
        : goTo((current + 1) % COURSES.length);
    }
    interval = setInterval(next, 2500);
  }, { passive: true });
}

/* ===== Form Handler ===== */
function initForm() {
  const form = document.getElementById("salaryForm");
  const panel = document.getElementById("resultsPanel");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const experience = document.getElementById("experience").value;
    const currentRole = document.getElementById("currentRole").value;
    const targetRole = document.getElementById("targetRole").value;

    if (!experience || !currentRole.trim() || !targetRole.trim()) return;

    const result = calculateSalary(experience, currentRole, targetRole);

    document.getElementById("currentSalary").textContent = formatLPA(result.currentSalary);
    document.getElementById("targetSalary").textContent = formatLPA(result.targetSalary);
    document.getElementById("currentRoleDisplay").textContent = currentRole;
    document.getElementById("targetRoleDisplay").textContent = targetRole;
    document.getElementById("salaryHike").textContent =
      `🚀 Potential salary hike of ~${result.hike}%`;

    panel.classList.remove("hidden");
    setTimeout(() => {
      panel.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  });
}

/* ===== Init ===== */
document.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  initForm();
});
