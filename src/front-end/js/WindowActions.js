// Add site.

// Add site function.

const siteListArr = []

const header = document.querySelector(".header")
const actionButtons = document.querySelector(".action-buttons")
const searchbar = document.querySelector(".searchbar")
const navbar = document.querySelector(".navbar")

handleDelete = () => {

    if(document.querySelector('.delete-container')) return

    const deleteContainer = document.createElement("div")
    const deleteText = document.createElement("p")
    const deleteOptions = document.createElement("nav")
    const deleteConfirm = document.createElement("button")
    const deleteCancel = document.createElement("button")

    deleteContainer.classList.add("delete-container")
    deleteText.classList.add("delete-text")
    deleteOptions.classList.add("delete-options")
    deleteConfirm.classList.add("delete-yes")
    deleteCancel.classList.add("delete-no")

    document.body.appendChild(deleteContainer)
    deleteContainer.appendChild(deleteText)
    deleteContainer.appendChild(deleteOptions)
    deleteOptions.appendChild(deleteConfirm)
    deleteOptions.appendChild(deleteCancel)

    deleteText.innerHTML = "Confirm deletion."
    deleteCancel.innerHTML = "No"
    deleteConfirm.innerHTML = "Yes"

    const ghostbox = document.querySelector(".ghostbox")
    ghostbox.style.pointerEvents = "none"
    ghostbox.classList.add("darker")

    deleteConfirm.addEventListener("click", () => {
        siteBox.classList.add("box-out")
        setTimeout(() => {
            siteList.removeChild(siteBox)
        }, 200)
        document.body.removeChild(deleteContainer)
        ghostbox.style.pointerEvents = "all"
        ghostbox.classList.remove("darker")
    })

    deleteCancel.addEventListener("click", () => {
        document.body.removeChild(deleteContainer)
        ghostbox.style.pointerEvents = "all"
        ghostbox.classList.remove("darker")
    })
}

removeBox = document.createElement("button") //....... Create "remove" button.
removeBox.classList.add("site-remove")
removeBox.style.display = "none"

const addSite = () => {

    siteList = document.querySelector(".sites-list") //.. List of all bookmarked sites.
    siteBox = document.createElement("li") //............. Create the container for a bookmark.
    const siteTitle = document.createElement("h5") //........... Create title of the site.
    const expandButton = document.createElement("button") //.... Create button that expands bookmark.
    const siteDesc = document.createElement("p") //............. Create description (To be changed).
    const siteCapture = document.createElement("img") //.......... Create image screenshot.
    // removeBox = document.querySelector("site-remove") //....... Create "remove" button.
    const siteFavicon = document.createElement("img")
    let siteUrl = ''

    siteBox.classList.add("site")
    siteTitle.classList.add("site-title")
    expandButton.classList.add("expand-box")
    siteDesc.classList.add("site-desc")
    siteCapture.classList.add("site-img")
    siteFavicon.classList.add("site-favicon")
    removeBox.style.display = "block"

    siteBox.appendChild(siteTitle)
    siteBox.appendChild(expandButton)
    siteBox.appendChild(siteDesc)
    siteBox.appendChild(siteCapture)
    siteBox.appendChild(removeBox)
    siteBox.appendChild(siteFavicon)

    expandButton.innerHTML = `<svg width="12" height="7" viewBox="0 0 12 7" fill="none"><path d="M11 1L6 6L1 1" stroke="#696969" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`

    chrome.tabs.captureVisibleTab(1, {}, (imageData) => siteCapture.src = imageData)

    siteBox.style.display = "flex"

    chrome.tabs.query({currentWindow: true, active: true}, // Can probably be smaller.
    (tab) => {
        siteTitle.innerHTML = tab[0].title
        if(siteTitle.innerHTML.length > 16) {
            siteTitle.innerHTML = `${siteTitle.innerHTML.substring(0, 14)}...`
        }
        siteUrl = tab[0].url
    })

    chrome.tabs.query({
        "active": true, //fetch active tabs
        "currentWindow": true, //fetch tabs in current window
        "status": "complete", //fetch completely loaded windows
        "windowType": "normal" //fetch normal windows
    }, function (tabs) {
        for (tab in tabs) {
            siteFavicon.src = tabs[tab].favIconUrl// Use this URL as needed
        }
    })

    siteTitle.addEventListener("click", () => {
        chrome.tabs.create({url: siteUrl, active: false})
    })

    siteList.prepend(siteBox)
    siteListArr.push(siteBox)

    expandButton.addEventListener("click", () => {
        siteCapture.classList.toggle("full-view")
        expandButton.classList.toggle("rotate")
        siteDesc.classList.toggle("full-view")
        removeBox.classList.toggle("site-remove__expanded")
    })

    chrome.tabs.query (
        { active: true },
        function(tabs) {
          const { id: tabId } = tabs[0].url;
      
          let code = `
          document.querySelector("meta[name=description]").getAttribute("content")
          `
          chrome.tabs.executeScript(tabId, { code }, function (result) {
            console.log(result[0])
            siteDesc.innerHTML = result[0]
            if(siteDesc.innerHTML.length > 64) {
                siteDesc.innerHTML = `${siteDesc.innerHTML.substring(0, 64)}...`
            }
          })
        }
    )
}

removeBox.addEventListener("click", () => {
    handleDelete()
})

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