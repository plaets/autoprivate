//TODO permissions
console.log("loaded");

function processTabInfo(object, tabInfo)
{
    if(!tabInfo.incognito)
    {
        var creating = browser.windows.create({url: object.url, incognito: true});
        browser.tabs.remove(object.tabId);
        creating.then((window)=>{console.log("created incognito window with id " + window.id)}, (error)=>{console.log(error)});
    }
}

function navigationListener(object)
{
    var tabsPromise = browser.tabs.get(object.tabId);
    tabsPromise.then(processTabInfo.bind(null, object), (error)=>{console.log(error)});
}

var filter = {hostContains: "twitter"};
browser.webNavigation.onBeforeNavigate.addListener(navigationListener, {url:[filter]});
