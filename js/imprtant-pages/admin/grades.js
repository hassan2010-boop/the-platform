document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("studentsTableBody");
    const searchInput = document.querySelector(".search-input");
    const groupName = sessionStorage.getItem("groupName12"); // اسم الامتحان المختار
    const gradesKey = groupName + "-grades";
    
    const modal = document.getElementById("reportModal");
    const closeModal = document.getElementById("closeModal");
    
    // جلب نتائج الطلاب لهذا الامتحان تحديداً
    let studentsAnswers = JSON.parse(localStorage.getItem(gradesKey) || "[]");

    if (!tableBody) return;

    // 1. جلب قائمة كل الطلاب من جميع المجموعات لعرضهم في الجدول
    let allStudentData = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if ((key.toLowerCase().includes("group") || key.toLowerCase().includes("students")) && key.toLowerCase() !== "group") {
            try {
                let studentsList = JSON.parse(localStorage.getItem(key) || "[]");
                if (Array.isArray(studentsList)) {
                    // دمج القوائم مع تجنب التكرار بناءً على الكود
                    studentsList.forEach(s => {
                        if (!allStudentData.find(existing => existing.code === s.code)) {
                            allStudentData.push(s);
                        }
                    });
                }
            } catch (e) {}
        }
    }

    // 2. دالة حساب الوقت المستغرق بدقة
    function calculateDuration(durationStr, dateStr) {
        // إذا كان الوقت المستغرق مسجل مسبقاً في ملف الـ Exam (زي ما عدلنا في كود الـ finishExam)
        if (durationStr && durationStr !== "---") return durationStr;
        return "---";
    }

    function renderTable(dataFilter = "") {
        tableBody.innerHTML = "";

        // ترتيب الطلاب: اللي حل الامتحان وبدرجة أعلى يظهر فوق
        let sortedData = [...allStudentData].sort((a, b) => {
            let aAnswer = studentsAnswers.find(s => String(s.studentCode).trim() == String(a.code).trim());
            let bAnswer = studentsAnswers.find(s => String(s.studentCode).trim() == String(b.code).trim());
            return (bAnswer?.score ?? -1) - (aAnswer?.score ?? -1);
        });

        sortedData.forEach(student => {
            // فلتر البحث بالاسم أو الكود
            if (dataFilter && !student.name.toLowerCase().includes(dataFilter.toLowerCase()) && !String(student.code).includes(dataFilter)) return;

            let answer = studentsAnswers.find(s => String(s.studentCode).trim() == String(student.code).trim());
            let answered = !!answer;

            // استخراج الوقت المستغرق ووقت الانتهاء
            const duration = answered ? (answer.duration || "---") : "---";
            const finishTime = answered ? (answer.date || "---") : "---";

            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${student.name}</td> 
                <td>#${student.code || "---"}</td> 
                <td><button class="Retake" ${!answered ? 'style="opacity:0.3; cursor:default"' : ''} title="Reset Exam"><i class="fa-solid fa-rotate-right"></i></button></td>
                <td><button class="img-btn report-btn" ${!answered ? 'style="opacity:0.3; cursor:default"' : ''} title="View Details"><i class="fa-solid fa-file-invoice"></i></button></td>
                <td style="font-weight:bold; color:${answered ? '#00e0ff' : '#ff4d4d'}">
                    ${answered ? (answer.score + "%") : "Not Taken"}
                </td>
                <td>
                    <div style="font-size: 0.85rem;">${finishTime}</div>
                    ${answered ? `<div style="color: #00e0ff; font-size: 0.8rem; margin-top: 4px;">Duration: ${duration}</div>` : ''}
                </td>
                <td><i class="fa-solid ${answered ? 'fa-circle-check' : 'fa-circle-xmark'}" style="color:${answered ? '#2ecc71' : '#e74c3c'}; font-size: 1.2rem;"></i></td>
            `;

            // أحداث الأزرار (Modal & Retake)
            if (answered) {
                row.querySelector(".report-btn").onclick = () => {
                    document.getElementById("modalName").textContent = student.name;
                    document.getElementById("modalCode").textContent = "Code: #" + student.code;
                    document.getElementById("modalScore").textContent = (answer.score ?? 0) + "%";
                    document.getElementById("modalDuration").textContent = duration;
                    document.getElementById("modalDate").textContent = finishTime;
                    
                    document.getElementById("viewFullReport").onclick = () => {
                        sessionStorage.setItem("REPORT", JSON.stringify({ name: student.name, code: student.code, examName: groupName }));
                        window.location.href = "report/report.html";
                    };
                    modal.style.display = "flex";
                };

                row.querySelector(".Retake").onclick = () => {
                    if (confirm(`Are you sure you want to delete the result for ${student.name} and let them retake the exam?`)) {
                        studentsAnswers = studentsAnswers.filter(s => String(s.studentCode).trim() != String(student.code).trim());
                        localStorage.setItem(gradesKey, JSON.stringify(studentsAnswers));
                        renderTable(searchInput.value);
                    }
                };
            }

            tableBody.appendChild(row);
        });
    }

    // إغلاق المودال
    if(closeModal) closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

    // البحث
    if (searchInput) searchInput.addEventListener("input", (e) => renderTable(e.target.value));

    renderTable();
});