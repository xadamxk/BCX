var debug = false;
var enablePMFromPost = false;
getPMSettings();

// Set vars equal to saved settings
function getPMSettings() {
    chrome.storage.sync.get("PM", function (data) {
        if (!chrome.runtime.error){
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        switch (key) {
                            case "PMpmFromPostEnable": if (value) { enablePMFromPost = value }
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })

            });
            debugPMTest();
            makePMChanges();
        }
    });
}
function debugPMTest() {
    if (debug == true) {
        console.log("ActivityLabel: " + enableActivityLabel);
    }
}
function makePMChanges() {
    //
    if (enablePMFromPost) {
        pmFromPost();
    }
}

function pmFromPost() {
    var threadTitle = $(".ipsType_pagetitle").text();
    // Trim if necessary
    if (threadTitle.length > 50) {
        threadTitle = threadTitle.substring(0, 50);
    }
    // Loop each post
    $(".post_block").each(function (index, element) {
        $(element).find(".multiquote").after($("<li>")
            .append($("<a>")
            .attr({
                "title": "PM From Post", "href": "javascript:void(0);",
                "onclick": "javascript:document.getElementById('BCXPMFromPost" + index + "').style.display = " +
                    "(document.getElementById('BCXPMFromPost" + index + "').style.display == 'block') ? 'none' : 'block'",
                "class": "HFXPMFromPost"
            })
            .text("Quick PM")
            .css({ "cursor": "pointer", "margin-right": "1px" })
            .addClass("ipsButton_secondary")));
        //
        // HTML for PM Popup
        var formaction = '<div id="BCXPMFromPost' + index + '" class="BCXPMFromPostDiv" style="display:none;"><form action="private.php" ' +
            'method="post" name="input" target="_blank"><input type="hidden" name="action" value="do_send" />';
        var formpmid = '<input type="hidden" name="pmid" value="" />';
        var formdo = '<input type="hidden" name="do" value="" />';
        var formicon = '<input type="hidden" name="icon" value="" />';
        var formmy_post_key = '<input type="hidden" name="my_post_key" value="' + myPostKey + '" />';
        var formuid = '<input type="hidden" name="uid" value="' + usernameName + '" />';
        var formto = '<div align="center"><strong>Recipients: </strong><input type="text" class="textbox" name="to" id="to" ' +
            ' tabindex="3" value="' + usernameName + '" readonly />';
        var formsubject = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Subject: </strong><input type="text" class="textbox" ' +
            ' name="subject" size="40" maxlength="85" tabindex="3" value="Regarding Your Post: ' + threadTitle + '"/><br />';
        var formsend = '<input type="submit" class="button" name="submit" value="Send Message" tabindex="9" accesskey="s" />' +
            '<input type="submit" class="button" name="saveasdraft" value="Save as Draft" tabindex="10" />' +
            '<input type="submit" class="button" name="preview" value="Preview" tabindex="11" />';
        var formmessage = '<textarea name="message" rows="7" cols="90" tabindex="3" style="resize:vertical">' +
            '[size=x-small]Sent from [url=https://www.hackforums.net/' + postLink + ']your post[/url]. [/size]' +
             pmFromPostQuoteText +
            '</textarea></div><br />';
        var formchecks = '<div align="center"><input type="checkbox" class="checkbox" name="options[signature]" value="1" tabindex="5" checked="checked" />' +
            'Signature - <input type="checkbox" class="checkbox" name="options[savecopy]" value="1" tabindex="7" checked="checked" />' +
            'Save a Copy - <input type="checkbox" class="checkbox" name="options[readreceipt]" value="1" tabindex="8" checked="checked" />Request Read Receipt</div><br />';
        var formsend = '<div align="center"><input type="submit" class="button PMFromPostButton sendQuickPM" name="submit" value="Send Message" tabindex="9" accesskey="s" />' +
            '<input type="submit" class="button PMFromPostButton" name="saveasdraft" value="Save as Draft" tabindex="10" />' +
            '<input type="submit" class="button PMFromPostButton" name="preview" value="Preview" tabindex="11" /></div><br />';
        var spacing = '<br />';
        var finalform = formaction + formpmid + formdo + formicon + formmy_post_key + formuid +
            spacing + formto + formsubject + spacing +
            formmessage + formchecks + formsend + '</form></div>';
        // CSS to highlight message popup
        $(".HFXPMFromPostDiv").css({ "background-color": "#3f3e3e" }); // 737272
        // Append to new row
        $(this).append($("<div>").attr("id", "pmContainerRow" + index));
        $("#pmContainerRow" + index).append("<div>");
        $("#pmContainerRow" + index + " > div").append(finalform);
        // Event Listener on send
        $(".sendQuickPM").click(function () {
            $("#pmContainerRow" + index).hide();
        });
    });
}