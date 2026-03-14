// 1. تعريف العناصر
const inputs = {
    name: document.getElementById('name'),
    code: document.getElementById('code'),
    gmail: document.getElementById('gmail'),
    numbar: document.getElementById('numbar'),
    password: document.getElementById('password')
};
const saveButton = document.getElementById('save');
const massage = document.getElementById('massage');
const messageText = document.getElementById('p');

// 2. جلب البيانات من الـ LocalStorage
let groupName2 = sessionStorage.getItem("groupName2") || "defaultGroup";
let groupName = groupName2+"-group";
let datapro = [];

try {
    let storedData = localStorage.getItem(groupName);
    datapro = storedData ? JSON.parse(storedData) : [];
    if (!Array.isArray(datapro)) datapro = [];
} catch (e) {
    datapro = [];
}

// 3. وظيفة زر الحفظ
saveButton.onclick = function () {
    let newpro = {
        name: inputs.name.value.trim(),
        code: inputs.code.value.trim(),
        gmail: inputs.gmail.value.trim(),
        numbar: inputs.numbar.value.trim(),
        password: inputs.password.value.trim(),
        subscribed: false
    };

    resetStyles(); // تنظيف الألوان القديمة

    // التحقق من الحقول الفارغة
    if (!Object.values(newpro).every(val => val !== "")) {
        showMessage("❌ Please fill in all fields!", "red");
        highlightErrors(newpro, false, false);
        return;
    }

    // التحقق من التكرار
    let isNameDup = datapro.some(s => s.name === newpro.name);
    let isCodeDup = datapro.some(s => s.code === newpro.code);

    if (isNameDup || isCodeDup) {
        let msg = (isNameDup && isCodeDup) ? "❌ Both already exist!" : isNameDup ? "❌ Name exists!" : "❌ Code exists!";
        showMessage(msg, "red");
        highlightErrors(newpro, isNameDup, isCodeDup);
        return;
    }

    // الحفظ الفعلي
    datapro.push(newpro);
    localStorage.setItem(groupName, JSON.stringify(datapro));
    
    clearInputs();
    massage.style.background = "green"; 
    showMessage("✅ Data saved successfully!", "green");
};

// 4. الدوال المساعدة
function highlightErrors(pro, nameDup, codeDup) {
    if (pro.name === "" || nameDup) inputs.name.style.outline = "2px solid red";
    if (pro.code === "" || codeDup) inputs.code.style.outline = "2px solid red";
    if (pro.gmail === "") inputs.gmail.style.outline = "2px solid red";
    if (pro.numbar === "") inputs.numbar.style.outline = "2px solid red";
    if (pro.password === "") inputs.password.style.outline = "2px solid red";
}

function resetStyles() {
    Object.values(inputs).forEach(input => {
        if (input) input.style.outline = "none";
    });
}

function clearInputs() {
    Object.values(inputs).forEach(input => {
        if (input) input.value = "";
    });
}

function showMessage(text, color) {
    if (massage && messageText) {
        messageText.textContent = text;
        massage.style.borderLeftColor = (color === "green") ? "#28a745" : "#dc3545";
        massage.style.display = "flex";
        massage.style.opacity = "1";
        
        setTimeout(() => {
            massage.style.opacity = "0";
            setTimeout(() => { massage.style.display = "none"; }, 500);
        }, 3000);
    }
}

// 5. ميزة مسح الأحمر عند الكتابة (oninput)
Object.values(inputs).forEach(input => {
    if (input) {
        input.oninput = () => input.style.outline = "none";
    }
});

// 6. تأثير حركة الزر (Hover Effect)
saveButton.addEventListener("mousemove", function(e) {
    const rect = saveButton.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    saveButton.style.backgroundColor = `rgb(${x * 150}, ${y * 100}, 255)`;
});

saveButton.addEventListener("mouseleave", function() {
    saveButton.style.backgroundColor = "#6a0dad";
});