(async () => {
    await window.reloadIcons();

    for (const element of document.querySelectorAll("[goto]")) {
        element.addEventListener("click", async (event) => {
            let panelToSwitch = event.currentTarget.getAttribute("goto");

            if (!event.currentTarget.hasAttribute("disabled") && !event.currentTarget.parentElement.hasAttribute("disabled")) {
                if (window.openPanel() == panelToSwitch && window.getComputedStyle(document.getElementById(panelToSwitch).children[0]).opacity == "1")
                    return;
                window.switchPanels(panelToSwitch);
            }
        });
    }

    window.updateGreeting();
    setInterval(window.updateGreeting, 3600000);
})();

//#region Home Panel

document.getElementById("downloadApp").addEventListener("click", downloadApp);

async function downloadApp() {
    let ghInfo = await (await fetch("https://api.github.com/repos/D3W10/SkyShare/releases/latest", {
        method: "GET",
        headers: {
            accept: "application/vnd.github.v3+json"
        }
    })).json();

    window.open(ghInfo.assets[0].browser_download_url, "_self");
}

//#endregion

//#region Send Panel

var selectedFiles = new Array(), byteUnits = ["Bytes", "KB", "MB", "GB"], treeCounter = 0;

document.getElementById("filesEmpty").addEventListener("click", (event) => {
    if (event.target.id != "filesInput")
        selectFiles(window.selectMode.CLICK);
});
document.getElementById("addFiles").addEventListener("click", () => selectFiles(window.selectMode.CLICK));

document.getElementById("filesSpace").ondragenter = () => dragAndDrop(window.dragMode.ENTER);
document.getElementById("filesSpace").ondragleave = () => dragAndDrop(window.dragMode.LEAVE);
document.getElementById("filesSpace").ondragover = (event) => event.preventDefault();
document.getElementById("filesSpace").ondrop = (event) => dragAndDrop(window.dragMode.DROP, event);

async function dragAndDrop(mode, event) {
    if (!document.getElementById("filesSpace").hasAttribute("disabled")) {
        if (mode == window.dragMode.ENTER) {
            treeCounter++;
            if (treeCounter == 1) {
                document.querySelector("#filesEmpty > p").innerText = "Preparado para enviar!";
                document.querySelector("#filesEmpty > span").innerText = "Largue-o e eu trato do resto!";
                document.getElementById("filesSpace").style.borderColor = "var(--focusColor)";
            }
        }
        else if (mode == window.dragMode.LEAVE) {
            treeCounter--;
            if (treeCounter == 0) {
                document.querySelector("#filesEmpty > p").innerText = "Escolher ficheiros";
                document.querySelector("#filesEmpty > span").innerText = "Ou arraste para aqui!";
                document.getElementById("filesSpace").removeAttribute("style");
            }
        }
        else if (mode == window.dragMode.DROP) {
            event.preventDefault();
            treeCounter = 0;
            document.querySelector("#filesEmpty > p").innerText = "Escolher ficheiros";
            document.querySelector("#filesEmpty > span").innerText = "Ou arraste para aqui!";
            document.getElementById("filesSpace").removeAttribute("style");
            selectFiles(window.selectMode.DROP, event);
        }
    }
}

async function selectFiles(mode, event) {
    if (!document.getElementById("filesSpace").hasAttribute("disabled")) {
        let selectedFilesRollback = [...selectedFiles], totalFileSize = 0, importError = false;

        if (mode == window.selectMode.CLICK) {
            let inputPromise = new Promise((resolve) => {
                document.getElementById("filesInput").addEventListener("change", () => {
                    for (const file of document.getElementById("filesInput").files) {
                        let fileRejected = false;

                        for (const selectedFile of selectedFiles) {
                            if (file.name == selectedFile.name) {
                                importError = true;
                                fileRejected = true;
                            }
                        }
                        if (fileRejected)
                            continue;

                        selectedFiles.push(file);
                    }
                    resolve();
                }, { once: true });

                document.getElementById("filesInput").click();
            });

            await inputPromise;
        }
        else if (mode == window.selectMode.DROP) {
            for (const file of event.dataTransfer.files) {
                let fileRejected = false;

                if (file.type || file.size % 4096 != 0) {
                    for (const selectedFile of selectedFiles) {
                        if (file.name == selectedFile.name) {
                            importError = true;
                            fileRejected = true;
                        }
                    }
                    if (fileRejected)
                        continue;

                    selectedFiles.push(file);
                }
            }
        }

        for (const file of selectedFiles)
            totalFileSize += file.size;

        if (selectedFiles.length > 50) {
            selectedFiles = [...selectedFilesRollback];
            window.apiErrorHandler(24);
            return;
        }
        else if (totalFileSize >= 1073741824) {
            selectedFiles = [...selectedFilesRollback];
            window.apiErrorHandler(25);
            return;
        }

        if (importError)
            window.showPopUp("Aviso", "Um ou mais dos ficheiros selecionados não puderam ser adicionados, dado que já foram inseridos ficheiros com o mesmo nome.");

        reloadFiles();
    }
}

async function reloadFiles() {
    let totalFileSize = 0, index = 0;;
    document.getElementById("filesContent").replaceChildren();
    document.getElementById("filesNumber").innerText = selectedFiles.length + " ficheiro" + (selectedFiles.length != 1 ? "s" : "");

    if (selectedFiles.length != 0) {
        document.getElementById("filesEmpty").style.display = "none";
        document.getElementById("filesEmpty").style.opacity = "0";
        document.getElementById("filesList").style.display = "flex";
        document.getElementById("filesList").style.opacity = "1";
        document.getElementById("filesSend").disabled = false;

        for (const file of selectedFiles) {
            let fileSizeToFormat = 0, rCount = 0;
            let fileDiv = document.createElement("div");
            let infoDiv = document.createElement("div");
            let fileName = document.createElement("span");
            let fileSize = document.createElement("span");
            let removeIcon = document.createElement("icon");

            fileName.innerText = file.name;
            fileName.title = file.name;

            fileSizeToFormat = file.size;
            totalFileSize += file.size;
            do {
                fileSizeToFormat /= 1024;
                rCount++;
            }
            while (fileSizeToFormat > 1024);
            fileSize.innerText = fileSizeToFormat.toFixed(2) + " " + byteUnits[rCount];

            removeIcon.setAttribute("name", "close");

            infoDiv.appendChild(fileName);
            infoDiv.appendChild(fileSize);
            fileDiv.appendChild(infoDiv);
            fileDiv.appendChild(removeIcon);
            document.getElementById("filesContent").appendChild(fileDiv);

            removeIcon.addEventListener("click", async (event) => {
                if (!document.getElementById("filesSpace").hasAttribute("disabled")) {
                    let parent = event.currentTarget.parentElement;
                    for (const file of selectedFiles) {
                        if (file.name == parent.querySelector("div > span").title)
                            selectedFiles.splice(selectedFiles.indexOf(file), 1);
                    }

                    parent.style.opacity = 0;
                    await window.sleep(200);
                    parent.style.height = 0;
                    parent.style.marginBottom = 0;
                    parent.style.padding = 0;
                    await window.sleep(200);
                    reloadFiles();
                }
            });
        }
        window.reloadIcons();
    }
    else {
        document.getElementById("filesSend").disabled = true;

        document.getElementById("filesList").style.opacity = "0";
        await window.sleep(400);
        document.getElementById("filesList").removeAttribute("style");
        document.getElementById("filesEmpty").style.display = "flex";
        await window.sleep(50);
        document.getElementById("filesEmpty").removeAttribute("style");
    }

    do {
        totalFileSize /= 1024;
        index++;
    }
    while (totalFileSize > 1024);
    document.getElementById("filesSize").innerText = totalFileSize.toFixed(2) + " " + byteUnits[index];
}

document.getElementById("sendMessage").addEventListener("keypress", enterSendButton);

function enterSendButton(event) {
    if (event.key == "Enter")
        document.getElementById("filesSend").click();
}

document.getElementById("filesSend").addEventListener("click", async () => {
    try {
        document.getElementById("loadBar").style.display = "block";
        document.getElementById("filesSpace").setAttribute("disabled", "");
        document.getElementById("sendMessage").disabled = true;
        document.getElementById("filesSend").disabled = true;
        document.querySelector("#filesPrepare a[goto=\"homePanel\"]").setAttribute("disabled", "");
    
        let tData = await window.sendFile(selectedFiles, document.getElementById("sendMessage").value);
        if (typeof tData == "boolean") {
            window.showPopUp("Erro ao enviar", "Ocorreu um erro durante o envio dos ficheiros. Por favor tente novamente mais tarde.");
    
            selectedFiles = new Array();
            document.getElementById("filesSpace").removeAttribute("disabled");
            document.getElementById("sendMessage").disabled = false;
            document.getElementById("sendMessage").value = "";
            document.querySelector("#filesPrepare a[goto=\"homePanel\"]").removeAttribute("disabled");
            document.getElementById("uploadEta").innerText = "0 segundos";
            document.getElementById("uploadSpeed").innerText = "0.00 MB/s";
            document.querySelector("#uploadProgress > svg").style.removeProperty("--value");
            document.querySelector("#uploadProgress > p").innerText = "0";
            reloadFiles();
    
            window.switchSubpanels(document.getElementById("filesUploading"), document.getElementById("filesPrepare"));
            return;
        }
    
        tData.creation = new Date(tData.creation);
        tData.expire = new Date(tData.expire);
        document.getElementById("transferCode").innerText = tData.code;
        document.getElementById("transferCreation").innerText = tData.creation.toLocaleDateString();
        document.getElementById("transferExpire").innerText = tData.expire.toLocaleDateString();
        await window.switchSubpanels(document.getElementById("filesUploading"), document.getElementById("filesDone"));
    
        selectedFiles = new Array();
        document.getElementById("filesSpace").removeAttribute("disabled");
        document.getElementById("sendMessage").disabled = false;
        document.getElementById("sendMessage").value = "";
        document.querySelector("#filesPrepare a[goto=\"homePanel\"]").removeAttribute("disabled");
        document.getElementById("uploadEta").innerText = "0 segundos";
        document.getElementById("uploadSpeed").innerText = "0.00 MB/s";
        document.querySelector("#uploadProgress > svg").style.removeProperty("--value");
        document.querySelector("#uploadProgress > p").innerText = "0";
        reloadFiles();
    }
    catch {
        window.showPopUp("Erro ao enviar", "Um ou mais ficheiros a enviar já não existem. Verifique se os mesmos ainda estão na mesma pasta e tente novamente.");
    }
});

document.getElementById("doneCopy").addEventListener("click", async (event) => {
    if (!event.currentTarget.parentElement.hasAttribute("disabled")) {
        let entry = event.currentTarget, entryDiv = event.currentTarget.parentElement;
        entryDiv.setAttribute("disabled", "");

        window.copyToClipboard(document.getElementById("transferCode").innerText);
        entry.style.fill = "var(--accent)";
        await window.sleep(1200);
        entry.removeAttribute("style");

        entryDiv.removeAttribute("disabled");
    }
});

document.getElementById("doneCopyLink").addEventListener("click", async (event) => {
    if (!event.currentTarget.parentElement.hasAttribute("disabled")) {
        let entry = event.currentTarget, entryDiv = event.currentTarget.parentElement;
        entryDiv.setAttribute("disabled", "");

        window.copyToClipboard(window.location.href + "?dl=" + document.getElementById("transferCode").innerText);
        entry.style.fill = "var(--accent)";
        await window.sleep(1200);
        entry.removeAttribute("style");

        entryDiv.removeAttribute("disabled");
    }
});

//#endregion

//#region Receive Panel

for (let i = 1; i <= 6; i++) {
    document.getElementById("code" + i).addEventListener("keydown", (event) => {
        if ((event.ctrlKey && event.key == "v") || /[0-9]/.test(event.key))
            return;
        if (!/[0-9]/.test(event.key) && event.key != "Backspace" && event.key != "Delete")
            event.preventDefault();
        if (event.key == "Backspace") {
            if (document.getElementById("code" + i).value.length == 0 && i != 1)
                document.getElementById("code" + (i - 1)).focus();
        }
        else if (event.key == "Enter")
            document.getElementById("filesReceive").click();
        else if (event.key == "ArrowRight" && i != 6)
            document.getElementById("code" + (i + 1)).focus();
        else if (event.key == "ArrowLeft" && i != 1)
            document.getElementById("code" + (i - 1)).focus();
    });

    document.getElementById("code" + i).addEventListener("keypress", async (event) => {
        if (!Object.is(Number(event.key), NaN) && i != 6) {
            await window.sleep(10);
            document.getElementById("code" + (i + 1)).focus();
        }
    });

    document.getElementById("code" + i).addEventListener("input", () => {
        if (Object.is(Number(document.getElementById("code" + i).value), NaN))
            document.getElementById("code" + i).value = "";

        if (document.getElementById("code1").value.length != 0 && document.getElementById("code2").value.length != 0 && document.getElementById("code3").value.length != 0 && document.getElementById("code4").value.length != 0 && document.getElementById("code5").value.length != 0 && document.getElementById("code6").value.length != 0)
            document.getElementById("filesReceive").disabled = false;
        else
            document.getElementById("filesReceive").disabled = true;
    });

    document.getElementById("code" + i).addEventListener("paste", (event) => {
        let clipboardCode = event.clipboardData.getData("text");

        event.preventDefault();
        if (/^\d{6}$/.test(clipboardCode)) {
            document.getElementById("code1").value = clipboardCode[0];
            document.getElementById("code2").value = clipboardCode[1];
            document.getElementById("code3").value = clipboardCode[2];
            document.getElementById("code4").value = clipboardCode[3];
            document.getElementById("code5").value = clipboardCode[4];
            document.getElementById("code6").value = clipboardCode[5];
            document.getElementById("filesReceive").disabled = false;
        }
    });
}

document.getElementById("filesReceive").addEventListener("click", async () => {
    document.getElementById("filesReceive").disabled = true;
    for (let i = 1; i <= 6; i++)
        document.getElementById("code" + i).disabled = true;
    document.getElementById("loadBar").style.display = "block";
    document.getElementById("receiveInfo").setAttribute("disabled", "");
    document.querySelector("#receivePanel a[goto=\"homePanel\"]").setAttribute("disabled", "");

    let receiveSuccess = await window.receiveFile(document.getElementById("code1").value + document.getElementById("code2").value + document.getElementById("code3").value + document.getElementById("code4").value + document.getElementById("code5").value + document.getElementById("code6").value);

    for (let i = 1; i <= 6; i++)
        document.getElementById("code" + i).disabled = false;
    document.getElementById("loadBar").style.display = "none";
    document.querySelector("#receivePanel a[goto=\"homePanel\"]").removeAttribute("disabled");
    if (receiveSuccess) {
        document.getElementById("code1").value = "";
        document.getElementById("code2").value = "";
        document.getElementById("code3").value = "";
        document.getElementById("code4").value = "";
        document.getElementById("code5").value = "";
        document.getElementById("code6").value = "";
    }
    else
        document.getElementById("filesReceive").disabled = false;
});

async function transferMessageResize() {
    document.getElementById("transferMessage").removeAttribute("style");

    if (document.getElementById("transferMessage").offsetWidth > 204) {
        document.querySelector("#transferMessageSafe > style").innerText = "@keyframes textSlide { 0% { left: 204px; } 100% { left: -" + document.getElementById("transferMessage").offsetWidth + "px; } }";
        document.getElementById("transferMessage").style.animation = "textSlide " + (document.getElementById("transferMessage").innerText.length * 0.1) + "s linear 0s infinite";
        document.getElementById("transferMessageSafe").classList.add("moving");
    }
    else
        document.getElementById("transferMessageSafe").classList.remove("moving");
}

new ResizeObserver(transferMessageResize).observe(document.getElementById("transferMessage"));

//#endregion

//#region Download Panel

document.getElementById("openApp").addEventListener("click", () => {
    let urlParams = new URLSearchParams(window.location.search);
    window.location.assign("skyshare://receive/" + urlParams.get("dl"))
});

document.getElementById("webReceive").addEventListener("click", () => {
    let urlParams = new URLSearchParams(window.location.search);

    document.getElementById("code1").value = urlParams.get("dl")[0];
    document.getElementById("code2").value = urlParams.get("dl")[1];
    document.getElementById("code3").value = urlParams.get("dl")[2];
    document.getElementById("code4").value = urlParams.get("dl")[3];
    document.getElementById("code5").value = urlParams.get("dl")[4];
    document.getElementById("code6").value = urlParams.get("dl")[5];

    document.getElementById("filesReceive").disabled = false;
    document.getElementById("filesReceive").click();
});

document.getElementById("downloadAppReceive").addEventListener("click", downloadApp);

//#endregion