document.addEventListener("DOMContentLoaded", () => {
    const loginData = JSON.parse(sessionStorage.getItem("log in"));
    const studentNameDisplay = document.getElementById('studentName');
    const studentCodeDisplay = document.getElementById('studentCode');
    const groupNameDisplay = document.getElementById('groupName');
    const studentGradeDisplay = document.getElementById('studentGrade');
    const galleryContainer = document.getElementById('galleryContainer');
    const buttonsContainer = document.getElementById('buttonsContainer');
    const resultsContainer = document.getElementById('resultsContainer');

    if (!loginData) {
        window.location.href = "../log in.html";
        return;
    }

    let foundStudent = null;
    let currentGroupName = "";

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.includes("-Students") || key.includes("-group")) {
            try {
                let data = JSON.parse(localStorage.getItem(key)) || [];
                foundStudent = data.find(s => s.name.trim().toLowerCase() === loginData.username.trim().toLowerCase());
                if (foundStudent) { 
                    currentGroupName = key.replace("-Students", "").replace("-group", "").trim();
                    break; 
                }
            } catch (e) { continue; }
        }
    }

    if (foundStudent) {
        studentNameDisplay.textContent = foundStudent.name;
        studentCodeDisplay.textContent = foundStudent.code || '1'; 
        groupNameDisplay.textContent = currentGroupName;
        studentGradeDisplay.textContent = foundStudent.grade || "1st Secondary";

        const photoData = JSON.parse(localStorage.getItem("photo") || '{"images":{}}');
        const imagesList = Object.values(photoData.images || {});
        if (galleryContainer && imagesList.length > 0) {
            galleryContainer.innerHTML = "";
            imagesList.forEach(img => {
                const card = document.createElement('div');
                card.innerHTML = `<img src="${img}" style="width:100%; border-radius:15px; border: 2px solid #8c52ff; margin-bottom:10px;">`;
                galleryContainer.appendChild(card);
            });
        }

        buttonsContainer.innerHTML = ""; 
        resultsContainer.innerHTML = ""; 

        const allExams = JSON.parse(localStorage.getItem("texts") || "[]");
        const now = new Date();

        allExams.forEach(exam => {
            const isGroupMatch = Array.isArray(exam.selectedGroups) && 
                                 exam.selectedGroups.some(g => g.trim().toLowerCase() === currentGroupName.toLowerCase());
            
            const startDate = new Date(exam.startDate.replace(" ", "T"));
            const endDate = new Date(exam.endDate.replace(" ", "T"));
            const isLive = now >= startDate && now <= endDate;

            const storageName = `${exam.name}-grades`;
            const examResults = JSON.parse(localStorage.getItem(storageName) || "[]");
            const studentResult = examResults.find(res => String(res.studentCode) === String(foundStudent.code));

            if (isGroupMatch && exam.isVisible !== false) {
                if (studentResult) {
                    // --- منطق احتساب الدرجة احتياطياً ---
                    let displayScore = 0;
                    if (studentResult.score !== undefined) {
                        displayScore = studentResult.score;
                    } else if (studentResult.answers) {
                        // لو السكور مش موجود بنحسبه من الإجابات الصح
                        let correct = studentResult.answers.filter(a => {
                            const s = String(a.studentAnswer).trim().toLowerCase();
                            const c = String(a.correctAnswer).trim().toLowerCase();
                            return s !== "" && s === c;
                        }).length;
                        displayScore = Math.round((correct / studentResult.answers.length) * 100);
                    }

                    const resultCard = document.createElement('div');
                    resultCard.style.cssText = "background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; border-left: 4px solid #00d2ff; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;";
                    
                    resultCard.innerHTML = `
                        <div class="result-info">
                            <h4 style="margin:0; color:#fff;">${exam.name}</h4>
                            <small style="color:#aaa;">${studentResult.date || ''}</small>
                            <br><small style="color:#00d2ff;">Duration: ${studentResult.duration || studentResult.finishTime || '---'}</small>
                        </div>
                        <div class="score-badge" style="background:${displayScore >= 50 ? '#00d2ff' : '#ff4b5c'}; color:#000; padding:5px 15px; border-radius:20px; font-weight:bold;">
                            ${displayScore}%
                        </div>
                    `;
                    resultsContainer.appendChild(resultCard);

                } else if (isLive) {
                    const btn = document.createElement('button');
                    btn.style.cssText = "width: 100%; padding: 15px; background: #8c52ff; color: white; border: none; border-radius: 10px; cursor: pointer; margin-bottom: 10px; display: flex; justify-content: space-between;";
                    btn.innerHTML = `<span><i class="fas fa-edit"></i> ${exam.name}</span><i class="fas fa-chevron-right"></i>`; 
                    btn.onclick = () => {
                        sessionStorage.setItem("activeExam", JSON.stringify(exam));
                        sessionStorage.setItem("studentSolvingCode", foundStudent.code);
                        window.location.href = "exam/exam.html"; 
                    };
                    buttonsContainer.appendChild(btn);
                }
            }
        });
    }
});