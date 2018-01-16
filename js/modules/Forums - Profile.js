var debug = false;
var enableActivityLabel = false;
getProfileSettings();

// Set vars equal to saved settings
function getProfileSettings() {
    chrome.storage.sync.get("Profile", function (data) {
        if (!chrome.runtime.error){
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        switch (key) {
                            case "ProfileActivityLabelEnable": if (value) { enableActivityLabel = value }
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })

            });
            debugProfileTest();
            makeProfileChanges();
        }
    });
}
function debugProfileTest() {
    if (debug == true) {
        console.log("ActivityLabel: " + enableActivityLabel);
    }
}
function makeProfileChanges() {
    //
    if (enableActivityLabel) {
        activityLabel();
    }
}

function activityLabel() {
    // If user is online
    if ($("#user_info_cell").find(".ipsBadge.ipsBadge_green").length > 0) {
        var status = $("#user_info_cell").find(".ipsBadge.ipsBadge_green").attr("data-tooltip")
        $("#user_info_cell").find(".ipsBadge.ipsBadge_green").text(status);
    }
}