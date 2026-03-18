function showdata() {
    let table = '';
    let subscribersCount = 0;
    let unsubscribersCount = 0;

    let groupName1 = sessionStorage.getItem("groupName2");
    if (!groupName1) return;

    let storageKey = `${groupName1}-group`;
    let storedData = localStorage.getItem(storageKey);
    let studentsData = storedData ? JSON.parse(storedData) : [];

    document.getElementById("group-name").textContent = groupName1;

    for (let i = 0; i < studentsData.length; i++) {
        let isChecked = studentsData[i].subscribed ? 'checked' : '';

        if (studentsData[i].subscribed) {
            subscribersCount++;
        } else {
            unsubscribersCount++;
        }

        table += `
            <tr>
                <td>${i + 1}</td>
                <td>${studentsData[i].name}</td>
                <td>${studentsData[i].code}</td>
                <td><a class="edit" href="edit/edit.html" onclick="saveStudentData(${i})">Edit</a></td>
                <td><a class="information" href="information/information.html" onclick="saveStudentData(${i})">Info</a></td>
                <td><a href="#" class="Delete" onclick="deletedata(${i})">Delete</a></td>
                <td>
                    <input type="checkbox" class="myCheckbox" data-index="${i}" ${isChecked}>
                </td>
            </tr>`;
    }

    document.getElementById('tbody').innerHTML = table;
    document.getElementById("subscribers-count").textContent = subscribersCount;
    document.getElementById("unsubscribers-count").textContent = unsubscribersCount;
    document.getElementById("total-count").textContent = studentsData.length;

    attachCheckboxEvents(storageKey);
}

function searchTable() {
    let input = document.getElementById("search");
    let filter = input.value.toUpperCase();
    let table = document.getElementById("tbody");
    let tr = table.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        let tdCode = tr[i].getElementsByTagName("td")[2]; 
        if (tdCode) {
            let txtValue = tdCode.textContent || tdCode.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function attachCheckboxEvents(storageKey) {
    document.querySelectorAll('.myCheckbox').forEach((checkbox) => {
        checkbox.addEventListener('change', function() {
            let index = this.getAttribute('data-index');
            let status = this.checked ? "SUBSCRIBE" : "UNSUBSCRIBE";

            if (confirm(`Are you sure you want to ${status} this student?`)) {
                let updatedData = JSON.parse(localStorage.getItem(storageKey)) || [];
                if (updatedData[index]) {
                    updatedData[index].subscribed = this.checked;
                    localStorage.setItem(storageKey, JSON.stringify(updatedData));
                    showdata();
                }
            } else {
                this.checked = !this.checked;
            }
        });
    });
}

function deletedata(index) {
    let groupName1 = sessionStorage.getItem("groupName2");
    let storageKey = `${groupName1}-group`;
    let students = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (confirm("Are you sure you want to delete this student?")) {
        students.splice(index, 1);
        localStorage.setItem(storageKey, JSON.stringify(students));
        showdata();
    }
}

function saveStudentData(index) {
    let groupName1 = sessionStorage.getItem("groupName2");
    let storageKey = `${groupName1}-group`;
    let students = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    if (students[index]) {
        sessionStorage.setItem("studentName", students[index].name);
        sessionStorage.setItem("studentIndex", index);
        sessionStorage.setItem("groupName", storageKey);
    }
}

document.addEventListener("DOMContentLoaded", showdata);