// التاريخ المستهدف
const targetDateParts = {
  year: 2026,
  month: 3,
  day: 16,
  hour: 12,
  minute: 0,
  second: 0
};

// العناصر
const timezoneSelect = document.getElementById("timezoneSelect");

// القيمة الافتراضية
let TARGET_TIMEZONE = timezoneSelect.value;

// تحديث المنطقة عند التغيير
timezoneSelect.addEventListener("change", () => {
  TARGET_TIMEZONE = timezoneSelect.value;
});

// جلب الوقت الحالي حسب الدولة
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

// التاريخ المستهدف
function getTargetDate() {
  return new Date(
    `${targetDateParts.year}-${String(targetDateParts.month).padStart(2, "0")}-${String(targetDateParts.day).padStart(2, "0")}T${String(targetDateParts.hour).padStart(2, "0")}:${String(targetDateParts.minute).padStart(2, "0")}:${String(targetDateParts.second).padStart(2, "0")}`
  );
}

// العد التنازلي
const countdown = setInterval(() => {
  const now = getNowInTimeZone(TARGET_TIMEZONE);
  const target = getTargetDate();
  const diff = target - now;

  if (diff <= 0) {
    document.getElementById("countdown").innerHTML =
      "🎉 انتهى العد التنازلي!";
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
