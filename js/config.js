//TODO: show error on config page
function restoreConfig(){
    function setCurrentChoice(result){
        document.querySelector("#matches").value = result.matches;
    }
    function onError(error){
        console.log(error);
    }
    browser.storage.local.get("matches").then(setCurrentChoice, onError);
}

function saveConfig(query){
    query.preventDefault();
    browser.storage.local.set({
        matches: document.querySelector("#matches").value 
    });
}

document.addEventListener("DOMContentLoaded", restoreConfig);
document.querySelector("form").addEventListener("submit", saveConfig);
