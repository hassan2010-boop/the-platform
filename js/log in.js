let name1 = document.getElementById("t1");
let password = document.getElementById("t2");
let submit = document.getElementById("sumbit");
let problem = document.getElementById("h2");

function onclick1() {
  problem.style.display = "none";

  // استخدام trim() لمسح أي مسافات فاضية دخلت غلط
  let inputName = name1.value.trim();
  let inputPass = password.value.trim();

  let isUserFound = false;
  let isSubscribed = false;

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);

    if (key.includes("-Students") || key.includes("-group")) {
      let storedData = localStorage.getItem(key);

      // التأكد إن الـ Key مش فاضي قبل الـ Parse
      if (storedData && storedData.trim() !== "") {
        try {
          let students = JSON.parse(storedData) || [];

          let user = students.find(
            (u) =>
              u.name.trim() === inputName &&
              u.password.toString().trim() === inputPass,
          );

          if (user) {
            isUserFound = true;
            isSubscribed =
              user.subscribed === true || user.subscribed === "true";
            break;
          }
        } catch (e) {
          console.error("Error parsing JSON for key: " + key);
          continue; // لو فيه Key بايظ يتخطاه ويكمل بحث
        }
      }
    }
  }

  if (isUserFound) {
    sessionStorage.setItem(
      "log in",
      JSON.stringify({
        username: inputName,
        subscribed: isSubscribed,
      }),
    );

    if (isSubscribed) {
      window.location.href = "email stuid/email.html";
    } else {
      setTimeout(() => {
        problem.textContent = "Please subscribe first";
        problem.style.display = "block";
      }, 500);
    }
  } else {
    // فحص حساب الأدمن الخاص بك
    if (inputName === "hassan" && inputPass === "123456") {
      sessionStorage.setItem(
        "log in",
        JSON.stringify({
          username: "hassan",
          subscribed: true,
        }),
      );
      window.location.href = "html/home.html";
    } else {
      setTimeout(() => {
        problem.textContent = "Incorrect username or password";
        problem.style.display = "block";
      }, 500);
    }
  }
}

submit.addEventListener("click", (e) => {
  e.preventDefault();
  onclick1();
});
