document.addEventListener('DOMContentLoaded', function() {
    var bgpage = chrome.extension.getBackgroundPage();

    //set up page
    var ttsLangSelected = bgpage.getTTSLang();
    var ttsSpeedSelected = bgpage.getTTSSpeed();
    updateOptionMenus(ttsLangSelected,ttsSpeedSelected);
    updateResetButton();

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
            console.log("translation lang set to " + bgpage.getTTSLang() + ", tts speed set to " + bgpage.getTTSSpeed());
            alert("Translation language set to " + bgpage.getTTSLang() + ", speech speed set to " + bgpage.getTTSSpeed() + "x");

            saveToSavedButton();
            updateResetButton();
        }
    });

    //reset button
    document.getElementById("reset").addEventListener("click", function () {
        if(!isReset()){
            //Reset to browser language
            bgpage.setTTSLang(navigator.language);
        
            //Reset to 1x speed
            bgpage.setTTSSpeed(parseFloat(1, 10));
            
            //update button
            console.log("translation lang reset to " + bgpage.getTTSLang() + ", tts speed reset to " + bgpage.getTTSSpeed());
            alert("Translation language reset to " + bgpage.getTTSLang() + ", speech speed reset to " + bgpage.getTTSSpeed() + "x");
        
            var resetButton = document.getElementById("reset");
            resetButton.className = "resettedButton";
            resetButton.innerHTML = "Resetted!";

            //Reset option menu
            updateOptionMenus(navigator.language,1);
        }
        
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
        return (bgpage.getTTSLang()==navigator.language) && (bgpage.getTTSSpeed()==1);
    }   

    //update the reset button to resetted and vice versa
    function updateResetButton() {
        if(isReset()){
            var resetButton = document.getElementById("reset");
            resetButton.className = "resettedButton";
            resetButton.innerHTML = "Already on Default Settings";
        }
        else{
            var resetButton = document.getElementById("reset");
            resetButton.className = "resetButton";
            resetButton.innerHTML = "Reset";
        }
    }
    
    //update the option menus
    function updateOptionMenus(lang, speed) {
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
    }


});

