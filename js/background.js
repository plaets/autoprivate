"use strict";

function navigationListener(object) {
    browser.tabs.get(object.tabId).then((tabInfo) => {
        if(!tabInfo.incognito && object.parentFrameId == -1) {
            browser.tabs.remove(object.tabId);
            browser.windows.getAll({windowTypes:['normal']}).then((windows) => {
                for(let w in windows) {
                    if(windows[w].incognito) { 
                        browser.tabs.create({url: object.url, windowId: windows[w].id});
                        return;
                    } 
                }
                browser.windows.create({url: object.url, incognito: true}).then({}, console.log);
            });
        }
    }, console.log); //great job!
}

function filtersListToUrlFilter(filters) {
    return filters.map((f, i) => {
        let e = {};
        e[f.type] = filters[i].data;
        return e;
    });
}

function updateStorage(changes, areaName) {
    if(browser.webNavigation.onBeforeNavigate.hasListener(navigationListener)) {
        browser.webNavigation.onBeforeNavigate.removeListener(navigationListener);
    }

    browser.storage.local.get("filters").then((config) => {
        browser.webNavigation.onBeforeNavigate.addListener(navigationListener, {url: filtersListToUrlFilter(config.filters)}); 
        //dont ask why config.filters. update: actually why?
    },console.log);
}

browser.storage.onChanged.addListener(updateStorage);
updateStorage();
