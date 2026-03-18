document.addEventListener("DOMContentLoaded", function () {
    let input = document.getElementById("groupName");
    let saveButton = document.getElementById("saveButton");

    // تحميل القيم المحفوظة من sessionStorage
    let namegroup = sessionStorage.getItem("namegroup") || "";
    let kinds = sessionStorage.getItem("kinds") || ""; // جلب kinds

    console.log("Loaded kinds:", kinds);
    console.log("Loaded namegroup:", namegroup);

    // تحديث حقل الإدخال ليحتوي على kinds + namegroup
    if (namegroup) {
        input.value = kinds + " " + namegroup;
    }

    // حفظ البيانات عند الكتابة
    input.addEventListener("input", function () {
        sessionStorage.setItem("namegroup", input.value.replace(kinds + " ", "")); // حفظ الاسم بدون kinds
        console.log("Updated namegroup:", sessionStorage.getItem("namegroup")); // طباعة التحديث
    });

    // عند الضغط على زر الحفظ
    saveButton.addEventListener("click", function () {
        let finalGroupName = kinds + " " + input.value.replace(kinds + " ", ""); // إعادة بناء الاسم
        sessionStorage.setItem("namegroup", finalGroupName); // تأكيد الحفظ
        
        console.log("Saved kinds:", kinds);
        console.log("Saved namegroup:", sessionStorage.getItem("namegroup")); // طباعة الاسم المحفوظ
        
        alert("Group name saved: " + sessionStorage.getItem("namegroup"));

        // توجيه المستخدم إلى الصفحة المطلوبة
         window.location.href = "D:/Visual Studio Code/project/The platform/Pluralism/Pluralism-Subscribe.html";
    });
});
