const defaultConfig = {filters: []};
var config = defaultConfig;
var types = {urlContains: "Address contains",
                hostContains: "Host contains",
                hostSuffix: "Host suffix is",
                pathContains: "Path contains",
                port: "Port is",
                urlMatches: "Matches regular expression"};

function isInConfig(type, data){
    for(e in config.filters){
        if(config.filters[e] != undefined && config.filters[e].type == type && config.filters[e].data == data)
            return true;
    }
    return false;
}

function deleteTableEntry(entry){
    delete config.filters[entry.target.dataset.entryId];
    entry.target.parentNode.parentNode.parentNode.removeChild(entry.target.parentNode.parentNode); //great job!
}

function addTableEntry(typeValue, dataValue, tableId, entryId){
    var row = document.getElementById(tableId).insertRow(-1);
    var cells = {};
    cells["type"] = row.insertCell(-1);
    cells["data"] = row.insertCell(-1);
    cells["deleteButton"] = row.insertCell(-1);
    cells["type"].innerText = types[typeValue];
    cells["data"].innerText = dataValue;
    var deleteButton = cells["deleteButton"].appendChild(document.createElement("button"));
    deleteButton.className = "delete";
    deleteButton.dataset.entryId = entryId;
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", deleteTableEntry);
}

function entryValid(typeValue, dataValue){
    if(isInConfig(typeValue, dataValue)){
        document.getElementById("dataExistsError").style.display = "block";
        return false;
    }else if(dataValue === ''){
        document.getElementById("dataEmptyError").style.display = "block";
        return false;
    }else if(typeValue == "port" && (dataValue.match(/\D/) != null || dataValue >= 65535)){
        document.getElementById("badPortNumberError").style.display = "block";
        return false;
    }else if(typeValue == "urlMatches"){
        try{ //https://stackoverflow.com/a/17250859/9572217
            new RegExp(dataValue);
        }catch(e){
            document.getElementById("invalidRegexError").style.display = "block"; 
            return false;
        }
   }
   return true;
}

function resetErrors(){
    document.getElementById("dataEmptyError").style.display = "none";
    document.getElementById("invalidRegexError").style.display = "none";
    document.getElementById("badPortNumberError").style.display = "none";
    document.getElementById("dataExistsError").style.display = "none";
}

function addButtonListener(){
    var dataValue = document.getElementById("data").value;
    var typeValue = document.getElementById("type").value;
    if(entryValid(typeValue, dataValue)){
        addTableEntry(typeValue, dataValue, "filters-table", config.filters.length);
        config.filters.push({type: typeValue, data: dataValue});
        resetErrors();
    }
}

function refreshTable(config)
{
    var list = document.getElementById("filters-table");
    while(list.firstChild)
        list.removeChild(list.firstChild);
    for(filter in config.filters)
        addTableEntry(config.filters[filter].type, config.filters[filter].data, "filters-table", filter);
}

function restoreConfig(){
    function restore(result){
        config = result;
        if(config.filters == undefined){
            resetConfig();
            return;
        }
        config.filters = config.filters.filter(function (e){return e != undefined});
        refreshTable(config);
    }
    browser.storage.local.get("filters").then(restore, console.log); //console.log on error
}

function resetConfig(){
    config = JSON.parse(JSON.stringify(defaultConfig)); //Deep copying. Seems to fix a bug where reset button worked only once
    refreshTable(config);
}

function saveConfig(query){
    query.preventDefault();
    config.filters = config.filters.filter(function (e){return e != undefined});
    refreshTable(config);
    browser.storage.local.set(config);
}

function enterListener(event){
    if(event.key !== "Enter") return;
    document.querySelector("#add").click();
    event.preventDefault();
}

document.addEventListener("DOMContentLoaded", function(){
    restoreConfig();
    document.querySelector("#data").addEventListener("keyup", enterListener);
    document.querySelector("#reset").addEventListener("click", resetConfig);
    document.querySelector("#add").addEventListener("click", addButtonListener);
    document.querySelector("#save").addEventListener("click", saveConfig);
});
