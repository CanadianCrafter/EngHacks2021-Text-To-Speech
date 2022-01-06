document.addEventListener('DOMContentLoaded', function() {
    var translateToggle = document.getElementById("translateToggle");
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

    document.getElementById("settings").addEventListener("click", function() {
        window.open("settings.html");
    });
});