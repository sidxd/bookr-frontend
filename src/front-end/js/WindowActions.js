// Add site.

// Add site function.

const siteListArr = []

const addSite = () => {

    const siteList = document.querySelector(".sites-list") //.. List of all bookmarked sites.
    const siteBox = document.createElement("li") //............. Create the container for a bookmark.
    const siteTitle = document.createElement("h5") //........... Create title of the site.
    const expandButton = document.createElement("button") //.... Create button that expands bookmark.
    const siteDesc = document.createElement("p") //............. Create description (To be changed).
    const siteCapture = document.createElement("img") //.......... Create image screenshot.
    const removeBox = document.createElement("button") //....... Create "remove" button.
    const siteFavicon = document.createElement("p")

    siteBox.classList.add("site")
    siteTitle.classList.add("site-title")
    expandButton.classList.add("expand-box")
    siteDesc.classList.add("site-desc")
    siteCapture.classList.add("site-img")
    removeBox.classList.add("site-remove")
    siteFavicon.classList.add("site-favicon")

    siteBox.appendChild(siteTitle)
    siteBox.appendChild(expandButton)
    siteBox.appendChild(siteDesc)
    siteBox.appendChild(siteCapture)
    siteBox.appendChild(removeBox)
    siteBox.appendChild(siteFavicon)

    expandButton.innerHTML = `<svg width="12" height="7" viewBox="0 0 12 7" fill="none"><path d="M11 1L6 6L1 1" stroke="#696969" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    siteDesc.innerHTML = "Lorem Ipsum has been the industry's standard dummy text ever..." // Remove this in production.
    // removeBox.innerHTML = "../assets/delete.svg"
    siteFavicon.src = ""

    chrome.tabs.captureVisibleTab(1, {}, (imageData) => siteCapture.src = imageData)

    siteBox.style.display = "flex"

    chrome.tabs.query({currentWindow: true, active: true}, // Can probably be smaller.
    (tab) => {
        //favIconURL = "chrome://favicon/size/16@1x/" + tab[0].url
        siteTitle.innerHTML = tab[0].title
        if(siteTitle.innerHTML.length > 20) {
            console.log("lol")
            siteTitle.innerHTML = `${siteTitle.innerHTML.substring(0, 16)}...`
        }
        siteUrl = tab[0].url
    })

    siteTitle.addEventListener("click", () => {
        chrome.tabs.create({url: siteUrl, active: false})
    })

    siteList.prepend(siteBox)
    siteListArr.push(siteBox)
    console.log(siteListArr)
    removeBox.addEventListener("click", () => {
        siteBox.classList.add("box-out")
        setTimeout(() => {
            siteList.removeChild(siteBox)
        }, 200)
    })

    expandButton.addEventListener("click", () => {
        siteCapture.classList.toggle("full-view")
        expandButton.classList.toggle("rotate")
        siteDesc.classList.toggle("full-view")
        removeBox.classList.toggle("site-remove__expanded")
    })
}

addButton.addEventListener("click", () => {
    addSite()
})

// Handle button events on navbar.

const actionsContainer = document.querySelector(".action-buttons")
const searchButton = document.querySelector(".search")
const recentsButton = document.querySelector(".recent")
const searchBar = document.querySelector(".searchbar")

searchButton.addEventListener("click", () => {
    searchButton.classList.add("active__link")
    recentsButton.classList.remove("active__link")
    searchBar.style.display = "block"
    actionsContainer.style.display = "none"
})

recentsButton.addEventListener("click", () => {
    recentsButton.classList.add("active__link")
    searchButton.classList.remove("active__link")
    searchBar.style.display = "none"
    actionsContainer.style.display = "block"
})