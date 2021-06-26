var toggleStatus = true;

function setToggleStatus(status) {
    toggleStatus = status;
    alert("toggle set to " + toggleStatus);
}

function getToggleStatus() {
    return toggleStatus;
}

export {setToggleStatus, getToggleStatus};

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "title": 'Speak',
        "contexts": ["selection"],
        "id": "myid",
    });
});

chrome.contextMenus.onClicked.addListener((info) => {
    var text = info.selectionText;

    if (toggleStatus) {
        //translate to english first

        chrome.tts.speak(text); //default is english
    } else {
        //detect current language

        chrome.tts.speak(text); //may need to specify current language
    }  
});