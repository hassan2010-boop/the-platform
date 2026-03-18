    let span =document.getElementById("span");
    const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');;
    if(7 < hours && hours <15){
        span.textContent = "good morning get cup of tea for work " ;
    }else if(0< hours && hours <6){
        span.textContent = "go to bed look to clock ";
    }else{
        span.textContent = "good night";
    }