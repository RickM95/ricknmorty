function click() {
    let menuHeader=document.getElementById("menuheader")
let menuModel=document.getElementById("menumodel")

menuHeader.addEventListener("click",()=>{
    return menuModel.classList.toggle("hidden")
})
}

export{click}