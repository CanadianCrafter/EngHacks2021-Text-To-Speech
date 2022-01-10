document.addEventListener('DOMContentLoaded', function() {
    var bgpage = chrome.extension.getBackgroundPage();

    //set up page
    updateOptionMenus(bgpage.getDialect("ar"),
                      bgpage.getDialect("en"),
                      bgpage.getDialect("zh"),
                      bgpage.getDialect("pt"),
                      bgpage.getDialect("es"), 
                      "browser", 
                      bgpage.getTTSSpeed(),
                      bgpage.getSlowOnEven());
    updateResetButton();

    var saved = false;

    //save button
    document.getElementById("save").addEventListener("click", function () {
        if (!saved) {
            //update dialects
            bgpage.setDialect("ar", document.getElementById("arabicDialect").value);
            bgpage.setDialect("en", document.getElementById("englishDialect").value);
            bgpage.setDialect("zh", document.getElementById("chineseDialect").value);
            bgpage.setDialect("pt", document.getElementById("portugueseDialect").value);
            bgpage.setDialect("es", document.getElementById("spanishDialect").value);
            
            //update language
            ttsLang = document.getElementById("ttsLang").value;
            if (ttsLang == "browser") {
                ttsLang = navigator.language; //browser language
            }
            bgpage.setTTSLang(ttsLang);
        
            //update speed
            ttsSpeed = document.getElementById("ttsSpeed").value;
            bgpage.setTTSSpeed(parseFloat(ttsSpeed, 10));

            bgpage.setSlowOnEven(document.getElementById("slowOnEven").checked);
            
            //update button
            console.log("translation lang set to " + bgpage.getTTSLang() + ", tts speed set to " + bgpage.getTTSSpeed());
            //alert("Translation language set to " + bgpage.getTTSLang() + ", speech speed set to " + bgpage.getTTSSpeed() + "x");

            saveToSavedButton();
        }
    });

    //reset button
    document.getElementById("reset").addEventListener("click", function () {
        if(!isReset()){
            /*
            //reset to default dialects
            bgpage.setDialect("ar", "ar-EG");
            bgpage.setDialect("en", "en-US");
            bgpage.setDialect("zh", "zh-CN");
            bgpage.setDialect("pt", "pt-PT");
            bgpage.setDialect("es", "es-MX");
            
            //Reset to browser language
            bgpage.setTTSLang(navigator.language);
        
            //Reset to 1x speed
            bgpage.setTTSSpeed(parseFloat(1, 10));
            
            //update button
            console.log("translation lang reset to " + bgpage.getTTSLang() + ", tts speed reset to " + bgpage.getTTSSpeed());
            //alert("Translation language reset to " + bgpage.getTTSLang() + ", speech speed reset to " + bgpage.getTTSSpeed() + "x");
            */

            var resetButton = document.getElementById("reset");
            resetButton.className = "resettedButton";
            resetButton.innerHTML = "Resetted!";

            //Reset option menu
            updateOptionMenus("ar-EG", "en-US", "zh-CN", "pt-PT", "es-MX", "browser", 1, true);
            resetSaveButton();
        }
        
    });

    //dialect changed
    document.getElementById("arabicDialect").addEventListener("change", function () {
        resetSaveButton();
        updateResetButton();
    });

    document.getElementById("englishDialect").addEventListener("change", function () {
        resetSaveButton();
        updateResetButton();
    });

    document.getElementById("chineseDialect").addEventListener("change", function () {
        resetSaveButton();
        updateResetButton();
    });

    document.getElementById("portugueseDialect").addEventListener("change", function () {
        resetSaveButton();
        updateResetButton();
    });

    document.getElementById("spanishDialect").addEventListener("change", function () {
        resetSaveButton();
        updateResetButton();
    });

    //When the language option menu is changed
    document.getElementById("ttsLang").addEventListener("change", function () {
        resetSaveButton();
        updateResetButton();
    });

    //when the speed option menu is changed
    document.getElementById("ttsSpeed").addEventListener("change", function () {
        resetSaveButton();
        updateResetButton();
    });

    document.getElementById("slowOnEven").addEventListener("change", function () {
        resetSaveButton();
        updateResetButton();
    });

    //reset save button
    function resetSaveButton() {
        var saveButton = document.getElementById("save");
        saveButton.className = "saveButton";
        saveButton.innerHTML = "Save";
        saved = false;
    }

    //change save button into saved button
    function saveToSavedButton() {
        var saveButton = document.getElementById("save");
        saveButton.className = "savedButton";
        saveButton.innerHTML = "Saved!";
        saved = true;
    }

    //returns true if the user is on default settings and false otherwise
    function isReset() {
        var ret = true;

        Array.from(document.querySelector("#arabicDialect").options).forEach(function(option_element) {
            if (option_element.selected && option_element.value != "ar-EG") {
                ret = false;
            }
        });

        Array.from(document.querySelector("#englishDialect").options).forEach(function(option_element) {
            if (option_element.selected && option_element.value != "en-US") {
                ret = false;
            }
        });

        Array.from(document.querySelector("#chineseDialect").options).forEach(function(option_element) {
            if (option_element.selected && option_element.value != "zh-CN") {
                ret = false;
            }
        });

        Array.from(document.querySelector("#portugueseDialect").options).forEach(function(option_element) {
            if (option_element.selected && option_element.value != "pt-PT") {
                ret = false;
            }
        });

        Array.from(document.querySelector("#spanishDialect").options).forEach(function(option_element) {
            if (option_element.selected && option_element.value != "es-MX") {
                ret = false;
            }
        });
        
        Array.from(document.querySelector("#ttsLang").options).forEach(function(option_element) {
            if (option_element.selected && option_element.value != "browser") {
                ret = false;
            }
        });
    
        Array.from(document.querySelector("#ttsSpeed").options).forEach(function(option_element) {
            if (option_element.selected && option_element.value != "1") {
                ret = false;
            }
        });

        if (!document.getElementById("slowOnEven").checked) {
            ret = false;
        }

        return ret;
    }   

    //update the reset button to resetted and vice versa
    function updateResetButton() {
        if (isReset()) {
            var resetButton = document.getElementById("reset");
            resetButton.className = "resettedButton";
            resetButton.innerHTML = "Already on Default Settings";
        } else {
            var resetButton = document.getElementById("reset");
            resetButton.className = "resetButton";
            resetButton.innerHTML = "Reset";
        }
    }
    
    //update the option menus
    function updateOptionMenus(arabicDialect, englishDialect, chineseDialect, portugueseDialect, spanishDialect, lang, speed, slowOnEven) {
        Array.from(document.querySelector("#arabicDialect").options).forEach(function(option_element) {
            var val = option_element.value;
    
            if (val == arabicDialect) {
                option_element.selected = true;
            }
        });

        Array.from(document.querySelector("#englishDialect").options).forEach(function(option_element) {
            var val = option_element.value;
    
            if (val == englishDialect) {
                option_element.selected = true;
            }
        });

        Array.from(document.querySelector("#chineseDialect").options).forEach(function(option_element) {
            var val = option_element.value;
    
            if (val == chineseDialect) {
                option_element.selected = true;
            }
        });

        Array.from(document.querySelector("#portugueseDialect").options).forEach(function(option_element) {
            var val = option_element.value;
    
            if (val == portugueseDialect) {
                option_element.selected = true;
            }
        });

        Array.from(document.querySelector("#spanishDialect").options).forEach(function(option_element) {
            var val = option_element.value;
    
            if (val == spanishDialect) {
                option_element.selected = true;
            }
        });
        
        Array.from(document.querySelector("#ttsLang").options).forEach(function(option_element) {
            var val = option_element.value;
    
            if (val == lang) {
                option_element.selected = true;
            }
        });
    
        Array.from(document.querySelector("#ttsSpeed").options).forEach(function(option_element) {
            var val = option_element.value;
    
            if (val == speed) {
                option_element.selected = true;
            }
        });

        document.getElementById("slowOnEven").checked = slowOnEven;
    }
});

