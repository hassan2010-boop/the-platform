document.getElementById("downloadSample").addEventListener("click", function () {
    const selectedType = document.getElementById("questionType").value;

    if (!selectedType) {
        alert("⚠️ Please select an operation type first");
        return;
    }

    let sampleData = [];
    let filename = "";

    if (selectedType === "Complete") {
        sampleData = [
            {
                name: "Ahmed Ali",
                code: "1001",
                numbar: "0123456789",
                gmail: "ahmed@example.com",
                password: "pass123"
            }
        ];
        filename = "Sample_Student_Import.xlsx";
    } else if (selectedType === "TrueFalse") {
        sampleData = [
            { code: "1001" },
            { code: "1002" }
        ];
        filename = "Sample_Subscription_Codes.xlsx";
    } else {
        alert("⚠️ Unknown operation type.");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(sampleData, { skipHeader: false });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample");

    // تحديد عرض الأعمدة حسب المحتوى
    const columnWidths = Object.keys(sampleData[0]).map(key => {
        const maxLen = Math.max(...sampleData.map(r => String(r[key]).length), key.length);
        return { wch: maxLen + 2 };
    });
    worksheet['!cols'] = columnWidths;

    XLSX.writeFile(workbook, filename);
});
