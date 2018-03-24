//TODO: show error on config page
//hostContains
//hostsuffix
//pathcontains
//regular expression
//port
var config = [];

function addConfigEntry(t, d){
    config.push({type: t, data: d});
}

function isInConfig(type, data){
    for(e in config){
        if(config[e].type == type && config[e].data == data)
            return true;
    }
    return false;
}

function addEntry(){
    console.log("add");
    var entry = document.createElement("li");
    var type = document.getElementById("type");
    var data = document.getElementById("data").value;
    data = data.replace(/ /g, "");
    if(isInConfig(type.value, data)){
        document.getElementById("dataExistsError").style.display = "block";
    }else
    {
        var node = document.createTextNode(type.options[type.selectedIndex].innerText + " " + data);
        entry.appendChild(node);
        if(data === ''){
            document.getElementById("dataEmptyError").style.display = "block";
        }else{
            document.getElementById("dataEmptyError").style.display = "none";
            document.getElementById("dataExistsError").style.display = "none";
            var deleteButton = document.createElement("button");
            deleteButton.className = "delete";
            deleteButton.innerText = "Delete"; 
            entry.appendChild(deleteButton);
            document.getElementById("list").appendChild(entry);
            addConfigEntry(type.value, data);
        }
    }
}

function restoreConfig(){
    return;
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
document.querySelector("#add").addEventListener("click", addEntry);
