function updateClockAndDate() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("clock").textContent =
    `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClockAndDate, 1000);
updateClockAndDate();

document.addEventListener("DOMContentLoaded", () => {
  let totalStudents = 0;
  let totalTests = 0;
  let totalPhotos = 0;

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.includes("-group")) {
      try {
        let groupData = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(groupData)) {
          totalStudents += groupData.length;
        }
      } catch (e) {}
    }
  }

  try {
    let testsData = JSON.parse(localStorage.getItem("texts") || "[]");
    if (Array.isArray(testsData)) {
      totalTests = testsData.length;
    }
  } catch (e) {}

  try {
    let photoStorage = JSON.parse(localStorage.getItem("photo") || "{}");
    if (photoStorage.images && typeof photoStorage.images === "object") {
      totalPhotos = Object.keys(photoStorage.images).length;
    } else if (Array.isArray(photoStorage.images)) {
      totalPhotos = photoStorage.images.length;
    }
  } catch (e) {}

  animateValue("students-count", 0, totalStudents, 1000);
  animateValue("tests-count", 0, totalTests, 1000);
  animateValue("photos-count", 0, totalPhotos, 1000);
});

function animateValue(id, start, end, duration) {
  let obj = document.getElementById(id);
  if (!obj) return;
  let range = end - start;
  let current = start;
  let increment = end > start ? 1 : -1;
  if (range === 0) {
    obj.innerHTML = end;
    return;
  }
  let stepTime = Math.abs(Math.floor(duration / range));
  let timer = setInterval(
    function () {
      current += increment;
      obj.innerHTML = current;
      if (current == end) {
        clearInterval(timer);
      }
    },
    stepTime > 10 ? stepTime : 10,
  );
}
