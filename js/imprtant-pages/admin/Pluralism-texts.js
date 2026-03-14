document.addEventListener("DOMContentLoaded", function () {
    loadTables();
    showCurrentExam();

    document.querySelectorAll(".add-row").forEach((button) => {
        button.addEventListener("click", function () {
            let section = button.closest(".secondary");
            let grade = section ? section.querySelector("tbody").getAttribute("data-grade") : "first";

            sessionStorage.setItem("tableName1", "texts");
            sessionStorage.setItem("selectedGrade", grade);
            window.location.href = "settings/settings.html";
        });
    });

    addRowOnLoad();
});

function renderRow(table, item, index) {
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${index}</td>
        <td><button class="group-button">${item.name}</button></td>
        <td>${item.startDate}</td>
        <td>${item.endDate}</td>
        <td><button class="edit-btn"><span class="material-symbols-outlined" style="color: #ffcb74;">edit</span></button></td>
        <td><button class="removal" onclick="removeRow(this)"><span class="material-symbols-outlined" style="color: #ff4d4d;">delete</span></button></td>
    `;

    // عند الضغط على زر التعديل
    row.querySelector(".edit-btn").addEventListener("click", function() {
        // جلب السنة من الـ dataset الخاص بالجدول الذي يحتوي على الصف
        let grade = table.dataset.grade; 

        let edit = {
            name: item.name,
            secondary: grade // هنا جلبنا السنة الصحيحة من الجدول نفسه
        };

        // تحويل الكائن لنص لتخزينه في الـ Session
        sessionStorage.setItem("edit", JSON.stringify(edit));

        window.location.href = "settings/settings.html";
    });

    table.appendChild(row);
}

function addRowOnLoad() {
    let namegroup = sessionStorage.getItem("namegroup1");
    if (!namegroup) return;

    let cleanName = namegroup.replace(/^[1-3]/, "").trim();
    let storedTexts = JSON.parse(localStorage.getItem("texts")) || [];
    let groupData = storedTexts.find(item => item.name === cleanName);

    if (groupData) {
        let grade = groupData.secondary.toLowerCase();
        let targetTable = document.querySelector(`tbody[data-grade="${grade}"]`);
        if (targetTable) {
            renderRow(targetTable, groupData, targetTable.children.length + 1);
            sessionStorage.removeItem("namegroup1");
            updateGroupCount();
        }
    }
}

function removeRow(button) {
    let row = button.closest("tr");
    let groupName = row.querySelector(".group-button").textContent.trim();
    let storedData = JSON.parse(localStorage.getItem("texts")) || [];
    localStorage.setItem("texts", JSON.stringify(storedData.filter(item => item.name !== groupName)));
    loadTables();
}

function loadTables() {
    let data = JSON.parse(localStorage.getItem("texts")) || [];
    ["first", "second", "third"].forEach(grade => {
        let targetTable = document.querySelector(`tbody[data-grade='${grade}']`);
        if (!targetTable) return;
        targetTable.innerHTML = "";
        data.filter(item => item.secondary.toLowerCase() === grade)
            .forEach((item, index) => renderRow(targetTable, item, index + 1));
    });
    updateGroupCount();
}

function updateGroupCount() {
    let exams = JSON.parse(localStorage.getItem("texts")) || [];
    let counter = document.getElementById("student-count");
    if (counter) counter.textContent = exams.length;
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("group-button")) {
        sessionStorage.setItem("tablename12", event.target.closest("tbody").dataset.grade);
        sessionStorage.setItem("groupName12", event.target.textContent.trim());
        window.location.href = "../texts/texts.html";
    }
});

function formatDateTime(dateString) {
    let date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()} | ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

function showCurrentExam() {
    let exams = JSON.parse(localStorage.getItem("texts")) || [];
    let now = new Date();
    let targetTable = document.querySelector(`tbody[data-grade="first1"]`);
    if (!targetTable) return;

    let current = exams.find(exam => now >= new Date(exam.startDate) && now <= new Date(exam.endDate));
    targetTable.innerHTML = current ? `<tr><td>${current.name}</td><td>${formatDateTime(current.startDate)}</td><td>${formatDateTime(current.endDate)}</td></tr>` 
                                   : `<tr><td colspan="3">🚫 No ongoing exams</td></tr>`;
}