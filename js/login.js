let code = document.getElementById("code");
let password = document.getElementById("password");
let submitBtn = document.getElementById("submitBtn");
let problem = document.getElementById("problem");

function handleLoginClick() {
  let inputCode = code.value.trim();
  let inputPass = password.value.trim();
  let isUserFound = false;
  let isSubscribed = false;

  if (inputCode === "hassan" && inputPass === "123456") {
    loginUser("hassan", true, "imprtant-pages/admin/home.html");
    return;
  }

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.includes("-group")) {
      let storedData = localStorage.getItem(key);
      try {
        let students = JSON.parse(storedData) || [];
        let user = students.find(
          (u) =>
            u.code.trim() === inputCode &&
            u.password.toString().trim() === inputPass,
        );

        if (user) {
          isUserFound = true;
          isSubscribed =
            user.subscribed === true ||
            user.subscribed === "true" ||
            user.subscribed == 1 ||
            user.subscribed === "1";
          break;
        }
      } catch (e) {
        continue;
      }
    }
  }

  if (isUserFound) {
    if (isSubscribed) {
      loginUser(inputCode, true, "imprtant-pages/students/email.html");
    } else {
      showError("Please subscribe first");
    }
  } else {
    showError("Incorrect code or password");
  }
}

function loginUser(userCode, subscribedStatus, redirectUrl) {
  sessionStorage.setItem(
    "login",
    JSON.stringify({
      code: userCode,
      subscribed: subscribedStatus,
    }),
  );
  window.location.href = redirectUrl;
}

function showError(message) {
  problem.textContent = message;
  problem.style.display = "block";
}

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleLoginClick();
});

submitBtn.addEventListener("mousemove", (e) => {
  const rect = submitBtn.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  submitBtn.style.background = `radial-gradient(circle at ${x}px ${y}px, #8c52ff, #5227ff)`;
});

submitBtn.addEventListener("mouseleave", () => {
  submitBtn.style.background = "linear-gradient(45deg, #8c52ff, #5227ff)";
});
