var translateStatus = false;
var yueStatus = false;
var prevText ="";
var prevPrevText ="";
var sameTextNumber = 1;
var speechRate = 0.6;

function setTranslateStatus(status) {
    translateStatus = status;
}

function getTranslateStatus() {
    return translateStatus;
}

function setYueStatus(status) {
    yueStatus = status;
}

function getYueStatus() {
    return yueStatus;
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
        prevPrevText = prevText;
        prevText = text;
        if(prevText==prevPrevText){
            sameTextNumber++;
        }
        else{
            sameTextNumber=1;
        }
    
        var subscriptionKey = "4de7de4bb9b9468bad08b9b8b507ed99";
        var endpoint = "https://api.cognitive.microsofttranslator.com";
        var clientTraceId = "114a8126-34ab-4439-a108-a60cfe39228c"
        var location = "global";
        var lang = 'en';
    
        if (translateStatus) {
            //translate to english first
            axios({
                baseURL: endpoint,
                url: '/translate',
                method: 'post',
                headers: {
                    'Ocp-Apim-Subscription-Key': subscriptionKey,
                    'Ocp-Apim-Subscription-Region': location,
                    'Content-type': 'application/json',
                    'X-ClientTraceId': clientTraceId
                },
                params: {
                    'api-version': '3.0',
                    'to': [navigator.language.substring(0, 2)]
                },
                data: [{
                    'text': text
                }],
                responseType: 'json'

            }).then(function(response){
                //console.log(JSON.stringify(response.data, null, 4));
                console.log(response.data[0]["translations"][0]["text"]);
                console.log(navigator.language);
                
                lang = navigator.language.substring(0, 2)
                
                if(lang=="zh"&&yueStatus) lang='zh-hk'; //switches to yue

                if(sameTextNumber%2!=0){
                    chrome.tts.speak(response.data[0]["translations"][0]["text"], {'lang': lang}); //default is english
                }
                else{
                    chrome.tts.speak(response.data[0]["translations"][0]["text"], {'lang': lang,'rate':speechRate}); //60% speed
                }
            })
            
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
                if(lang=="zh"&&yueStatus) lang='zh-hk'; //switches to yue
 

                if(sameTextNumber%2!=0){
                    chrome.tts.speak(text, {'lang': lang}); //specify current language

                }
                else{
                    chrome.tts.speak(text, {'lang': lang,'rate':speechRate}); //60% speed
                }
            })
        }  
    });
});