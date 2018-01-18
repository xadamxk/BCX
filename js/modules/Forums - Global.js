var debug = false;
var enableHideBanner = false;
var enableHideLocation = false;
var enableEasyCite = false;
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
                            case "GlobalEasyCiteEnable": if (value) { enableEasyCite = value }
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
        console.log("HideLocation: " + enableHideLocation);
        console.log("EasyCite: " + enableEasyCite);
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
    //
    if (enableEasyCite) {
        easyCite();
    }
}

function easyCite() {
    //
    // Default
    var citationLink = location.href;
    if ($("#secondary_navigation ol .nav_sep:last").length > 0) {
        var citationDescription = $("#secondary_navigation ol .nav_sep:last").next();
        var citationText = citationDescription;
        // Append Cite Button
        $(citationDescription).after($("<a>").text("Cite").addClass("ipsButton_secondary").css({ "cursor": "pointer", "margin-left": "5px" }).attr("id", "citeButton"));
    }
    // Profile 
    if (location.href.includes("/forums/u/")) {
        //citationDescripion = $("#secondary_navigation ol li:eq(1) span:eq(1):contains('Viewing Profile: ')").text() + "'s " + "Profile";
        citationDescription = $("#secondary_navigation ol .nav_sep:last").next().text() + "'s " + "Profile";
        if (citationDescription.includes('Viewing Profile')) {
            citationDescription = citationDescription.replace('Viewing Profile: ', '');
        }
        citationText = citationDescription;
    }
    // Sections
    else if (location.href.includes("/forums/f/")) {
        citationDescription = $("#secondary_navigation ol .nav_sep:last").next().text() + " Section";
        citationText = citationDescription;
    }
    // Threads (Topics)
    else if (location.href.includes("/forums/t/")) {
        citationDescription = $(".ipsType_pagetitle").text();
        citationText = citationDescription;
        // Thread - not first post
        if (location.href.includes("/?p=")) {
            citationLink = location.href.substring(0, location.href.indexOf("/?p="));
        }
        // Thread - not first page
        if (location.href.includes("/page-")) {
            citationLink = location.href.substring(0, location.href.indexOf("/page-"));
        }
        // Posts - each post on page
        $(".post_block").each(function (index, element) {
            $(element).find(".multiquote").after($("<li>")
                .append($("<a>")
                .attr({ "title": "Cite Post", "id": "citeButton" + index, "href": "javascript:void(0);" })
                .text("Cite")
                .css({ "cursor": "pointer", "margin-right": "5px" })
                .addClass("ipsButton_secondary")));

            // temp vars
            var tempcitationDescription;
            var tempcitationLink;
            var tempcitationText;
            var postBody = $(this);
            // onClick for cite buttons
            $("body").on("click", "#citeButton" + index, function (e) {
                e.preventDefault();
                // If first post
                if ($(".post_id:eq("+index+")").text().includes("#1")) {
                    tempcitationLink = citationLink;
                    //console.log(tempcitationLink);
                    tempcitationDescription = $(postBody).find("div h3").text().replace(/\s/g, '');
                    // If string contains #(post num), then remove 
                    var tempPostStr = $(".post_id:eq(" + index + ")").text().replace(/\s/g, '');
                    if (tempcitationDescription.includes(tempPostStr)) {
                        tempcitationDescription = tempcitationDescription.replace(tempPostStr, '');
                    }
                    tempcitationText = citationDescription + "[/url][/b] by [b][url=" + $(".author:eq(" + index + ")" + " a").attr("href") + "]"
                        + tempcitationDescription.replace(tempPostStr, '');

                    // Update description for popup label
                    tempcitationDescription = citationDescription + " by " + tempcitationDescription;
                }
                    // Every other post
                else if ($(".post_id:eq(" + index + ")").text().includes("#")) {
                    var postIDStr = $(".post_id:eq(" + index + ") a").attr("href");
                    var postID = postIDStr.substring(postIDStr.indexOf("#entry") + 6);
                    tempcitationLink = citationLink + "?p=" + postID;
                    tempcitationDescription = $(postBody).find("div h3").text().replace(/\s/g, '') + "'s Post";
                    // If string contains #(post num), then remove 
                    var tempPostStr = $(".post_id:eq(" + index + ")").text().replace(/\s/g, '');
                    if (tempcitationDescription.includes(tempPostStr)) {
                        tempcitationDescription = tempcitationDescription.replace(tempPostStr, '');
                    }
                    tempcitationText = tempcitationDescription;
                }
                prompt("Citation: " + tempcitationDescription, "[b][url=" + tempcitationLink + "]" + tempcitationText + "[/url][/b]");
            }); // end of posts loop
        });
    }
    // Rules (https://www.bleepingcomputer.com/forum-rules/)
    else if (location.href.includes("/forum-rules/")) {
        //
         var activeBreadcrumb = $(".cz-breadcrumb").find(".active");
         citationDescription = activeBreadcrumb.text();
         $(activeBreadcrumb).after($("<a>")
            .text("Cite")
            .addClass("bc_sub_btn")
            .css({ "cursor": "pointer", "margin-left": "5px" })
            .attr("id", "citeButton"));
        citationText = citationDescription;
    }
    // Downloads
    else if (location.href.includes("/download/")) {
        //
        var activeBreadcrumb = $(".cz-breadcrumb").find(".active");
        citationDescription = activeBreadcrumb.text() + "Download";
        $(activeBreadcrumb).after($("<a>")
           .text("Cite")
           .css({
               "cursor": "pointer",
               "margin-left": "5px",
               "background": "#69bd32",
               "font-size": "14px",
               "font-weight": "bold",
               "color": "#ffffff",
               "border-radius": "2px",
               "padding": "7px 16px 9px 15px",
               "border": "none",
               "box-shadow": "none",
               "line-height": "18px",
           })
           .attr("id", "citeButton"));
        citationText = citationDescription;
    }
        // Virus Removal
    else if (location.href.includes("/virus-removal/")) {
        //
        var activeBreadcrumb = $(".cz-breadcrumb").find(".active");
        citationDescription = activeBreadcrumb.text() + " Guide";
        $(activeBreadcrumb).after($("<a>")
           .text("Cite")
           .css({
               "cursor": "pointer",
               "margin-left": "5px",
               "background": "#69bd32",
               "font-size": "14px",
               "font-weight": "bold",
               "color": "#ffffff",
               "border-radius": "2px",
               "padding": "7px 16px 9px 15px",
               "border": "none",
               "box-shadow": "none",
               "line-height": "18px",
           })
           .attr("id", "citeButton"));
        citationText = citationDescription;
    }
        // Tutorials
    else if (location.href.includes("/tutorials/")) {
        //
        var activeBreadcrumb = $(".cz-breadcrumb").find(".active");
        citationDescription = activeBreadcrumb.text() + " Tutorial";
        $(activeBreadcrumb).after($("<a>")
           .text("Cite")
           .css({
               "cursor": "pointer",
               "margin-left": "5px",
               "background": "#69bd32",
               "font-size": "14px",
               "font-weight": "bold",
               "color": "#ffffff",
               "border-radius": "2px",
               "padding": "7px 16px 9px 15px",
               "border": "none",
               "box-shadow": "none",
               "line-height": "18px",
           })
           .attr("id", "citeButton"));
        citationText = citationDescription;
    }
        // Glossary
    else if (location.href.includes("/glossary/")) {
        //
        var activeBreadcrumb = $(".cz-breadcrumb").find(".active");
        citationDescription = activeBreadcrumb.text();
        $(activeBreadcrumb).after($("<a>")
           .text("Cite")
           .css({
               "cursor": "pointer",
               "margin-left": "5px",
               "background": "#69bd32",
               "font-size": "14px",
               "font-weight": "bold",
               "color": "#ffffff",
               "border-radius": "2px",
               "padding": "7px 16px 9px 15px",
               "border": "none",
               "box-shadow": "none",
               "line-height": "18px",
           })
           .attr("id", "citeButton"));
        citationText = citationDescription;
    }
        // Search Page
    else if (location.href.includes("/search.php") && !location.href.includes("?action=results")) {
        
    }
    $("#citeButton").click(function (event) {
        var target = $(event.target);
        if (target.is("a")) {
            prompt("Citation: " + citationDescription, "[url=" + citationLink + "][b]" + citationText + "[/b][/url]");
        }
    });
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