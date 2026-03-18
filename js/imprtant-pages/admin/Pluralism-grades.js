document.addEventListener("DOMContentLoaded", function () {
    loadTables();
    updateGroupCount();

    let addButtons = document.querySelectorAll(".add-row");
    addButtons.forEach((button) => {
        button.addEventListener("click", function () {
            sessionStorage.setItem("tableName1", "texts");
            window.location.href = "../grades/grades/grades.html";
        });
    });
});

function loadTables() {
    let storedData = localStorage.getItem("texts");
    if (!storedData) return;

    let data = JSON.parse(storedData);
    const grades = ["first", "second", "third"];

    grades.forEach(grade => {
        let targetTable = document.querySelector(`tbody[data-grade='${grade}']`);
        if (!targetTable) return;

        targetTable.innerHTML = "";

        let filteredData = data.filter(item => 
            item.secondary && item.secondary.toLowerCase() === grade
        );

        filteredData.forEach((item, index) => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><button class="group-button">${item.name}</button></td>
                <td>${item.startDate}</td>
                <td>${item.endDate}</td>
                <td>${item.time} min</td>
                <td>
                    <button class="removal" onclick="removeRow(this, '${item.name}')" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:1.2rem;">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            targetTable.appendChild(row);
        });
    });
}

function removeRow(button, examName) {
    if (!confirm("Are you sure you want to delete this exam?")) return;

    let storedData = JSON.parse(localStorage.getItem("texts")) || [];
    let updatedData = storedData.filter(item => item.name !== examName);
    
    localStorage.setItem("texts", JSON.stringify(updatedData));

    loadTables();
    updateGroupCount();
}

function updateGroupCount() {
    let storedData = localStorage.getItem("texts");
    let exams = storedData ? JSON.parse(storedData) : [];
    let counterElement = document.getElementById("group-count");
    
    if (counterElement) {
        counterElement.textContent = exams.length;
    }
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("group-button")) {
        let examName = event.target.textContent.trim();
        let tbody = event.target.closest("tbody");
        let grade = tbody ? tbody.getAttribute("data-grade") : null;

        sessionStorage.setItem("tablename12", grade);
        sessionStorage.setItem("groupName12", examName);

        window.location.href = "../grades/grades.html";
    }
});