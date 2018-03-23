//TODO config
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

var filter = {hostContains: "twitter"};
browser.webNavigation.onBeforeNavigate.addListener(navigationListener, {url:[filter]});
