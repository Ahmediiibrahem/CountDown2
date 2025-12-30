// ======================
// إعداد التوقيت
// ======================
const targetDateParts = {
  year: 2026,
  month: 3,
  day: 16,
  hour: 12,
  minute: 0,
  second: 0
};

const startDate = new Date(2025, 11, 19); // 19 ديسمبر 2025
const endDate = new Date(2026, 2, 16);    // 16 مارس 2026

const timezoneSelect = document.getElementById("timezoneSelect");
let TARGET_TIMEZONE = timezoneSelect.value;

// تغيير الدولة
timezoneSelect.addEventListener("change", () => {
  TARGET_TIMEZONE = timezoneSelect.value;
  updateDayProgress();
});

// الوقت الحالي حسب الدولة
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
  const values = Object.fromEntries(parts.map(p => [p.type, p.value]));

  return new Date(
    `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`
  );
}

// التاريخ النهائي
function getTargetDate() {
  return new Date(
    `${targetDateParts.year}-${String(targetDateParts.month).padStart(2, "0")}-${String(targetDateParts.day).padStart(2, "0")}T${String(targetDateParts.hour).padStart(2, "0")}:${String(targetDateParts.minute).padStart(2, "0")}:${String(targetDateParts.second).padStart(2, "0")}`
  );
}

// العد التنازلي الرئيسي
setInterval(() => {
  const now = getNowInTimeZone(TARGET_TIMEZONE);
  const target = getTargetDate();
  const diff = target - now;

  if (diff <= 0) {
    document.getElementById("countdown").innerHTML = "🎉 انتهى العد التنازلي!";
    return;
  }

  document.getElementById("days").textContent =
    Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById("hours").textContent =
    Math.floor((diff / (1000 * 60 * 60)) % 24);
  document.getElementById("minutes").textContent =
    Math.floor((diff / (1000 * 60)) % 60);
  document.getElementById("seconds").textContent =
    Math.floor((diff / 1000) % 60);
}, 1000);

// ======================
// مربعات الأيام
// ======================
const daysGrid = document.getElementById("daysProgress");

function generateDayBoxes() {
  daysGrid.innerHTML = "";

  const totalDays =
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  for (let i = 0; i < totalDays; i++) {
    const box = document.createElement("div");
    box.className = "day-box";
    daysGrid.appendChild(box);
  }
}

function updateDayProgress() {
  const now = getNowInTimeZone(TARGET_TIMEZONE);
  const passedDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

  const boxes = document.querySelectorAll(".day-box");

  boxes.forEach((box, index) => {
    box.classList.remove("done", "today");

    if (index < passedDays) box.classList.add("done");
    if (index === passedDays) box.classList.add("today");
  });
}

generateDayBoxes();
updateDayProgress();

// تحديث كل دقيقة
setInterval(updateDayProgress, 60000);
