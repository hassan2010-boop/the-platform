function getdata() {
    const elements = {
        name: document.getElementById("name"),
        code: document.getElementById("code"),
        number: document.getElementById("number"),
        gmail: document.getElementById("gmail"),
        password: document.getElementById("password"),
        subscribed: document.getElementById("subscribed"),
        subContainer: document.getElementById("subscribed1")
    };

    let studentName = sessionStorage.getItem("studentName");
    let groupName = sessionStorage.getItem("groupName2");

    if (!studentName || !groupName) return;

    let groupData = localStorage.getItem(`${groupName}-group`);
    if (!groupData) return;

    let group = JSON.parse(groupData);
    let info = group.find(item => item.name === studentName);

    if (info) {
        elements.name.innerText = info.name || "N/A";
        elements.code.innerText = info.code || "N/A";
        elements.number.innerText = info.numbar || info.number || "N/A"; 
        elements.gmail.innerText = info.gmail || "N/A";
        
        const realPassword = info.password || "N/A";
        elements.password.innerText = "••••••••"; 
        elements.password.setAttribute("data-pass", realPassword);

        const isSub = info.subscribed === true || info.subscribed === "true";

        if (isSub) {
            elements.subscribed.innerText = "Active";
            elements.subContainer.style.background = "linear-gradient(to right bottom, #00ff88, #43ff6c)";
            elements.subContainer.style.color = "#000000"; // نص أسود لضمان الوضوح فوق الأخضر
        } else {
            elements.subscribed.innerText = "Inactive";
            elements.subContainer.style.background = "linear-gradient(to right bottom, #ff4b2b, #ff416c)";
            elements.subContainer.style.color = "#ffffff"; // نص أبيض فوق الأحمر
        }
        
        elements.subContainer.style.borderRadius = "12px"; // زيادة التدوير لتناسب الـ CSS المودرن
        elements.subContainer.style.padding = "10px 15px";
    }
}

document.addEventListener("DOMContentLoaded", getdata);
