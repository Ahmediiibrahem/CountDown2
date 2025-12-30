// ===============================
// الإعدادات
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

// عناصر
const timezoneSelect = document.getElementById("timezoneSelect");
const daysGrid = document.getElementById("daysProgress");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");

// ===============================
// حفظ الدولة
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
// وقت حسب الدولة
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

  return new Date(`${v.year}-${v.month}-${v.day}T${v.hour}:${v.minute}:${v.second}`);
}

// ===============================
// العد التنازلي العلوي
// ===============================
function getTargetDate() {
  return new Date(
    `${targetDateParts.year}-${String(targetDateParts.month).padStart(2, "0")}-${String(targetDateParts.day).padStart(2, "0")}T${String(targetDateParts.hour).padStart(2, "0")}:${String(targetDateParts.minute).padStart(2, "0")}:${String(targetDateParts.second).padStart(2, "0")}`
  );
}

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
// إنشاء مربعات الأيام
// ===============================
function generateDayBoxes() {
  daysGrid.innerHTML = "";

  const totalDays =
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const box = document.createElement("div");
    box.className = `day-box month-${date.getMonth() + 1}`;
    box.textContent = date.getDate(); // رقم اليوم

    daysGrid.appendChild(box);
  }
}

// ===============================
// تحديث التقدم
// ===============================
function updateDayProgress() {
  const now = getNowInTimeZone(TARGET_TIMEZONE);
  const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

  const boxes = document.querySelectorAll(".day-box");
  const total = boxes.length;

  boxes.forEach((box, index) => {
    box.classList.remove("done", "today");

    if (index < diffDays) box.classList.add("done");
    if (index === diffDays) box.classList.add("today");
  });

  const percent = Math.min(
    100,
    Math.max(0, Math.round((diffDays / total) * 100))
  );

  progressFill.style.width = percent + "%";
  progressPercent.textContent = percent + "%";
}

// تشغيل
generateDayBoxes();
updateDayProgress();
setInterval(updateDayProgress, 60000);
