//local cache holds user-specific variables
var userVariables = new Proxy({
    //toggle
    translateStatus: false,

    //advanced settings
    //toggle-off options
    arabicDialect: "ar-EG",
    englishDialect: "en-US",
    chineseDialect: "zh-CN",
    portugueseDialect: "pt-PT",
    spanishDialect: "es-MX",

    //toggle-on options
    ttsLang: navigator.language,

    //speech settings
    ttsSpeed: 1,
    slowOnEven: false,
    ttsVolume: 1
}, 
{
    set(obj, prop, val) {
        if (obj[prop] != val) {
            obj[prop] = val;
            chrome.storage.sync.set({[prop]: val});
        }
    }
});

//initialize variables on startup
chrome.storage.sync.get(null, (items) => {
    for (const prop in items) {
        userVariables[prop] = items[prop];
    }
});

//create context menu
chrome.contextMenus.create({
    "title": 'Speak',
    "contexts": ["selection"],
    "id": "myid"
})

//System settings
var languageSampleSize = 50; //maximum size of text sampled for language detection
var slowSpeechRate = 0.5; //How much speech is slowed down by on even numbered clicks

//For slowOnEven functionality
var prevText = "";
var isRepeat = false;

//For Pause command
var isPaused = false;

requirejs(["axios"], function(axios) {
    chrome.contextMenus.onClicked.addListener((info) => {
        var text = info.selectionText;

        // var subscriptionKey = "46bf91238a6c47aba390aedb088c14e9";
        var subscriptionKey = "cbd392705a8a44e9a1c4d8901158c485";
        var endpoint = "https://api.cognitive.microsofttranslator.com";
        var clientTraceId = "d4625eaa-4343-45ac-85ec-cb4840a112b1"
        var location = "global";
    
        
        //Voice text in the language it is in
        if (!userVariables.translateStatus) {            
            //gets sample text for language detection
            var sampleText = text;
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
                
                speak(text, applyDialect(obj[0].language));
               
            })
            
            
        } else { //translate before speech
            //for the most part, transLang from Azure is the first 2 characters of ttsLang from Chrome TTS.
            //exceptions to this rule are handled below
            var transLang = userVariables.ttsLang;
            if (!userVariables.ttsLang.includes("pt")) { //portuguese is an exception
                transLang = userVariables.ttsLang.substring(0, 2);

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
                var translatedText = response.data[0]["translations"][0]["text"];
                //alert("translated: " + translatedText);
                speak(translatedText, userVariables.ttsLang);
            })
        }  
    });
});


//Speaks the text in the language and speed required.
function speak(text, lang){
    resume();
    if (userVariables.slowOnEven) {
        if (text == prevText) {
            isRepeat = !isRepeat;
        } else {
            isRepeat = false;
        }
    
        //alert("speaking in lang " + lang + " and speed " + ttsSpeed + " and volume " + volume);
        if (isRepeat) {
            chrome.tts.speak(text, {'lang': lang, 'rate': userVariables.ttsSpeed*slowSpeechRate, 'volume': userVariables.ttsVolume});
        } else {
            chrome.tts.speak(text, {'lang': lang, 'rate': userVariables.ttsSpeed, 'volume': userVariables.ttsVolume});
        }
    } else {
        isRepeat = false;
        chrome.tts.speak(text, {'lang': lang, 'rate': userVariables.ttsSpeed, 'volume': userVariables.ttsVolume});
    }
    
    prevText = text;

    //logs
    console.log("Text: " + text);
    console.log("Language: " + lang);
    console.log("Speed: " + userVariables.ttsSpeed);
    console.log("Volume: " + userVariables.ttsVolume);
    console.log("Translate Toggle: " + (userVariables.translateStatus?"Translate ON":"Translate OFF"));
    console.log("Is a Repeat: " + (isRepeat? "Is a Repeat":"Normal"));
    console.log("------------------");
    
}

function applyDialect(lang) {
    if (lang.substring(0, 2) == "ar") {
        return userVariables.arabicDialect;
    } else if (lang.substring(0, 2) == "en") {
        return userVariables.englishDialect;
    } else if (lang.substring(0, 2) == "zh") {
        return userVariables.chineseDialect;
    } else if (lang.substring(0, 2) == "pt") {
        return userVariables.portugueseDialect;
    } else if (lang.substring(0, 2) == "es") {
        return userVariables.spanishDialect;
    } else { //use default
        return lang;
    }
}

//Pauses text to speech
chrome.commands.onCommand.addListener((command) => {
    console.log(`Command "${command}" triggered`);
    if(command == "Pause Speech"){
        chrome.tts.isSpeaking(function(isSpeaking){
            if(isSpeaking && !isPaused){
                pause();
            }
            else{
                resume();
            }

        });        
    
    } 
        
});

function pause() {
    chrome.tts.pause();
    isPaused = true;
    console.log("Speech Paused");
}

function resume() {
    chrome.tts.resume();
    isPaused = false;
    console.log("Speech Resumed");
}


//Pauses text to speech
chrome.commands.onCommand.addListener((command) => {
    console.log(`Command "${command}" triggered`);
    if(command == "Pause Speech"){
        chrome.tts.isSpeaking(function(isSpeaking){
            if(isSpeaking && !isPaused){
                pause();
            }
            else{
                resume();
            }

        });        
    
    } 
        
});

function pause() {
    chrome.tts.pause();
    isPaused = true;
    console.log("Speech Paused");
}

function resume() {
    chrome.tts.resume();
    isPaused = false;
    console.log("Speech Resumed");
}

//Setters and Getters

function setTranslateStatus(status) {
    userVariables.translateStatus = status;
}

function getTranslateStatus() {
    return userVariables.translateStatus;
}

function setTTSLang(lang) {
    userVariables.ttsLang = lang;
}

function getTTSLang() {
    return userVariables.ttsLang;
}

function setTTSSpeed(speed) {
    userVariables.ttsSpeed = speed;
}

function getTTSSpeed() {
    return userVariables.ttsSpeed;
}

function setSlowOnEven(bool) {
    userVariables.slowOnEven = bool;
}

function getSlowOnEven() {
    return userVariables.slowOnEven;
}

function setTTSVolume(volume) {
    userVariables.ttsVolume = volume;
}

function getTTSVolume() {
    return userVariables.ttsVolume;
}

function setDialect(lang, dialect) {
    if (lang == "ar") {
        userVariables.arabicDialect = dialect;
    } else if (lang == "en") {
        userVariables.englishDialect = dialect;
    } else if (lang == "zh") {
        userVariables.chineseDialect = dialect;
    } else if (lang == "pt") {
        userVariables.portugueseDialect = dialect;
    } else {
        userVariables.spanishDialect = dialect;
    }
}

function getDialect(lang) {
    if (lang == "ar") {
        return userVariables.arabicDialect;
    } else if (lang == "en") {
        return userVariables.englishDialect;
    } else if (lang == "zh") {
        return userVariables.chineseDialect;
    } else if (lang == "pt") {
        return userVariables.portugueseDialect;
    } else {
        return userVariables.spanishDialect;
    }
}

