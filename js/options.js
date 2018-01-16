/* To Add Toggle(s) to settings:
    0. Create group toggle in options.html
    1. Make event listener for toggle group class (doc.ready)
        - Remember to change saveFunc to save function created in #2
    2. Make Save function for new toggle group
    3. Make Load function for new toggle group
    4. Add new Load function to loadSettings()
    5. Make changes to manifest for new JS module
*/

$(document).ready(function () {
    // Load version string
    $("#BCXVersion").text(chrome.runtime.getManifest().version);
    // Load Default/Saved Settings
    loadSettings();
    
    $(".IndexSettings").change(function () {
        saveIndexSettings();
        console.log("Index Settings Changed!");
    });

    $(".nav li").click(function() {
        $("body").scrollTop(0);
    });
});

function loadSettings() {
    // Defaults
    loadDefaults();
    // Grab from memory
    loadIndexSettings();
}

function loadDefaults() {
    loadIndexDefault();
    
}

function loadIndexDefault() {
    // $("#RepChartsEnable").prop('checked', true);
    // $("#RepChartsLinksEnable").prop('checked', true);
}

function loadIndexSettings() {
    chrome.storage.sync.get("Index", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
            //console.log("1: " + $(this));
                $.each(data, function (key, value) {
                    //console.log("2: " + data);
                    switch (key) {
                        case "GeneralOnlineSortingEnable": $("#OnlineSortingEnable").prop('checked', value);
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })
            
        });
        saveIndexSettings();
    });
}

function saveIndexSettings() {
    chrome.storage.sync.set({
        Index: [{ 'GeneralOnlineSortingEnable': $("#OnlineSortingEnable").is(':checked') }]
    }, function () {
        // Save Confirmation
    });
}

function update(element) {
    // 'jscolor' instance can be used as a string
    $(element).css("background-color", "#" + $(element).val());
}