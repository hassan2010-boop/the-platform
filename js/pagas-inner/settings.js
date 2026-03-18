const saveButton = document.getElementById("saveButton");
const groupNameInput = document.getElementById("groupName");
const fileInput = document.getElementById("photoUpload");
const imagePreview = document.getElementById("imagePreview");
const placeholderText = document.querySelector(".placeholder-text");

let tempImageBase64 = "";

fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                // Set maximum dimensions (e.g., 800px width)
                const maxWidth = 800;
                const scale = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scale;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Compress to JPEG with 0.6 (60%) quality
                tempImageBase64 = canvas.toDataURL("image/jpeg", 0.6);
                
                imagePreview.src = tempImageBase64;
                imagePreview.style.display = "block";
                if (placeholderText) placeholderText.style.display = "none";
            };
        };
        reader.readAsDataURL(file);
    }
});

saveButton.addEventListener("click", function () {
    const nameValue = groupNameInput.value.trim();
    
    if (!nameValue) {
        alert("Please enter a photo name!");
        return;
    }

    if (!tempImageBase64) {
        alert("Please select an image!");
        return;
    }

    let gradeNumber = sessionStorage.getItem("namephoto") || "";
    let gradeKey = "";

    if (gradeNumber === "1") gradeKey = "first";
    else if (gradeNumber === "2") gradeKey = "second";
    else if (gradeNumber === "3") gradeKey = "third";
    else {
        alert("Error: Grade not detected.");
        return;
    }

    let photoData = JSON.parse(localStorage.getItem("photo")) || {
        tables: { first: "", second: "", third: "" },
        images: {}
    };

    if (!photoData.tables) {
        photoData.tables = { first: "", second: "", third: "" };
    }

    const rowHTML = `
        <tr>
            <td>?</td>
            <td><button class="group-button" data-name="${nameValue}">${nameValue}</button></td>
            <td><button class="download-button">Download</button></td>
            <td><button class="removal"><img src="1/Delete.png" alt="delete"></button></td>
        </tr>
    `;

    photoData.tables[gradeKey] += rowHTML;
    photoData.images[nameValue] = tempImageBase64;

    localStorage.setItem("photo", JSON.stringify(photoData));

    alert("Created successfully!");
    window.location.href = "../Pluralism-photos.html";
});