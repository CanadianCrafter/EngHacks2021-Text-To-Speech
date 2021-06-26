document.addEventListener('DOMContentLoaded', function() {
    chrome.contextMenus.create({
        "title": 'Speak',
        "contexts": ["selection"],
        "id": "myid",
    });
});

chrome.contextMenus.onClicked.addListener((info) => {
    chrome.tts.speak(info.selectionText);
})
