const enterBtn = document.querySelector(".main-btn");
const clickSound = new Audio("https://www.soundjay.com");
const bgMusic = new Audio("https://www.soundjay.com");

bgMusic.loop = true;
bgMusic.volume = 0.15;
bgMusic.preload = "auto";

const triggerMusic = () => {
  bgMusic
    .play()
    .then(() => {
      window.removeEventListener("click", triggerMusic);
      window.removeEventListener("wheel", triggerMusic);
      window.removeEventListener("touchstart", triggerMusic);
      window.removeEventListener("mousedown", triggerMusic);
    })
    .catch(() => {});
};

window.addEventListener("click", triggerMusic);
window.addEventListener("wheel", triggerMusic);
window.addEventListener("touchstart", triggerMusic);
window.addEventListener("mousedown", triggerMusic);

if (enterBtn) {
  enterBtn.addEventListener("click", function (e) {
    e.preventDefault();
    clickSound.play();
    setTimeout(() => {
      window.location.href = this.getAttribute("href");
    }, 300);
  });
}

let isLocked = false;
window.addEventListener("wheel", (e) => {
  const window2 = document.getElementById("window2");
  if (window.scrollY < 100 && e.deltaY > 0 && !isLocked && window2) {
    isLocked = true;
    window2.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      isLocked = false;
    }, 1000);
  }
});

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-wrapper");
  setTimeout(() => {
    if (loader) {
      loader.classList.add("loader-hidden");
    }
  }, 600);
});

setTimeout(() => {
  const loader = document.querySelector(".loader-wrapper");
  if (loader && !loader.classList.contains("loader-hidden")) {
    loader.classList.add("loader-hidden");
  }
}, 4000);
