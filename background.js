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
    slowOnEven: false
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

chrome.contextMenus.onClicked.addListener(async (info) => {
    var text = info.selectionText;

    //Voice text in the language it is in
    if (!userVariables.translateStatus) {            
        let response = await fetch('http://20.242.160.43:3000/api/detect', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text: text})
        });

        if (response.ok) {
            speak(text, applyDialect((await response.json()).lang));
        } else {
            alert("An error occurred. Please contact developers.");
        }
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
        
        let response = await fetch('http://20.242.160.43:3000/api/translate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text: text, lang: transLang})
        });

        if (response.ok) {
            speak((await response.json()).translation, userVariables.ttsLang);
        } else {
            alert("An error occurred. Please contact developers.");
        }
    }  
});

//Speaks the text in the language and speed required.
function speak(text, lang){
    if (userVariables.slowOnEven) {
        if (text == prevText) {
            isRepeat = !isRepeat;
        } else {
            isRepeat = false;
        }
    
        //alert("speaking in lang " + lang + " and speed " + ttsSpeed);
        if (isRepeat) {
            chrome.tts.speak(text, {'lang': lang, 'rate': userVariables.ttsSpeed*slowSpeechRate});
        } else {
            chrome.tts.speak(text, {'lang': lang, 'rate': userVariables.ttsSpeed});
        }
    } else {
        isRepeat = false;
        chrome.tts.speak(text, {'lang': lang, 'rate': userVariables.ttsSpeed});
    }
    
    prevText = text;

    //logs
    console.log(text);
    console.log(lang);
    console.log(isRepeat?"Slow":"Normal");
    console.log(userVariables.translateStatus?"Translate ON":"Translate OFF");
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

//Stop text Text
chrome.commands.onCommand.addListener((command) => {
    console.log(`Command "${command}" triggered`);
    if(command == "Stop Speech"){
        chrome.tts.stop();
        console.log("Speech Stopped");
    
    } 
        
});

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

function setTTSSpeed(speed) {
    userVariables.ttsSpeed = speed;
}

function getTTSLang() {
    return userVariables.ttsLang;
}

function getTTSSpeed() {
    return userVariables.ttsSpeed;
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

function setSlowOnEven(bool) {
    userVariables.slowOnEven = bool;
}

function getSlowOnEven() {
    return userVariables.slowOnEven;
}