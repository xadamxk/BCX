var debug = false;
var enableOnlineSorting = false;
getIndexSettings();

// Set vars equal to saved settings
function getIndexSettings(){
    chrome.storage.sync.get("Index", function (data) {
        if (!chrome.runtime.error){
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        switch (key) {
                            case "GeneralOnlineSortingEnable": if (value) { enableOnlineSorting = value }
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
        console.log("OnlineSorting: " + enableOnlineSorting);
    }
}
function makeChanges() {
    //
    if (enableOnlineSorting) {
        onlineSorting();
    }
}

function onlineSorting() {
    // Get list of ranks (Admin,SiteAdmin,etc)
    var rankList = [];
    $("#board_statistics > ul:eq(1) > li > a").each(function (i) {
        rankList[i] = $(this);
        // Loop through members
        
    });

    // Get array of objects of online user ranks
    // index(rank, array of users in that rank)
    var rankArray = [];
    for (i = 0; i < rankList.length; i++) {
        var tempArray = [];
        $("#board_statistics > p:eq(1) > span").each(function (j) {
            var currentMember = $(this);
            // Get deepest child (if special)
            if ($(this).find("a > span > span").length > 0) {
                currentMember = $(this).find("a > span > span");
            }

            // Special ranks (matching colors)
            if ($(rankList[i]).find("span").css("color") == currentMember.css("color")) {
                tempArray.push($(this));
            }
        });
        // Special object (rank, list of that rank)
        var tempObj = [rankList[i], tempArray];
        // Add special object to rank array
        rankArray.push(tempObj);
    }

    // Generate group output 
    var userList = $("#board_statistics > p:eq(1)");
    var rankLabelCounter = 0;
    
    for (i = 0; i < rankArray.length; i++) {
        // Only append group label if online
        if (rankArray[i][1].length > 0) {
            if (rankLabelCounter > 0) {
                userList.before($("<br>"));
                userList.before($("<br>"));
            }
            userList.before($("<u>").append(rankArray[i][0]).append(" (" + rankArray[i][1].length+")"));
            userList.before($("<br>"));
            rankLabelCounter++;
        }
        // Only append group members if online
        for (j = 0; j < rankArray[i][1].length; j++) {
            if (rankArray[i][1][j].length > 0) {
                userList.before(rankArray[i][1][j]);
                userList.before(" ");
            }
        }
    }

    // Append members label + counter - ex Admin (1)
    var normalMembers = $("#board_statistics > p:eq(1) > span");
    if (normalMembers.length > 0) {
        userList.before($("<br>"));
        userList.before($("<br>"));
        userList.before($("<u>")
            .append($("<a>").attr("href", "https://www.bleepingcomputer.com/forums/index.php?app=members&module=list")
                .append($("<b>").text("Members"))
            .append(" (" + normalMembers.length + ")")));
        userList.before($("<br>"));
    }

    // Offline ranked list - ranks that have no one online
    var offlineRankList = [];
    $("#board_statistics > ul:eq(1) > li > a").each(function (i) {
        offlineRankList[i] = $(this);
    });

    // Append offline ranked list - rank labels that have no one online
    for (i = offlineRankList.length-1; i >= 0; i--) {
        //userList.after(", ");
        userList.after($("<br>"));
        userList.after(offlineRankList[i]);
    }

    // Append offline ranked label - ex Admin
    userList.after($("<br>"));
    userList.after($("<u>")
            .append($("<b>").text("Offline")));
    userList.after($("<br>"));

    // Remove rank list (should now just be '|')
    $("#board_statistics > ul:eq(1)").remove();
}