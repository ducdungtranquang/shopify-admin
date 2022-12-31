export const handleClickBtn = (target, e, event) => {
    console.log(e.currentTarget.className.indexOf('active'));
    let index = e.currentTarget.className.indexOf('active')
    // console.log('...');
    target.document.execCommand(event, false, null);
    // if (index > -1) {
    //     e.currentTarget.classList.remove("active")
    //     e.currentTarget.style.backgroundColor = "white";
    // }
    // else {
    //     e.currentTarget.style.backgroundColor = "#edeeef";
    //     e.currentTarget.classList.add("active")
    // }
}

export const handleClickHeading = (target, event) => {
    target.document.execCommand("formatBlock", false, event);
}

export const handleChangeColor = (target, event, index) => {
    if (index === 0) {
        target.document.execCommand("foreColor", false, `hsl(${Math.ceil(event.hue)},${Math.ceil(event.saturation * 100)}%,${Math.ceil(event.brightness * 100)}%)`);
        console.log(`hsl(${Math.ceil(event.hue)},${Math.ceil(event.saturation * 100)}%,${Math.ceil(event.brightness * 100)}%)`);

    }
    else {
        target.document.execCommand("backColor", false, `hsl(${Math.ceil(event.hue)},${Math.ceil(event.saturation * 100)}%,${Math.ceil(event.brightness * 100)}%)`);
        console.log(event);
    }
}

export const handleImportVideo = (target, event)=>{
    target.document.execCommand("insertHTML", false, event);
}

export const handleImportImg = (target, event) =>{
    target.document.execCommand("insertImage", false, event);
    const imgs = target.document.querySelectorAll('img');
    imgs.forEach(e=>{
        e.style.maxWidth = "400px";
    })
}

export const createLink = (target, event, blank) =>{
    target.document.execCommand("createLink", false, event);
    // const links = target.document.querySelectorAll('a');
    // if()
}

export const showCode = (target, event, show) =>{
    target.document.execCommand("showCode", false, null);
    const textBody = target.document.querySelector('body');
    if(show){
        textBody.textContent = textBody.innerHTML;
        console.log(textBody.textContent);
    }
    else{
        textBody.innerHTML =textBody.textContent;
        console.log(textBody.textContent);
    }

}
