(async () => {
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("dl") != null)
        currentPanel = "receivePanel";
    
    if (window.mobile())
        currentPanel = "unsupportedPanel";
    
    if (currentPanel == "receivePanel") {
        await sleep(2000);
        window.location.assign("skyshare://receive/" + urlParams.get("dl"));
        await sleep(3000);
        document.getElementById("receiveText").style.opacity = "0";
        await sleep(400);
        document.getElementById("receiveText").innerText = "Ainda não tem o SkyShare? Transfira já!";
        document.getElementById("receiveText").style.opacity = "1";
        document.getElementById("receiveButton").disabled = false;
    }
})();

document.getElementById("downloadButton").addEventListener("click", async () => {
    let ghInfo = await fetch("https://api.github.com/repos/D3W10/SkyShare/releases/latest", {
        method: "GET",
        headers: {
            accept: "application/vnd.github.v3+json"
        }
    });
    ghInfo = await ghInfo.json();

    window.open(ghInfo.assets[0].browser_download_url, "_self");
});

document.getElementById("receiveButton").addEventListener("click", () => window.open(window.location.origin, "_self"));