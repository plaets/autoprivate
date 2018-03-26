//TODO config
//TODO fix a bug where plugins are opened in another private tab
function navigationListener(object){
    browser.tabs.get(object.tabId).then(function(tabInfo){
            if(!tabInfo.incognito && object.parentFrameId == -1){
                browser.tabs.remove(object.tabId);
                browser.windows.getAll({windowTypes:['normal']}).then(function(windows){
                    for(w in windows)
                        if(windows[w].incognito){ 
                            browser.tabs.create({url: object.url, windowId: windows[w].id});
                            return;
                        }
                    browser.windows.create({url: object.url, incognito: true}).then({}, console.log);
            });
        }
    }, console.log); //great job!
}

function filtersListToUrlFilter(filters){
    urlFilters = [];
    for(f in filters){
        var e = {};
        e[filters[f].type] = filters[f].data;
        urlFilters.push(e);
    }
    return urlFilters;
}

function updateStorage(changes, areaName){
    if(browser.webNavigation.onBeforeNavigate.hasListener(navigationListener))
        browser.webNavigation.onBeforeNavigate.removeListener(navigationListener);
    browser.storage.local.get("filters").then(function(config){
        browser.webNavigation.onBeforeNavigate.addListener(navigationListener, {url: filtersListToUrlFilter(config.filters)}); //dont ask why config.filters 
    },console.log);
}

browser.storage.onChanged.addListener(updateStorage);
updateStorage();
