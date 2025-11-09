window.addEventListener("load", () => {
    const logo = document.getElementById("header-logo")
    logo.classList.add("hover")

    setTimeout(() => {
        logo.classList.remove("hover")
    }, 3000)
})
