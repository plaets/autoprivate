//TODO config
//TODO fix a bug where plugins are opened in another private tab
function navigationListener(object){
    browser.tabs.get(object.tabId).then(function(tabInfo){
            if(!tabInfo.incognito){
                browser.tabs.remove(object.tabId);
                browser.windows.getAll({windowTypes:['normal']}).then(function(windows){
                    for(w in windows)
                        if(windows[w].incognito){
                            browser.tabs.create({url: object.url, windowId: windows[w].id});
                            return;
                        }
                    browser.windows.create({url: object.url, incognito: true}).then((window)=>{console.log("created incognito window with id " + window.id)}, console.log);
            });
        }
    }, console.log); //great job!
}

function updateStorage(changes, areaName)
{
    if(browser.webNavigation.onBeforeNavigate.hasListener(navigationListener))
        browser.webNavigation.onBeforeNavigate.removeListener(navigationListener);
    
    browser.storage.local.get("matches").then(function(item){
    var filter = [];
    if(item.matches)
        filter.push({hostContains: item.matches});
    browser.webNavigation.onBeforeNavigate.addListener(navigationListener, {url:filter});
    },console.log);
}

browser.storage.onChanged.addListener(updateStorage);
updateStorage();
