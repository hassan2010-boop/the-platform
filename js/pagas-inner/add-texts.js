document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("exam-name");
    const timeInput = document.getElementById("exam-time");
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const secondarySelect = document.getElementById("secondary");
    const groupsContainer = document.getElementById("groups-list");
    const isVisibleCheck = document.getElementById("is-visible");
    const saveButton = document.getElementById("save-btn");

    const editSession = sessionStorage.getItem("edit");
    let isEditMode = false;
    let originalExamName = "";

    if (editSession) {
        try {
            const editInfo = JSON.parse(editSession);
            isEditMode = true;
            originalExamName = editInfo.name;

            let exams = JSON.parse(localStorage.getItem("texts") || "[]");
            let examToEdit = exams.find(e => e.name === editInfo.name && e.secondary.toLowerCase() === editInfo.secondary.toLowerCase());

            if (examToEdit) {
                nameInput.value = examToEdit.name;
                
                let rawTime = examToEdit.time;
                timeInput.type = "text";
                timeInput.value = rawTime.toUpperCase().endsWith('M') ? rawTime : rawTime + 'M';

                startDateInput.value = examToEdit.startDate;
                endDateInput.value = examToEdit.endDate;
                secondarySelect.value = examToEdit.secondary;
                if (isVisibleCheck) isVisibleCheck.checked = examToEdit.isVisible;

                loadGroups();

                setTimeout(() => {
                    if (examToEdit.selectedGroups) {
                        examToEdit.selectedGroups.forEach(groupName => {
                            let cb = document.getElementById(`group-${groupName}`);
                            if (cb) cb.checked = true;
                        });
                    }
                }, 100);

                sessionStorage.removeItem("edit");
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        let savedGrade = sessionStorage.getItem("selectedGrade");
        if (savedGrade && secondarySelect) {
            let formattedGrade = savedGrade.charAt(0).toUpperCase() + savedGrade.slice(1).toLowerCase();
            secondarySelect.value = formattedGrade;
        }
        loadGroups();
    }

    function loadGroups() {
        groupsContainer.innerHTML = "";
        let storedGroups = JSON.parse(localStorage.getItem("group") || "[]");

        if (Array.isArray(storedGroups)) {
            storedGroups.forEach(groupItem => {
                if (groupItem.kind.includes(secondarySelect.value)) {
                    let label = document.createElement("label");
                    label.className = "group-card";
                    label.innerHTML = `
                        <input type="checkbox" class="myCheckbox" id="group-${groupItem.name}">
                        <div class="card-content">
                            <span class="group-name">${groupItem.name}</span>
                            <span class="status-icon"></span>
                        </div>
                    `;
                    groupsContainer.appendChild(label);
                }
            });
        }

        if (groupsContainer.innerHTML === "") {
            groupsContainer.innerHTML = "<p style='color:gray; font-size:12px;'>No groups found</p>";
        }
    }

    secondarySelect.addEventListener("change", loadGroups);

    function showError(input, message) {
        input.style.border = "2px solid #ff4d4d";
        let errorSpan = input.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains("error-message")) {
            errorSpan = document.createElement("span");
            errorSpan.className = "error-message";
            errorSpan.style.cssText = "color: #ff4d4d; font-size: 11px; display: block;";
            input.parentNode.insertBefore(errorSpan, input.nextSibling);
        }
        errorSpan.textContent = message;
    }

    function clearError(input) {
        input.style.border = "1px solid #3e3e5e";
        let errorSpan = input.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains("error-message")) errorSpan.remove();
    }

    timeInput.addEventListener('blur', function() {
        let val = this.value.trim();
        if (val) {
            let numericVal = val.replace(/[^0-9]/g, '');
            if (numericVal) {
                this.type = 'text';
                this.value = numericVal + 'M';
            }
        }
    });

    timeInput.addEventListener('focus', function() {
        let val = this.value.trim();
        if (val.toUpperCase().endsWith('M')) {
            let numericVal = val.replace(/[^0-9]/g, '');
            this.type = 'number';
            this.value = numericVal;
        }
    });

    const fpConfig = { enableTime: true, dateFormat: "Y-m-d H:i", minDate: "today", time_24hr: false };
    if (typeof flatpickr !== "undefined") {
        flatpickr(startDateInput, fpConfig);
        flatpickr(endDateInput, fpConfig);
    }

    saveButton.addEventListener("click", function () {
        let isValid = true;
        [nameInput, timeInput, startDateInput, endDateInput, secondarySelect].forEach(clearError);

        if (!nameInput.value.trim()) { showError(nameInput, "Required"); isValid = false; }
        if (!timeInput.value.trim()) { showError(timeInput, "Required"); isValid = false; }
        if (!startDateInput.value.trim()) { showError(startDateInput, "Required"); isValid = false; }
        if (!endDateInput.value.trim()) { showError(endDateInput, "Required"); isValid = false; }
        if (!secondarySelect.value) { showError(secondarySelect, "Required"); isValid = false; }

        if (isValid) {
            let selectedGroupsNames = [];
            document.querySelectorAll(".myCheckbox:checked").forEach(cb => {
                selectedGroupsNames.push(cb.id.replace("group-", ""));
            });

            let examData = {
                name: nameInput.value.trim(),
                time: timeInput.value.trim(),
                startDate: startDateInput.value.trim(),
                endDate: endDateInput.value.trim(),
                secondary: secondarySelect.value,
                selectedGroups: selectedGroupsNames,
                isVisible: isVisibleCheck ? isVisibleCheck.checked : true
            };

            let exams = JSON.parse(localStorage.getItem("texts") || "[]");

            if (isEditMode) {
                let index = exams.findIndex(e => e.name === originalExamName);
                if (index !== -1) {
                    exams[index] = examData;
                }
            } else {
                exams.push(examData);
            }

            localStorage.setItem("texts", JSON.stringify(exams));
            window.location.href = "../Pluralism-texts.html";
        }
    });
});