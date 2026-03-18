document.addEventListener("DOMContentLoaded", () => {
    const examTitle = document.getElementById("examTitle");
    const timeRemaining = document.getElementById("timeRemaining");
    const container = document.querySelector(".container");
    const finishBtn = document.querySelector(".Finish");
    const activeExam = JSON.parse(sessionStorage.getItem("activeExam"));
    const studentCode = sessionStorage.getItem("studentSolvingCode");
    const startTime = new Date();

    if (!activeExam) {
        window.location.href = "../email.html";
        return;
    }

    examTitle.textContent = activeExam.name;
    let timeInMinutes = parseInt(activeExam.time) || 15;
    let totalSeconds = timeInMinutes * 60;

    const timerInterval = setInterval(() => {
        let mins = Math.floor(totalSeconds / 60);
        let secs = totalSeconds % 60;
        timeRemaining.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            finishExam();
        }
        totalSeconds--;
    }, 1000);

    const storageKey = `${activeExam.name}-texts`;
    const questions = JSON.parse(localStorage.getItem(storageKey) || "[]");

    questions.forEach((q, index) => {
        const qBlock = document.createElement("div");
        qBlock.className = "question-block";
        qBlock.style.cssText = "margin-bottom: 30px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 10px; border-left: 5px solid #6e48aa;";
        
        let questionHtml = `<h2 style="color: #fff; margin-bottom: 15px;">${index + 1}. ${q.questionText}</h2>`;

        if (q.type === "MultipleChoice") {
            (q.choices || []).forEach((opt) => {
                if(opt.trim() !== "") {
                    questionHtml += `
                        <label style="display: block; margin: 10px 0; color: #ccc; cursor: pointer;">
                            <input type="radio" name="q${index}" value="${opt}" style="margin-right: 10px;">${opt}
                        </label>`;
                }
            });
        } else if (q.type === "TrueFalse") {
            ["true", "false"].forEach(val => {
                questionHtml += `
                    <label style="display: block; margin: 10px 0; color: #ccc; cursor: pointer;">
                        <input type="radio" name="q${index}" value="${val}" style="margin-right: 10px;">${val.toUpperCase()}
                    </label>`;
            });
        } else if (q.type === "Complete" || q.type === "Essay") {
            questionHtml += `<textarea name="q${index}" rows="3" style="width: 100%; border-radius: 8px; padding: 10px; background: #222; color: #fff; border: 1px solid #444;" placeholder="Write your answer here..."></textarea>`;
        }

        qBlock.innerHTML = questionHtml;
        container.appendChild(qBlock);
    });

    finishBtn.onclick = () => {
        if (confirm("Are you sure you want to finish?")) finishExam();
    };

    function finishExam() {
        if (finishExam.done) return;
        finishExam.done = true;
        clearInterval(timerInterval);

        const endTime = new Date();
        const durationMs = endTime - startTime;
        const durationMins = Math.floor(durationMs / 60000);
        const durationSecs = Math.floor((durationMs % 60000) / 1000);

        let correctCount = 0;
        const answers = [];

        questions.forEach((q, index) => {
            let answer = "";
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            answer = selected ? selected.value : (document.querySelector(`textarea[name="q${index}"]`)?.value || "");
            
            let sAns = String(answer).trim().toLowerCase();
            let cAns = String(q.answer || "").trim().toLowerCase();
            let isCorrect = false;

            // منطق "جزء من الإجابة" للأسئلة المقالية
            if (q.type === "Essay" || q.type === "Complete") {
                if (cAns !== "" && sAns.includes(cAns)) isCorrect = true;
            } else {
                if (sAns !== "" && sAns === cAns) isCorrect = true;
            }

            if (isCorrect) correctCount++;

            answers.push({
                question: q.questionText,
                studentAnswer: answer,
                correctAnswer: q.answer,
                type: q.type,
                isCorrect: isCorrect
            });
        });

        const finalScore = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

        const result = {
            studentCode: studentCode || "Unknown",
            examName: activeExam.name,
            date: endTime.toLocaleString(),
            duration: `${durationMins}m ${durationSecs}s`,
            answers: answers,
            score: finalScore
        };

        const storageName = `${activeExam.name}-grades`;
        let allResults = JSON.parse(localStorage.getItem(storageName) || "[]");
        allResults.push(result);
        localStorage.setItem(storageName, JSON.stringify(allResults));
        
        sessionStorage.removeItem("activeExam");
        alert(`Finished! Score: ${finalScore}%`);
        window.location.href = "../email.html";
    }
});