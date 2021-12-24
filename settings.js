document.addEventListener('DOMContentLoaded', function() {
    var bgpage = chrome.extension.getBackgroundPage();

    //set already selected from current
    var ttsLangSelected = bgpage.getTTSLang();
    Array.from(document.querySelector("#ttsLang").options).forEach(function(option_element) {
        var val = option_element.value;

        if (val == ttsLangSelected) {
            option_element.selected = true;
        }
    });

    var ttsSpeedSelected = bgpage.getTTSSpeed();
    Array.from(document.querySelector("#ttsSpeed").options).forEach(function(option_element) {
        var val = option_element.value;

        if (val == ttsSpeedSelected) {
            option_element.selected = true;
        }
    });

    var saved = false;

    //save button
    document.getElementById("save").addEventListener("click", function () {
        if (!saved) {
            //update language
            ttsLang = document.getElementById("ttsLang").value;
            if (ttsLang == "browser") {
                ttsLang = navigator.language; //browser language
            }
            bgpage.setTTSLang(ttsLang);
        
            //update speed
            ttsSpeed = document.getElementById("ttsSpeed").value;
            bgpage.setTTSSpeed(parseFloat(ttsSpeed, 10));
            
            //update button
            alert("translation lang set to " + bgpage.getTTSLang() + ", tts speed set to " + bgpage.getTTSSpeed());

            var saveButton = document.getElementById("save");
            saveButton.className = "savedButton";
            saveButton.innerHTML = "Saved!";
            saved = true;
        }
    });

    document.getElementById("ttsLang").addEventListener("click", function () {
        //reset save button
        var saveButton = document.getElementById("save");
        saveButton.className = "button";
        saveButton.innerHTML = "Save";
        saved = false;
    });

    document.getElementById("ttsSpeed").addEventListener("click", function () {
        //reset save button
        var saveButton = document.getElementById("save");
        saveButton.className = "button";
        saveButton.innerHTML = "Save";
        saved = false;
    });
});

