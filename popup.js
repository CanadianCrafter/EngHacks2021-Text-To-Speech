document.addEventListener('DOMContentLoaded', function() {
    var translateToggle = document.getElementById("translateToggle");
    var yueToggle = document.getElementById("yueToggle");
    var bgpage = chrome.extension.getBackgroundPage();

    translateToggle.checked = bgpage.getTranslateStatus();

    translateToggle.addEventListener('change', function() {
        if (this.checked) {
            console.log("toggle on translate");
            bgpage.setTranslateStatus(true);
        } else {
            console.log("toggle off translate");
            bgpage.setTranslateStatus(false);
        }
    });

    yueToggle.checked = bgpage.getYueStatus();

    yueToggle.addEventListener('change', function() {
        if (this.checked) {
            console.log("toggle on yue");
            bgpage.setYueStatus(true);
        } else {
            console.log("toggle off yue");
            bgpage.setYueStatus(false);
        }
    });
});