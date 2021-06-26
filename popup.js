import {setToggleStatus, getToggleStatus} from "./contextmenus.js";

window.onload = function () {
    var toggle = document.getElementById("toggle");
    toggle.checked = getToggleStatus();

    toggle.addEventListener('change', function() {
        if (this.checked) {
            console.log("toggle on");
            setToggleStatus(true);
        } else {
            console.log("toggle off");
            setToggleStatus(false);
        }
    });
}