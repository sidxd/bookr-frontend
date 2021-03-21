// Add site.

// Add site function.

// let x = (siteListArr) => siteListArr.filter((v, i) => siteListArr.indexOf(v) === i)

const getElement = (classname) => document.querySelector(classname)
const makeElement = (element) => document.createElement(element)

handleDelete = () => {

    if(document.querySelector('.delete-container')) return

    const deleteContainer = makeElement("div")
    const deleteText = makeElement("p")
    const deleteOptions = makeElement("nav")
    const deleteConfirm = makeElement("button")
    const deleteCancel = makeElement("button")

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

    const ghostbox = getElement(".ghostbox")
    ghostbox.style.pointerEvents = "none"
    ghostbox.classList.add("darker")

    deleteConfirm.addEventListener("click", () => {
        siteBox.classList.add("box-out")
        setTimeout(() => {
            siteList.removeChild(siteBox)
        }, 200)
        siteBox.classList.remove("box-out")
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

let titleStore

const addSite = async () => {

    siteList = getElement(".sites-list") //.. List of all bookmarked sites.
    siteBox = makeElement("li") //............. Create the container for a bookmark.
    siteTitle = makeElement("h5") //........... Create title of the site.
    expandButton = makeElement("button") //.... Create button that expands bookmark.
    siteDesc = makeElement("p") //............. Create description (To be changed).
    siteCapture = makeElement("img") //.......... Create image screenshot.
    removeBox = makeElement("site-remove") //....... Create "remove" button.
    siteFavicon = makeElement("img")

    siteBox.classList.add("site")
    siteTitle.classList.add("site-title")
    expandButton.classList.add("expand-box")
    siteDesc.classList.add("site-desc")
    siteCapture.classList.add("site-img")
    siteFavicon.classList.add("site-favicon")
    removeBox.classList.add("site-remove")
    removeBox.style.display = "block"

    siteBox.appendChild(siteTitle)
    siteBox.appendChild(expandButton)
    siteBox.appendChild(siteDesc)
    siteBox.appendChild(siteCapture)
    siteBox.appendChild(removeBox)
    siteBox.appendChild(siteFavicon)
    expandButton.innerHTML = `<svg width="12" height="7" viewBox="0 0 12 7" fill="none"><path d="M11 1L6 6L1 1" stroke="#696969" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    
    // GET elements from Chrome's API.

    FIELD: await chrome.tabs.query ({
        active : true,
        currentWindow : true,
        status : "complete",
        windowType : "normal"
        }, (tab) => {

            siteTitle = siteTitle.innerHTML
            siteTitle = tab[0].title
            titleStore = tab[0].title

            // LIMIT characters in title to 16.

            if(siteTitle.length > 16) {
                siteTitle = `${siteTitle.substring(0, 16)}...`
            }

            siteFavicon.src = tab[0].favIconUrl
            siteUrl = tab[0].url

            // GET site image.

            chrome.tabs.captureVisibleTab(1, {}, (imageData) => siteCapture.src = imageData)

            // GET description.

            const { id: tabId } = tab[0].url;
      
            let code = `document.querySelector("meta[name=description]").getAttribute("content")`

            chrome.tabs.executeScript(tabId, { code }, (result) => {

                siteDesc.innerHTML = result[0]

                // LIMIT characters in description to 64.

                if(siteDesc.innerHTML.length > 64) {
                    siteDesc.innerHTML = `${siteDesc.innerHTML.substring(0, 64)}...`
                }
            })

        }
    )

    console.log(titleStore)

    // CREATE and open link in new tab when title is clicked on.

    siteTitle.addEventListener("click", () => {
        chrome.tabs.create({url: siteUrl, active: false})
    })

    expandButton.addEventListener("click", () => {
        siteCapture.classList.toggle("full-view")
        expandButton.classList.toggle("rotate")
        siteDesc.classList.toggle("full-view")
        removeBox.classList.toggle("site-remove__expanded")
    })

    removeBox.addEventListener("click", () => {
        handleDelete()
    })
}

addButton.addEventListener("click", () => {
    addSite()
})

// Handle button events on navbar.

const actionsContainer = getElement(".action-buttons")
const searchButton = getElement(".search")
const recentsButton = getElement(".recent")
const searchBar = getElement(".searchbar")

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