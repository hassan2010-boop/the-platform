document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("reportForm");
    const titleElement = document.getElementById("selectedExam");
    
    // جلب بيانات التقرير المطلوبة من sessionStorage
    const currentReport = JSON.parse(sessionStorage.getItem("REPORT")) || {};
    const selectedExamName = currentReport.examName; 
    const currentStudentCode = currentReport.code; 

    if (!container || !selectedExamName) {
        console.error("No report data found!");
        return;
    }

    titleElement.textContent = currentReport.name || "Student Report";

    const gradesKey = selectedExamName + "-grades";
    const textsKey = selectedExamName + "-texts"; 

    const allGrades = JSON.parse(localStorage.getItem(gradesKey)) || [];
    const questions = JSON.parse(localStorage.getItem(textsKey)) || [];

    const userReport = allGrades.find(r => String(r.studentCode).trim() === String(currentStudentCode).trim()) || {};
    const studentAnswers = Array.isArray(userReport.answers) ? userReport.answers : [];

    container.innerHTML = "";

    if (questions.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#ccc;'>Questions not found in storage.</p>";
        return;
    }

    questions.forEach((q, index) => {
        const qText = q.questionText;
        const studentAnsObj = studentAnswers.find(ans => ans.question === qText) || {};
        const sAnswer = studentAnsObj.studentAnswer || "No Answer";
        const cAnswer = q.answer || ""; 
        
        let isCorrect = false;
        let sAnsClean = String(sAnswer).trim().toLowerCase();
        let cAnsClean = String(cAnswer).trim().toLowerCase();

        // --- التعديل هنا ليتوافق مع منطق صفحة الامتحان الجديد ---
        if (q.type === "Essay" || q.type === "Complete") {
            // يعتبر صح إذا كانت الإجابة الصحيحة جزء من إجابة الطالب
            if (cAnsClean !== "" && sAnsClean.includes(cAnsClean)) {
                isCorrect = true;
            }
        } else {
            // مطابقة تامة للاختيارات والصح والغلط
            if (sAnsClean !== "" && sAnsClean === cAnsClean) {
                isCorrect = true;
            }
        }
        
        const box = document.createElement("div");
        box.className = "question-box";
        box.style.cssText = `background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 5px solid ${isCorrect ? "#2ecc71" : "#e74c3c"}`;

        let html = `
            <h2 style="color: #00e0ff; font-size: 1.2rem; margin-bottom: 10px;">Question ${index + 1}</h2>
            <h3 style="color: #fff; margin-bottom: 15px;">${qText}</h3>
        `;

        if (q.type === "MultipleChoice" || q.type === "TrueFalse") {
            const options = q.choices || ["true", "false"];
            options.forEach(opt => {
                const isStudentPicked = sAnsClean === String(opt).trim().toLowerCase();
                const isThisRight = cAnsClean === String(opt).trim().toLowerCase();
                
                let stateStyle = "";
                let icon = "";

                if (isStudentPicked) {
                    stateStyle = isThisRight ? "border: 1px solid #2ecc71; background: rgba(46, 204, 113, 0.1);" : "border: 1px solid #e74c3c; background: rgba(231, 76, 60, 0.1);";
                    icon = isThisRight ? ' <i class="fas fa-check-circle" style="color:#2ecc71"></i>' : ' <i class="fas fa-times-circle" style="color:#e74c3c"></i>';
                } else if (isThisRight) {
                    stateStyle = "border: 1px dashed #2ecc71;";
                    icon = ' <i class="fas fa-check" style="color:#2ecc71; opacity:0.5"></i>';
                }

                html += `
                    <div style="padding: 10px; margin: 5px 0; border-radius: 8px; color: #ccc; ${stateStyle}">
                        <span>${opt} ${icon}</span>
                    </div>
                `;
            });
        } 
        else {
            html += `
                <div style="margin-top: 10px;">
                    <span style="color: #aaa; font-size: 0.9rem;">Student's Answer:</span>
                    <div style="padding: 10px; background: ${isCorrect ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'}; border-radius: 8px; color: #fff; margin-bottom: 10px; border: 1px solid ${isCorrect ? '#2ecc71' : '#e74c3c'}">
                        ${sAnswer}
                    </div>
                    <span style="color: #aaa; font-size: 0.9rem;">Model Answer (Must include):</span>
                    <div style="padding: 10px; background: rgba(46, 204, 113, 0.1); border-radius: 8px; color: #2ecc71; border: 1px dashed #2ecc71;">
                        ${cAnswer}
                    </div>
                </div>
            `;
        }

        box.innerHTML = html;
        container.appendChild(box);
    });
});