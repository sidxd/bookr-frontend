const closeButton = document.querySelector(".close__btn")
const addButton = document.querySelector(".action__button")

// Close Pop-up.
closeButton.addEventListener("click", () => window.close())

// const onDelete = () => {
//     const deleteContainer = document.createElement("div")
//     const deleteText = document.createElement("p")
//     const deleteOptions = document.createElement("nav")
//     const deleteConfirm = document.createElement("button")
//     const deleteCancel = document.createElement("button")

//     deleteText.innerHTML = "Confirm deletion."
//     deleteCancel.innerHTML = "No"
//     deleteConfirm.innerHTML = "Yes"
// }