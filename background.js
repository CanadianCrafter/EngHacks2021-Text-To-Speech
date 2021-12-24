// Add Chrome context menu
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "title": 'Speak',
        "contexts": ["selection"],
        "id": "myid"
    });
});

// toggles
var translateStatus = false;

//System settings
var languageSampleSize = 50; //maximum size of text sampled for language detection
var slowSpeechRate = 0.5; //How much speech is slowed down by on even numbered clicks

//System variables
var text = "";
var prevText = "";
var isRepeat = false;
var ttsLang = "en-US";
var ttsSpeed = 1;
var sampleText = "";
var translatedText = "";

requirejs(["axios"], function(axios) {
    chrome.contextMenus.onClicked.addListener((info) => {
        text = info.selectionText;

        var subscriptionKey = "618948c3ab734aa88ab09bc589375cdc";
        var endpoint = "https://api.cognitive.microsofttranslator.com";
        var clientTraceId = "114a8126-34ab-4439-a108-a60cfe39228c"
        var location = "global";
    
        
        //Voice text in the language it is in
        if (!translateStatus) {            
            //gets sample text for language detection
            sampleText = text;
            if(text.length > languageSampleSize){
                sampleText = text.substring(0, languageSampleSize);
            }

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
                    'text': sampleText
                }],
                responseType: 'json'
            }).then(function(response){
                
                var results = JSON.stringify(response.data, null, 4);
                var obj = JSON.parse(results);
                //lang = obj[0].language.substring(0,2); //takes the first two characters of the language id                

                //alert("detected languge: " + obj[0].language);
                speak(sampleText, obj[0].language);
               
            })
            
            
        } else { //translate before speech
            //for the most part, transLang from Azure is the first 2 characters of ttsLang from Chrome TTS.
            //exceptions to this rule are handled below
            transLang = ttsLang;
            if (!ttsLang.includes("pt")) { //portuguese is an exception
                transLang = ttsLang.substring(0, 2);

                if (transLang == "zh") { //chinese is an exception
                    transLang = "zh-Hans";
                } else if (transLang == "no") { //norwegian is an exception
                    transLang = "nb";
                } else if (transLang == "sr") { //serbian is an exception
                    transLang = "sr-Latn";
                }
            }
            
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
                    'to': transLang
                },
                data: [{
                    'text': text
                }],
                responseType: 'json'

            }).then(function(response){
                translatedText = response.data[0]["translations"][0]["text"];
                //alert("translated: " + translatedText);
                speak(translatedText, ttsLang);
            })
        }  
    });
});

//Speaks the text in the language and speed required.
function speak(text, lang){
    if(text==prevText){
        isRepeat = !isRepeat;
    }
    else{
        isRepeat = false;
    }

    //alert("speaking in lang " + lang + " and speed " + ttsSpeed);
    if(isRepeat){
        chrome.tts.speak(text, {'lang': lang, 'rate': ttsSpeed*slowSpeechRate});
    }
    else{
        chrome.tts.speak(text, {'lang': lang, 'rate': ttsSpeed});
    }

    prevText = text;

    //logs
    console.log(text);
    console.log(lang);
    console.log(isRepeat?"Slow":"Normal");
    console.log(translateStatus?"Translate ON":"Translate OFF");
    console.log("------------------");
    
}

//Setters and Getters

function setTranslateStatus(status) {
    translateStatus = status;
}

function getTranslateStatus() {
    return translateStatus;
}

function setTTSLang(lang) {
    ttsLang = lang;
}

function setTTSSpeed(speed) {
    ttsSpeed = speed;
}

function getTTSLang() {
    return ttsLang;
}

function getTTSSpeed() {
    return ttsSpeed;
}