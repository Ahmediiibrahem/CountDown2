// ===============================
// Basic Settings
// ===============================
const startDate = new Date(2025, 11, 19); // 19 December 2025
const endDate   = new Date(2026, 2, 16);  // 16 March 2026

const targetDateParts = {
  year: 2026,
  month: 3,
  day: 16,
  hour: 12,
  minute: 0,
  second: 0
};

// DOM Elements
const daysGrid = document.getElementById("daysProgress");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");

// ===============================
// Fixed Timezone: Cairo
// ===============================
const TARGET_TIMEZONE = "Africa/Cairo";

// ===============================
// Get Current Time in Cairo
// ===============================
function getNowInTimeZone() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TARGET_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const parts = formatter.formatToParts(new Date());
  const v = Object.fromEntries(parts.map(p => [p.type, p.value]));

  return new Date(
    `${v.year}-${v.month}-${v.day}T${v.hour}:${v.minute}:${v.second}`
  );
}

// ===============================
// Target Date
// ===============================
function getTargetDate() {
  return new Date(
    `${targetDateParts.year}-${String(targetDateParts.month).padStart(2, "0")}-${String(targetDateParts.day).padStart(2, "0")}T${String(targetDateParts.hour).padStart(2, "0")}:${String(targetDateParts.minute).padStart(2, "0")}:${String(targetDateParts.second).padStart(2, "0")}`
  );
}

// ===============================
// Countdown Timer
// ===============================
setInterval(() => {
  const now = getNowInTimeZone();
  const target = getTargetDate();
  const diff = target - now;

  if (diff <= 0) return;

  document.getElementById("days").textContent =
    Math.floor(diff / (1000 * 60 * 60 * 24));

  document.getElementById("hours").textContent =
    Math.floor((diff / (1000 * 60 * 60)) % 24);

  document.getElementById("minutes").textContent =
    Math.floor((diff / (1000 * 60)) % 60);

  document.getElementById("seconds").textContent =
    Math.floor((diff / 1000) % 60);
}, 1000);

// ===============================
// Generate Day Boxes by Month
// ===============================
function generateDayBoxes() {
  daysGrid.innerHTML = "";

  const monthGroups = {};

  for (
    let d = new Date(startDate);
    d <= endDate;
    d.setDate(d.getDate() + 1)
  ) {
    const key = `${d.getFullYear()}-${d.getMonth()}`;

    if (!monthGroups[key]) {
      monthGroups[key] = [];
    }

    monthGroups[key].push(new Date(d));
  }

  Object.values(monthGroups).forEach(days => {
    const monthBlock = document.createElement("div");
    monthBlock.className = "month-block";

    // Month title in English
    const title = document.createElement("div");
    title.className = "month-title";
    title.textContent = days[0].toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });

    const grid = document.createElement("div");
    grid.className = "month-days";

    // Add day boxes
    days.forEach(date => {
      const box = document.createElement("div");
      box.className = "day-box";
      box.textContent = date.getDate();
      box.dataset.date = date.toISOString();
      grid.appendChild(box);
    });

    monthBlock.appendChild(title);
    monthBlock.appendChild(grid);
    daysGrid.appendChild(monthBlock);
  });
}

// ===============================
// Update Day Status + Progress
// ===============================
function updateDayProgress() {
  const now = getNowInTimeZone();

  const allBoxes = document.querySelectorAll(".day-box");
  let doneCount = 0;

  allBoxes.forEach(box => {
    const dayDate = new Date(box.dataset.date);

    box.classList.remove("done", "today");

    if (dayDate < now) {
      box.classList.add("done");
      doneCount++;
    }

    if (dayDate.toDateString() === now.toDateString()) {
      box.classList.add("today");
    }
  });

  const total = allBoxes.length;
  const percent = Math.round((doneCount / total) * 100);

  progressFill.style.width = percent + "%";
  progressPercent.textContent = percent + "%";
}

// ===============================
// Initial Run
// ===============================
generateDayBoxes();
updateDayProgress();
setInterval(updateDayProgress, 60000);
