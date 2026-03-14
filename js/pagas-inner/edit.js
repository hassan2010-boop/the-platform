const name1 = document.getElementById("name");
const code = document.getElementById("code");
const number = document.getElementById("phone");
const gmail = document.getElementById("gmail");
const password = document.getElementById("password");
const saveBtn = document.getElementById("save");
const togglePassword = document.getElementById("togglePassword");
const customModal = document.getElementById("customModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalOkBtn = document.getElementById("modalOkBtn");

function showDialog(title, text) {
    modalTitle.innerText = title;
    modalMessage.innerText = text;
    customModal.style.display = "flex";
}

modalOkBtn.onclick = () => {
    customModal.style.display = "none";
};

function getdata() {
    const studentName = sessionStorage.getItem("studentName");
    const groupName = sessionStorage.getItem("groupName2");
    if (!studentName || !groupName) return;
    const groupData = localStorage.getItem(`${groupName}-group`);
    if (!groupData) return;
    const group = JSON.parse(groupData);
    const info = group.find(item => item.name === studentName);
    if (info) {
        name1.value = info.name || "";
        code.value = info.code || "";
        number.value = info.number || info.numbar || "";
        gmail.value = info.gmail || "";
        password.value = info.password || "";
        const userGreeting = document.getElementById("user-greeting");
        if(userGreeting) userGreeting.innerText = info.name;
    }
}

saveBtn.onclick = function() {
    const studentName = sessionStorage.getItem("studentName");
    const groupName = sessionStorage.getItem("groupName2");
    const groupData = localStorage.getItem(`${groupName}-group`);
    if (!groupData) return;

    let group = JSON.parse(groupData);
    let index = group.findIndex(item => item.name === studentName);

    if (index === -1) {
        showDialog("Access Denied", "Oops! We couldn't verify your profile in our current database.");
        return;
    }

    const current = group[index];
    const newName = name1.value.trim();
    const newCode = code.value.trim();

    if (
        newName === current.name &&
        newCode === current.code &&
        number.value === (current.number || current.numbar) &&
        gmail.value === current.gmail &&
        password.value === current.password
    ) {
        showDialog("No Changes", "It looks like you haven't made any updates to your information yet.");
        return;
    }

    if (newName !== current.name) {
        const nameExists = group.some(item => item.name === newName);
        if (nameExists) {
            showDialog("Duplicate Name", "This name is already taken by another student. Please choose a different one.");
            return;
        }
    }

    if (newCode !== current.code) {
        const codeExists = group.some(item => item.code === newCode);
        if (codeExists) {
            showDialog("Duplicate Code", "This student code is already registered. Please double-check your code.");
            return;
        }
    }

    group[index] = {
        ...current,
        name: newName,
        code: newCode,
        gmail: gmail.value,
        number: number.value,
        password: password.value
    };

    localStorage.setItem(`${groupName}-group`, JSON.stringify(group));
    sessionStorage.setItem("studentName", newName);

    showDialog("Success", "Great job! Your profile has been updated and secured successfully.");
};

togglePassword.onclick = function () {
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    this.classList.toggle("fa-eye-slash");
};

document.addEventListener("DOMContentLoaded", getdata);