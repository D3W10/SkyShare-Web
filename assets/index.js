var currentPanel = "homePanel", apiUrl = "https://skyshare-api.herokuapp.com/";

window.addEventListener("load", async () => {
    document.body.classList.add("bg" + (Math.floor(Math.random() * 10) + 1));

    if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        document.body.setAttribute("theme", "dark");

    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("dl") != null && urlParams.get("dl").length == 6 && /^\d{6}$/g.test(urlParams.get("dl")))
        currentPanel = "downloadPanel";

    for (const panel of document.getElementById("window").children) {
        if (panel.id != currentPanel && panel.id != "loadBar") {
            panel.style.opacity = "0";
            panel.style.display = "none";
        }
    }
    
    document.getElementById("window").style.opacity = "1";
    
    if (currentPanel == "downloadPanel") {
        await window.sleep(2000);
        document.getElementById("openApp").click();
        await window.sleep(2000);
        document.getElementById("downloadText").style.opacity = "0";
        await window.sleep(800);
        document.getElementById("downloadText").style.display = "none";
        document.getElementById("downloadRightSide").classList.add("options");
        await window.sleep(50);
        document.getElementById("downloadOptions").style.opacity = "1";
    }
});

//#region Embed into window

window.mobile = () => {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

window.reloadIcons = async () => {
    for (const icon of document.getElementsByTagName("icon")) {
        try {
            let iconXML = await fetch("./assets/icons/" + icon.getAttribute("name") + ".svg");
            icon.innerHTML = await iconXML.text();
        }
        catch {
            console.warn("Não foi possível carregar o icone: " + icon.getAttribute("name"));
        }
    }
}

window.openPanel = () => currentPanel;

window.switchPanels = async (to) => {
    document.getElementById(currentPanel).style.opacity = "0";
    await window.sleep(200);
    document.getElementById(currentPanel).style.display = "none";

    for (const subPanel of document.getElementById(to).children)
        subPanel.removeAttribute("style");

    currentPanel = to;

    document.getElementById(to).style.display = "flex";
    await window.sleep(200);
    document.getElementById(to).removeAttribute("style");
}

window.switchSubpanels = async (from, to) => {
    let fromI = 0, toI = 0;
    for (let i = 0; i < from.parentElement.children.length; i++) {
        if (from.parentElement.children[i] == from)
            fromI = i;
        if (from.parentElement.children[i] == to)
            toI = i;
    }

    if (fromI <= toI)
        from.style.transform = "translateX(-30px)";
    else
        from.style.transform = "translateX(30px)";
    from.style.opacity = "0";
    await window.sleep(200);
    from.style.display = "none";
    to.style.display = "flex";
    await window.sleep(50);
    to.style.transform = "translateX(0px)";
    to.style.opacity = "1";
}

window.updateGreeting = () => {
    let currentHour = new Date().getHours();

    if (currentHour >= 8 && currentHour <= 12)
        document.getElementById("greetingTime").innerText = "Bom dia";
    else if (currentHour >= 13 && currentHour <= 19)
        document.getElementById("greetingTime").innerText = "Boa tarde";
    else if (currentHour >= 20 || currentHour <= 7)
        document.getElementById("greetingTime").innerText = "Boa noite";
}

window.sendFile = async (files, message) => {
    return new Promise(async (resolve) => {
        let signupFormData = new FormData();
        for (const file of files)
            signupFormData.append("file", file);
        signupFormData.append("message", message);
    
        let apiResult = await fetch(apiUrl + "file/upload", {
            method: "POST",
            body: signupFormData
        });
        let apiResultJSON = await apiResult.json();
        let errorHandler = await window.apiErrorHandler(apiResultJSON.code, apiResult.status);

        if (errorHandler) {
            document.getElementById("loadBar").style.display = "none";
            window.switchSubpanels(document.getElementById("filesPrepare"), document.getElementById("filesUploading"));
    
            let pgsRepeat = setInterval(async () => {
                let apiResult = await fetch(apiResultJSON.value.progressUrl, { method: "GET" });
                let apiResultJSON2 = await apiResult.json();
                let errorHandler = await window.apiErrorHandler(apiResultJSON2.code, apiResult.status);
    
                if (errorHandler) {
                    document.querySelector("#uploadProgress > svg").style.setProperty("--value", apiResultJSON2.value.percentage);
                    document.querySelector("#uploadProgress > p").innerText = apiResultJSON2.value.percentage;
                    document.getElementById("uploadEta").innerText = apiResultJSON2.value.eta == undefined ? "0 segundos" : apiResultJSON2.value.eta;
                    document.getElementById("uploadSpeed").innerText = apiResultJSON2.value.speed == undefined ? "0.00 MB/s" : apiResultJSON2.value.speed;
                    if (apiResultJSON2.value.percentage == 100) {
                        clearInterval(pgsRepeat);
                        resolve(apiResultJSON2.value.transfer);
                    }
                }
                else {
                    clearInterval(pgsRepeat);
                    resolve(false);
                }
            }, 1000);
        }
        else
            resolve(false);
    });
}

window.receiveFile = async (code) => {
    let apiResult = await fetch(apiUrl + "file/" + code + "/info", { method: "GET" });
    let apiResultJSON = await apiResult.json();
    let errorHandler = await window.apiErrorHandler(apiResultJSON.code, apiResult.status);

    if (errorHandler) {
        if (apiResultJSON.value.message != null)
            document.getElementById("transferMessage").innerText = apiResultJSON.value.message;
        else
            document.getElementById("transferMessage").innerHTML = "<i>Sem mensagem</i>";

        if (apiResultJSON.value.sentBy != null)
            document.getElementById("transferSentBy").innerText = apiResultJSON.value.sentBy;
        else
            document.getElementById("transferSentBy").innerHTML = "<i>Convidado</i>";

        document.getElementById("receiveInfo").removeAttribute("disabled");
        window.open(apiUrl + "file/" + code, "_self")
    }
}

window.copyToClipboard = async (text) => {
    let copyPermission = await navigator.permissions.query({ name: "clipboard-write" });
    if (copyPermission.state == "granted" || copyPermission.state == "prompt")
        navigator.clipboard.writeText(text);
    else
        window.showPopUp("Erro ao copiar", "O navegador não permitiu que o texto pudesse ser copiado.");
}

window.showPopUp = (title, text) => {
    return new Promise(async (resolve) => {
        document.querySelector("#alertPopup > h1").innerText = title;
        document.querySelector("#alertPopup > p").innerText = text;
    
        async function closePopUp(event) {
            if (event.currentTarget == event.target) {
                resolve();

                document.getElementById("popups").style.opacity = "0";
                document.getElementById("window").style.opacity = "1";
                document.getElementById("alertPopup").style.opacity = "0";
                document.getElementById("alertPopup").style.transform = "scale(0.5)";
                await window.sleep(200);
                document.getElementById("alertPopup").removeAttribute("style");
                document.getElementById("popups").removeAttribute("style");
            }
        }
    
        document.getElementById("popups").style.display = "flex";
        await window.sleep(50);
        document.getElementById("popups").style.opacity = "1";
        document.getElementById("alertPopup").style.display = "block";
        await window.sleep(50);
        document.getElementById("window").style.opacity = "0.8";
        document.getElementById("alertPopup").style.opacity = "1";
        document.getElementById("alertPopup").style.transform = "scale(1)";
    
        document.getElementById("popups").addEventListener("click", closePopUp, { once: true });
        document.getElementById("alertPopupButton").addEventListener("click", closePopUp, { once: true });
    });
}

window.apiErrorHandler = async (code, status) => {
    let strings = ["Erro desconhecido", "O servidor devolveu um erro não conhecido."];

    switch (code) {
        case 0:
            return true;
        case 1:
            strings = ["Parâmetros em Falta", "Um dos parâmetros obrigatórios está em falta."];
            break;
        case 22:
            strings = ["Nenhum ficheiro", "Nenhum ficheiro enviado."];
            break;
        case 23:
            strings = ["Mensagem Inválida", "A sua mensagem é demasiado grande. Por favor resuma-a e tente novamente."];
            break;
        case 24:
            strings = ["Limite excedido", "A quantidade máxima de ficheiros que pode enviar é 50."];
            break;
        case 25:
            strings = ["Limite excedido", "O tamanho total dos ficheiros não pode ser superior a 1 GB."];
            break;
        case 26:
            strings = ["Erro desconhecido", "Ocorreu um erro ao tentar gerar um código de envio. Por favor tente novamente mais tarde."];
            break;
        case 27:
            strings = ["Código Inválido", "O código de envio inserido não é válido. Por favor tente novamente."];
            break;
        case 28:
            strings = ["Código Inválido", "O código de envio inserido não é de uma transferência existente. Verifique se o escreveu corretamente e tente novamente."];
            break;
        case 29:
            strings = ["Erro desconhecido", "Ocorreu um erro ao tentar verificar o código de envio. Por favor tente novamente mais tarde."];
            break;
        case 30:
            strings = ["Erro desconhecido", "Ocorreu um erro ao tentar obter os dados da transferência. Por favor tente novamente mais tarde."];
            break;
        case 31:
            strings = ["Código Inválido", "O código de envio não é de uma transferência em progresso."];
            break;
        case 44:
            strings = ["Erro na Conexão", "Ocorreu um erro inesperado."];
            break;
        case 50:
            strings = ["Erro de Servidor", "Ocorreu um erro inesperado no servidor o que fez com que o seu pedido não pudesse ser realizado. Tente novamente mais tarde."];
            break;
        default:
            if (status == 503)
                strings = ["Erro de Servidor", "O servidor não está em funcionamento neste momento. Por favor tente novamente mais tarde."];
            break;
    }

    await window.showPopUp(strings[0], strings[1]);
    return false;
}

window.sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

window.selectMode = {
    CLICK: 0,
    DROP: 1
}

window.dragMode = {
    ENTER: 0,
    LEAVE: 1,
    DROP: 2
}

//#endregion