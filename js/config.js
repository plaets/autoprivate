"use strict";

const defaultConfig = {filters: []};
const types = {   
    hostSuffix: "Host suffix is (ex. .example.com)",
    urlContains: "URL contains",
    hostContains: "Host contains",
    urlMatches: "Matches regular expression",
};

let config = defaultConfig;

function isInConfig(type, data) {
    for(let e in config.filters) {
        if(config.filters[e] != undefined && config.filters[e].type == type && config.filters[e].data == data) {
            return true;
        }
    }
    return false;
}

function deleteTableEntry(entry) {
    config.filters.splice(entry.target.dataset.entryId, 1); 
    entry.target.parentNode.parentNode.parentNode.removeChild(entry.target.parentNode.parentNode); //great job!
    saveConfig();
}

function addTableEntry(typeValue, dataValue, tableId, entryId) {
    let row = document.getElementById(tableId).insertRow(-1);
    let cells = {};
    cells.type = row.insertCell(-1);
    cells.data = row.insertCell(-1);
    cells.deleteButton = row.insertCell(-1);
    cells.type.innerText = types[typeValue];
    cells.data.innerText = dataValue;
    let deleteButton = cells["deleteButton"].appendChild(document.createElement("button"));
    deleteButton.className = "delete";
    deleteButton.dataset.entryId = entryId;
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", deleteTableEntry);
}

function entryValid(typeValue, dataValue) {
    if(isInConfig(typeValue, dataValue)) {
        document.getElementById("dataExistsError").style.display = "block";
        return false;
    } else if(dataValue === '') {
        document.getElementById("dataEmptyError").style.display = "block";
        return false;
    } else if(typeValue == "urlMatches") {
        try { //https://stackoverflow.com/a/17250859/9572217
            new RegExp(dataValue);
        } catch(e) {
            document.getElementById("invalidRegexError").style.display = "block"; 
            return false;
        }
   }
   return true;
}

function resetErrors() {
    document.getElementById("dataEmptyError").style.display = "none";
    document.getElementById("invalidRegexError").style.display = "none";
    document.getElementById("badPortNumberError").style.display = "none";
    document.getElementById("dataExistsError").style.display = "none";
}

function addButtonListener() {
    let dataValue = document.getElementById("data").value;
    let typeValue = document.getElementById("type").value;
    if(entryValid(typeValue, dataValue)) {
        addTableEntry(typeValue, dataValue, "filters-table", config.filters.length);
        config.filters.push({type: typeValue, data: dataValue});
        resetErrors();
        saveConfig();
    }
}

function refreshTable(config)
{
    let list = document.getElementById("filters-table");
    while(list.firstChild) list.removeChild(list.firstChild);
    for(let filter in config.filters) 
        addTableEntry(config.filters[filter].type, config.filters[filter].data, "filters-table", filter);
}

function restoreConfig() {
    browser.storage.local.get("filters").then((result) => {
        config = result;
        if(config.filters == undefined) {
            resetConfig();
            return;
        }
        config.filters = config.filters.filter((e) => e != undefined);
        refreshTable(config);
    }, console.log);
}

function resetConfig() {
    config = Object.assign({}, defaultConfig); 
    config.filters = [];
    console.log(config);
    refreshTable(config);
    saveConfig();
}

function saveConfig() {
    config.filters = config.filters.filter((e) => e != undefined);
    refreshTable(config);
    browser.storage.local.set(config);
}

function enterListener(e) {
    if(e.key !== "Enter") return;
    document.querySelector("#add").click();
    e.preventDefault();
}

document.addEventListener("DOMContentLoaded", () => {
    restoreConfig();
    document.querySelector("#data").addEventListener("keyup", enterListener);
    document.querySelector("#reset").addEventListener("click", () => 
        confirm("Are you sure you want to reset the configuration?") ? resetConfig() : undefined);
    document.querySelector("#add").addEventListener("click", addButtonListener);
});
