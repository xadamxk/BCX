console.log("BCX: HELLO WORLD");
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        console.log("This is a first install!");
        chrome.runtime.openOptionsPage();
    } else if (details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
        var newURL = "";
        //chrome.tabs.create({ url: newURL });
    }
});