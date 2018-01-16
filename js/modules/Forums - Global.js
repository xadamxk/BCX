var debug = false;
var enableHideBanner = false;
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
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })

            });
            debugTest();
            makeChanges()
        }
    });
}
function debugTest() {
    if (debug == true) {
        console.log("HideBanner: " + enableHideBanner);
    }
}
function makeChanges() {
    //
    if (enableHideBanner) {
        hideBanner();
    }
}

function hideBanner() {
    //
    $("#content").find(".message.unspecific.talert").remove();
}