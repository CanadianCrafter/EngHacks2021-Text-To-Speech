document.addEventListener('DOMContentLoaded', function() {
    var toggle = document.getElementById("toggle");
    var bgpage = chrome.extension.getBackgroundPage();

    toggle.checked = bgpage.getToggleStatus();

    toggle.addEventListener('change', function() {
        if (this.checked) {
            console.log("toggle on");
            bgpage.setToggleStatus(true);
        } else {
            console.log("toggle off");
            bgpage.setToggleStatus(false);
        }
    });
});