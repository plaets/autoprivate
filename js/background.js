console.log("loaded");

function navigationListener(object)
{
    console.log("event: " + object.url);
}


var filter = {url:[{hostContains: "google.com"}]};
browser.webNavigation.onBeforeNavigate.addListener(navigationListener, filter);
