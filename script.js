// ===============================
// الإعدادات الأساسية
// ===============================
const startDate = new Date(2025, 11, 19); // 19 ديسمبر 2025
const endDate   = new Date(2026, 2, 16);  // 16 مارس 2026

const targetDateParts = {
  year: 2026,
  month: 3,
  day: 16,
  hour: 12,
  minute: 0,
  second: 0
};

// عناصر DOM
const timezoneSelect = document.getElementById("timezoneSelect");
const daysGrid = document.getElementById("daysProgress");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");

// ===============================
// حفظ واختيار الدولة
// ===============================
const savedZone = localStorage.getItem("timezone");
if (savedZone) timezoneSelect.value = savedZone;

let TARGET_TIMEZONE = timezoneSelect.value;

timezoneSelect.addEventListener("change", () => {
  TARGET_TIMEZONE = timezoneSelect.value;
  localStorage.setItem("timezone", TARGET_TIMEZONE);
  updateDayProgress();
});

// ===============================
// الوقت حسب الدولة
// ===============================
function getNowInTimeZone(timeZone) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
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
// تاريخ الهدف
// ===============================
function getTargetDate() {
  return new Date(
    `${targetDateParts.year}-${String(targetDateParts.month).padStart(2, "0")}-${String(targetDateParts.day).padStart(2, "0")}T${String(targetDateParts.hour).padStart(2, "0")}:${String(targetDateParts.minute).padStart(2, "0")}:${String(targetDateParts.second).padStart(2, "0")}`
  );
}

// ===============================
// العد التنازلي العلوي
// ===============================
setInterval(() => {
  const now = getNowInTimeZone(TARGET_TIMEZONE);
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
// إنشاء الأيام مقسمة حسب الشهور
// ===============================
function generateDayBoxes() {
  daysGrid.innerHTML = "";

  const monthGroups = {};

  for (
    let d = new Date(startDate);
    d <= endDate;
    d.setDate(d.getDate() + 1)
  ) {
    const year = d.getFullYear();
    const month = d.getMonth();
    const key = `${year}-${month}`;

    if (!monthGroups[key]) {
      monthGroups[key] = [];
    }

    monthGroups[key].push(new Date(d));
  }

  Object.entries(monthGroups).forEach(([key, days]) => {
    const monthIndex = days[0].getMonth() + 1;

    const monthBlock = document.createElement("div");
    monthBlock.className = `month-block month-${monthIndex}`;

    const title = document.createElement("div");
    title.className = "month-title";
    title.textContent = days[0].toLocaleDateString("ar-EG", {
      month: "long",
      year: "numeric"
    });

    const grid = document.createElement("div");
    grid.className = "month-days";

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
// تحديث حالة الأيام + شريط التقدم
// ===============================
function updateDayProgress() {
  const now = getNowInTimeZone(TARGET_TIMEZONE);

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
// تشغيل
// ===============================
generateDayBoxes();
updateDayProgress();
setInterval(updateDayProgress, 60000);
