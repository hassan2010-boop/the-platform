document.addEventListener("DOMContentLoaded", function () {
    let addButtons = document.querySelectorAll(".add-row");
    loadTables();
    addButtons.forEach((button, index) => {
        button.addEventListener("click", function () {
            let tbody = this.parentElement.nextElementSibling.querySelector("tbody");
            let grade = tbody.getAttribute("data-grade");
            let tableName = getTableName(grade);
            sessionStorage.setItem("kinds", index + 1);
            sessionStorage.setItem("kinds", tableName);
            window.location.href = "create-group/settings.html";
        });
    });

    addRowOnLoad();
    countTotalStudentsAndSubscribers(); 
});
function getTableName(grade) {
    const tableMap = {
        "first": "First secondary grade",
        "second": "Second secondary grade",
        "third": "Third secondary grade"
    };
    return tableMap[grade] || "Unknown grade"; 
}
function addRowOnLoad() {  
    let datapro = JSON.parse(localStorage.getItem("group"));
    for(let i = 0 ; i < datapro.length;i++){  
    let row = document.createElement("tr");
    let firstChar = datapro[i].kind;
    let targetTable = document.querySelector(`[data-grade='${getGradeFromNumber(firstChar)}']`);
    let rowCount = targetTable.children.length + 1;
    row.innerHTML =`            
    <td>${rowCount}</td>
    <td><button class="group-button">${datapro[i].name}</button></td>
    <td><button class="removal" onclick="removeRow(this)">
    <img src="img/Delete.png" alt="delete">
    </button></td>`
    targetTable.appendChild(row);
    sessionStorage.removeItem("namegroup");
    updateGroupCount();}
}
function getGradeFromNumber(number) {
    if (number === "First secondary grade") return "first";
    if (number === "Second secondary grade") return "second";
    if (number === "Third secondary grade") return "third";
    return null;
}
function removeRow(button) {
    let row = button.closest("tr");
        if (!row) return;
    let tbody = row.parentElement;
        if (!tbody) return;
    let groupButton = row.querySelector(".group-button");
    let groupName = groupButton ? groupButton.textContent.trim() : null;
    row.remove();
    let rows = tbody.querySelectorAll("tr");
    rows.forEach((row, index) => {row.children[0].textContent = index + 1;});
    if (groupName) {
        let key = `${groupName}-group`;
        localStorage.removeItem(key);
        let datapro = JSON.parse(localStorage.getItem("group"));
        for (let i = 0; i < datapro.length; i++) {
        datapro.splice(i,1)
        localStorage.group= JSON.stringify(datapro)};
    }
    updateGroupCount();
    countTotalStudentsAndSubscribers();
}
function loadTables() {
    let storedData = localStorage.getItem("Group"); // ← هنا التغيير
    if (storedData) {
        let data = JSON.parse(storedData);

        document.querySelector("[data-grade='first']").innerHTML = data.first;
        document.querySelector("[data-grade='second']").innerHTML = data.second;
        document.querySelector("[data-grade='third']").innerHTML = data.third;
        document.querySelectorAll(".removal").forEach(button => {
            button.addEventListener("click", function () {
                removeRow(this);
            });
        });

        updateGroupCount();
    }
}
function updateGroupCount() {
    let totalRows = document.querySelectorAll("tbody tr").length;
    document.getElementById("group-count").textContent = totalRows;
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("group-button")) {
        let groupName = event.target.textContent.trim();       
        let tbody = event.target.closest("tbody");
        let grade = tbody ? tbody.getAttribute("data-grade") : null;
        sessionStorage.setItem("tablename1", grade);
        sessionStorage.setItem("groupName2", groupName);
        window.location.href = "../Subscribe/Subscribe.html";
    }
});
function countTotalStudentsAndSubscribers() {
    let totalStudents = 0;
    let totalSubscribers = 0;
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        if (key.includes("Students")) {
            try {
                let students = JSON.parse(localStorage.getItem(key));
                if (Array.isArray(students)) {
                    totalStudents += students.length;
                    students.forEach(student => {
                        if (student.subscribed === true) {
                            totalSubscribers++;
                        }
                    });
                }
            } catch (err) {
                console.warn("خطأ في قراءة البيانات من:", key, err);
            }
        }
    }

    console.log("الطلاب:", totalStudents, "المشتركين:", totalSubscribers);

    const studentCountEl = document.getElementById("student-count");
    const subscriberCountEl = document.getElementById("subscriber-count");

    if (studentCountEl) studentCountEl.textContent = totalStudents;
    if (subscriberCountEl) subscriberCountEl.textContent = totalSubscribers;
}











