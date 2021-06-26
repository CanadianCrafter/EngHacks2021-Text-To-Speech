var toggleStatus = false;
var lang = 'en';

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
        var clientTraceId = "114a8126-34ab-4439-a108-a60cfe39228c"
        // Add your location, also known as region. The default is global.
        // This is required if using a Cognitive Services resource.
        var location = "global";
    
       


    
    
        if (toggleStatus) {
            //translate to english first
            
            chrome.tts.speak(text); //default is english
        } else {
            //detect current language
            axios({
                baseURL: endpoint,
                url: '/detect',
                method: 'post',
                headers: {
                    'Ocp-Apim-Subscription-Key': subscriptionKey,
                    'Ocp-Apim-Subscription-Region': location,
                    'Content-type': 'application/json',
                    'X-ClientTraceId': clientTraceId
                },
                params: {
                    'api-version': '3.0'
                },
                data: [{
                    'text': text
                }],
                responseType: 'json'
            }).then(function(response){
                var results = JSON.stringify(response.data, null, 4);
                console.log(results)
                var obj = JSON.parse(results);
                console.log(obj[0].language)
                lang = obj[0].language.substring(0,2);
                chrome.tts.speak(text, {'lang': lang}); //may need to specify current language
            })
        }  
    });
});