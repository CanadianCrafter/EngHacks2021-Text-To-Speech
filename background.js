// Add Chrome context menu
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "title": 'Speak',
        "contexts": ["selection"],
        "id": "myid"
    });
});

//Add Chrome tab onRemoved listener
chrome.tabs.onRemoved.addListener(function(tabid, removed) {
    //If a tab is closed while the tts is speaking, stop it.
    //(This should be fixed so only if the tab with the text is closed, does speech stop)
    if(chrome.tts.isSpeaking()){
        chrome.tts.stop()
        console.log("Speech Stopped")
    }
    console.log("Tab Removed")
})

// toggles
var translateStatus = false;
var yueStatus = false;

//System settings
var sameTextNumber = 1; //number of consequtive times a piece of text is voiced
var slowSpeechRate = 0.6; //speech rate on even numbered clicks
var languageSampleSize = 100; //maximum size of text sampled for language detection

//System variables
var prevText = "";
var text = "";
var lang = 'en';
var sampleText = "";
var translatedText = "";
var prefLang = "";

requirejs(["axios"], function(axios) {
    chrome.contextMenus.onClicked.addListener((info) => {
        text = info.selectionText;

        //save text
        if(text==prevText){
            sameTextNumber++;
        }
        else{
            sameTextNumber=1;
        }
        prevText = text;

        var subscriptionKey = "618948c3ab734aa88ab09bc589375cdc";
        var endpoint = "https://api.cognitive.microsofttranslator.com";
        var clientTraceId = "114a8126-34ab-4439-a108-a60cfe39228c"
        var location = "global";
    
        
        //Voice text in the language it is in
        if (!translateStatus) {            
            //gets sample text for language detection
            sampleText = text;
            if(text.length>languageSampleSize){
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
                lang = obj[0].language.substring(0,2); //takes the first two characters of the language id                

                speak(text,lang);
               
            })
            
            
        } else { //translate before speech
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
                            
                prefLang = navigator.language.substring(0, 2);
                
                translatedText = response.data[0]["translations"][0]["text"];

                speak(translatedText,prefLang);
            })
        }  
    });
});

//Modifies language region based on dialect selection
function dialectModifier(lang){
    if(lang=="zh"&&yueStatus) return 'zh-hk'; //switches to yue

    else return lang;
}

//Speaks the text in the language and speed required.
function speak(text, lang){
    lang=dialectModifier(lang);
   
    if(sameTextNumber%2!=0){
        chrome.tts.speak(text, {'lang': lang}); //specify current language
        chrome.tts.speak(
            text,
            {
              onEvent: function(event) {
                console.log('Event ' + event.type + ' at position ' + event.charIndex);
                if (event.type == 'error') {
                  console.log('Error: ' + event.errorMessage);
                }
              },
              'lang': lang, //specify current language
            },
          );
    }
    else{
        chrome.tts.speak(
            text,
            {
              onEvent: function(event) {
                console.log('Event ' + event.type + ' at position ' + event.charIndex);
                if (event.type == 'error') {
                  console.log('Error: ' + event.errorMessage);
                }
              },
              'lang': lang,'rate':slowSpeechRate //60% speed
            },
          );
    }

    //logs
    console.log(text);
    console.log(lang);
    console.log(sameTextNumber%2!=0?"Normal":"Slow");
    console.log(translateStatus?"Translate ON":"Translate OFF");
    console.log(yueStatus?"Yue ON":"Yue OFF");
    console.log("------------------");

    return;
}

//Setters and Getters

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