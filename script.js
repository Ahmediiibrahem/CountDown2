// التاريخ المستهدف: 16 مارس 2026 - الساعة 12 ظهراً
const targetDate = new Date(2026, 2, 16, 12, 0, 0).getTime();

const countdown = setInterval(() => {
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference <= 0) {
    clearInterval(countdown);
    document.getElementById("countdown").innerHTML = "🎉 انتهى العد التنازلي!";
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;

}, 1000);
