var debug = false;
var enableHideBanner = false;
var enableHideLocation = false;
getGlobalSettings();

// Set vars equal to saved settings
function getGlobalSettings() {
    chrome.storage.sync.get("Global", function (data) {
        if (!chrome.runtime.error){
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        switch (key) {
                            case "GlobalHideBannerEnable": if (value) { enableHideBanner = value }
                                break;
                            case "GlobalHideLocationEnable": if (value) { enableHideLocation = value }
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })

            });
            debugGlobalTest();
            makeGlobalChanges();
        }
    });
}
function debugGlobalTest() {
    if (debug == true) {
        console.log("HideBanner: " + enableHideBanner);
    }
}
function makeGlobalChanges() {
    //
    if (enableHideBanner) {
        hideBanner();
    }
    //
    if (enableHideLocation) {
        hideLocation();
    }
}

function hideBanner() {
    // Remove banner if exists
    if ($("#content").find(".message.unspecific.talert").length > 0) {
        $("#content").find(".message.unspecific.talert").remove();
    }
}

function hideLocation() {
    // If url contains www, mask location
    if (document.URL.indexOf("www.") != -1) {
        $.get("https://www.bleepingcomputer.com", function () { });
    } else {
        $.get("https://bleepingcomputer.com", function () { });
    }
}