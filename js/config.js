//TODO: show error on config.filters page
//hostContains
//hostsuffix
//pathcontains
//regular expression
//port
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
    var index = entry.target.id.replace(/delete/g,"");
    delete config.filters[index];
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
    deleteButton.id = "delete".concat(entryId);
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", deleteTableEntry);
}

function addButtonListener(){
    var dataValue = document.getElementById("data").value;
    var typeValue = document.getElementById("type").value;
    if(isInConfig(typeValue, dataValue)){
        document.getElementById("dataExistsError").style.display = "block";
    }else if(dataValue === ''){
        document.getElementById("dataEmptyError").style.display = "block";
    }else
    {
        document.getElementById("dataEmptyError").style.display = "none";
        document.getElementById("dataExistsError").style.display = "none";
        addTableEntry(typeValue, dataValue, "filters-table", config.filters.length);
        config.filters.push({type: t, data: d});
    }
}

function refreshList(config)
{
    var list = document.getElementById("filters-list");
    while(list.firstChild)
        list.removeChild(list.firstChild);
    for(filter in config.filters)
        addListEntry(config.filters[filter].type, config.filters[filter].data, "filters-list", filter);
}

function restoreConfig(){
    function restore(result){
        config = result;
        config.filters = config.filters.filter(function (e){return e != undefined});
        refreshList(config);
    }
    browser.storage.local.get("filters").then(restore, console.log); //console.log on error
}

function resetConfig(){
    config = defaultConfig;
    refreshList(config);
}

function saveConfig(query){
    query.preventDefault();
    config.filters = config.filters.filter(function (e){return e != undefined});
    refreshList(config);
    browser.storage.local.set(config);
}

document.addEventListener("DOMContentLoaded", restoreConfig);
document.querySelector("#add").addEventListener("click", addButtonListener);
document.querySelector("#submit").addEventListener("click", saveConfig);
document.querySelector("#reset").addEventListener("click", resetConfig);
//i hate this file so much
