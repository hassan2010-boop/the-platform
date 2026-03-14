document.addEventListener("DOMContentLoaded", function () {
    let input = document.getElementById("groupName");
    let saveButton = document.getElementById("saveButton");
    let kinds = sessionStorage.getItem("kinds") || "";

    saveButton.addEventListener("click", function () {
        if(!input.value){
        alert("input is free");
        return;
        }
        datapro=[ ]
        let newpro = {
            name:input.value,
            kind:kinds,
        } 
        if(localStorage.group !=null){
        datapro =JSON.parse(localStorage.group )
        }else{
        datapro=[ ]
        }
    if(newpro.count >1){
    for(let i =0 ; i<newpro.count ;i++)
    {datapro.push(newpro)}
    }else{
    datapro.push(newpro)}
    
        localStorage.setItem("group" , JSON.stringify(datapro))
        localStorage.setItem(input.value+"-group" , "")
        alert("Group name saved");
        window.location.href = "../Pluralism-Subscribe.html";
    });

    // تأثير الخلفية الديناميكي للزر
    saveButton.addEventListener('mousemove', (e) => {
        const rect = saveButton.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        saveButton.style.background = `radial-gradient(circle at ${x}px ${y}px, #8c52ff,rgba(111, 39, 255, 0.6))`;
    });

    saveButton.addEventListener('mouseleave', () => {
        saveButton.style.background = 'radial-gradient(circle at center, #8c52ff, #8c52ff99)';
    });
});
