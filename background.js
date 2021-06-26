var toggleStatus = true;

function setToggleStatus(status) {
    toggleStatus = status;
    alert("toggle set to " + toggleStatus);
}

function getToggleStatus() {
    return toggleStatus;
}

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "title": 'Speak',
        "contexts": ["selection"],
        "id": "myid"
    });
});

requirejs(["axios"], function(axios) {
    chrome.contextMenus.onClicked.addListener((info) => {
        var text = info.selectionText;
    
        var subscriptionKey = "4de7de4bb9b9468bad08b9b8b507ed99";
        var endpoint = "https://api.cognitive.microsofttranslator.com";
    
        // Add your location, also known as region. The default is global.
        // This is required if using a Cognitive Services resource.
        var location = "global";
    
        axios({
            baseURL: endpoint,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Ocp-Apim-Subscription-Region': location,
                'Content-type': 'application/json',
                'X-ClientTraceId': "114a8126-34ab-4439-a108-a60cfe39228c"
            },
            params: {
                'api-version': '3.0',
                'from': 'en',
                'to': ['de', 'it']
            },
            data: [{
                'text': text
            }],
            responseType: 'json'
        }).then(function(response){
            console.log(JSON.stringify(response.data, null, 4));
        })
    
        if (toggleStatus) {
            //translate to english first
            
            chrome.tts.speak(text); //default is english
        } else {
            //detect current language
    
            chrome.tts.speak(text); //may need to specify current language
        }  
    });
});