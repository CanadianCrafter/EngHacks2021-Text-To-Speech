### Making the web more accessible

## Inspiration
**Our inspiration came from one of our members who could speak, but not read Chinese.** He was trying to learn, but reading a Chinese website was always a pain. Having text to speech in another tab was simply too cumbersome when every few words were new, nor would it be beneficial to his learning to copy it all at once. Thus we decided to make a chrome extension to make the process simpler and faster.

This project would also be beneficial to hobbyists learning a new language (and those who would do so in the future), or for international students. Having **accessibility** in **text to speech from and to any language** especially on any website would also greatly **benefit our illiterate or dyslexic minority**. 

## What It Does
Transpeak is a free Google Chrome Extension that reads the text you highlight or its translation. Select the text, right-click it, and select the "Speak" option. With just two clicks, it's simple and quick to use! You can also press the extension for it to translate your highlighted text into your preferred language before reading it.

## How We Built It
After learning how to make a Chrome Extension, we used Chrome's ContextMenus and Text-To-Speech API and some form-based *HTML/JavaScript/CSS* to make the GUI and the background processes. We also used *Azure Microsoft's Translation and Language Detection API* to make the extension more streamlined.

## Challenges We Ran Into
Communication between the extension popup window and the background files was troublesome to set up and get working. In addition, we all weren't very well versed in *JavaScript* especially project setup with manifest files, giving us a slow development process and lots of bugs. Furthermore, we also had a **lot of trouble getting the Azure Microsoft API calls working** in *JavaScript* (so much that we even implemented a working *Python* version), but eventually figured it out. Definitely a learning experience for all of us.

## Accomplishments That We're Proud Of
**Creating a useful and functional project**, since a working, fully integrated project on one platform wasn't too common for some of our members in previous hackathons. We were pretty organized despite all the bugs we ran into, and everyone was in the loop. We didn't lose too much sleep for this hackathon (pog!!), but perhaps that's just a sign that we haven't set our sights high enough.

## What We Learned
Using APIs! One of us **learned *JavaScript* from scratch** and got certification for it, which just shows how much technical knowledge we had going into this hackathon. **Pixel art** was also a first for us, not to brag but our first attempt at pixel art doesn't look too shabby (check out the thumbnail!).

## What's Next For Transpeak
We want to get Transpeak onto different platforms, such as **Android and IOS**, as well as other browsers. One feature we want to add is a **dropdown menu** so users have the option to choose which language they want to translate to, and rather than automatically translating to their preferred language. This would provide new-language learners with added flexibility. 

We are currently working on putting this extension onto the **Chrome store** (check updates for any news if you want to try it out, eta sometime early next week!).

## Links
[Devpost](https://devpost.com/software/text-to-speech-highlighter)
[Slides](https://docs.google.com/presentation/d/1xBOzkvjuc72VeCTfqkIXZDP9x476sVQhwCIrQ_kx0R8/edit?usp=sharing)
