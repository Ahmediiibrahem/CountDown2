// ===============================
// إعدادات التوقيت
// ===============================
const TARGET_TIMEZONE = "Africa/Cairo"; // غير الدولة من هنا
const targetDateParts = {
  year: 2026,
  month: 3,   // مارس (1–12)
  day: 16,
  hour: 12,
  minute: 0,
  second: 0
};

// ===============================
// دالة تجيب الوقت الحالي حسب الدولة
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
  const values = Object.fromEntries(parts.map(p => [p.type, p.value]));

  return new Date(
    `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`
  );
}

// ===============================
// التاريخ المستهدف حسب نفس الدولة
// ===============================
function getTargetDate() {
  return new Date(
    `${targetDateParts.year}-${String(targetDateParts.month).padStart(2, "0")}-${String(targetDateParts.day).padStart(2, "0")}T${String(targetDateParts.hour).padStart(2, "0")}:${String(targetDateParts.minute).padStart(2, "0")}:${String(targetDateParts.second).padStart(2, "0")}`
  );
}

// ===============================
// العد التنازلي
// ===============================
const countdown = setInterval(() => {
  const now = getNowInTimeZone(TARGET_TIMEZONE);
  const target = getTargetDate();

  const diff = target - now;

  if (diff <= 0) {
    clearInterval(countdown);
    document.getElementById("countdown").innerHTML =
      "🎉 انتهى العد التنازلي!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;

}, 1000);
