//TODO permissions
function navigationListener(object)
{
    browser.tabs.get(object.tabId).then(function(tabInfo){
            if(!tabInfo.incognito)
            {
                browser.tabs.remove(object.tabId);
                browser.windows.getAll({windowTypes:['normal']}).then(function(windows){
                    privateWindows = [];
                    for(w in windows)
                        if(windows[w].incognito)
                            privateWindows.push(windows[w]);
                    if(!privateWindows.length)
                        browser.windows.create({url: object.url, incognito: true}).then((window)=>{console.log("created incognito window with id " + window.id)}, console.log);
                    else
                        browser.tabs.create({url: object.url, windowId: privateWindows[0].id});
            });
        }
    }, console.log);
}

var filter = {hostContains: "twitter"};
browser.webNavigation.onBeforeNavigate.addListener(navigationListener, {url:[filter]});
