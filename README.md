# Text to Speech Highlighter
This program was made for EngHacks 2021.

## Inspiration
Our inspiration from one of our members who was could speak Chinese but could not read it, so it was always a hassle when reading a Chinese website. Google Translate wasn't always accurate, nor would it help him learn the language. It was simply too cumbersome to copy every other word to another tab to read, so we decided to make a chrome extension to make the process simpler and faster.

Quickly we realized that this project would not only be beneficial to the many of those who are spending their quarantines devoted to learning a new language (and those who would do the same in the future), having accessibility in text to speech in from and to any language especially on any website would also greatly benefit our illiterate or dyslexic minority, which may be small but definitely not to be neglected. In the future if we have this finished in development, we hope to do something similar to putting it onto the app store and that our project will be able to reach at least someone who would benefit greatly from it.
## What It Does
Text to Speech Highlighter is a Google Chrome extension that adds an option to the right click menu. On any website, highlight text of any language and have chrome.tts read it back to you in that language with just two clicks! But that's not all, if you turn on a toggle, the extension will translate your highlighted text into any language of your choice (using Azure Microsoft Translation api), then again tts will read it to you in that language (currently english, "any language of your choice" is currently a feature under development).

## How We Built It
We first started with using a quick guide for Chrome Extensions to set up a skeleton for our Chrome Extension. Then we used Chrome's ContextMenus api and some form-based HTML/JavaScript/CSS for the GUI of the extension popup window. Finally, putting this together with Azure Microsoft Translation and Language Detection api gives us our current project.

##Challenges We Ran Into
The extension popup window disappears as fast as it appears, so we needed a background.js file to keep track of the toggle and dropdown inputs/states (since we wouldn't want the user to input these every time they want to translate/have something spoken to them). Communication between this popup and the background files was troublesome to set up and get working, needed to reference official documentation and examples very often. As for the project itself, we all weren't very well versed in JavaScript especially project setup with manifest files, giving us a slow development process and lots of headache-inducing (but in retrospect, simple) bugs. We also had a lot of trouble getting the Azure Microsoft api calls working in JavaScript (so much that we even implemented a working Python version), but eventually figured it out.

##Accomplishments That We're proud Of
Creating a functional project, since a working, fully integrated project on one platform wasn't too common for some of our members in previous hackathons. We were pretty organized despite all the bugs we ran into, and everyone was in the loop, aka knowing what they were doing at basically every time. We didn't lose any sleep for this hackathon (pog!!), but perhaps that's just a sign that we haven't set our sights high enough.

##What We Learned
Using apis! One of us learned JavaScript from scratch and got certification for it, which just shows how much technical knowledge we had going into this hackathon, despite some of our group members having already participated in several previous hackathons. Pixel art was also a first for us, not to brag but our first attempt at pixel art doesn't look too shabby (check out the thumbnail!).

##What's Next for Text to Speech Highlighter
If we didn't finish it in time, it would be adding a dropdown menu that gives the user some choice as to which language they want to translate their highlighted text in, not just English. This could mean that it would reach and thus benefit more people from around the world with different nationalities, which as stated in our inspiration section, we would definitely hope for. As also stated in the inspiration section, publishing on the Android/IOS app store for use in phone apps and not just websites on chrome would achieve a similar effect. Other than that, some more polish, bug fixes, and we think that it will be at least a decent application for reasonable use (in fact, that member learning Chinese is planning on continuing developing this and using it very often in the future!).

##Made With
Azure
CSS
HTML5
Javascript

## Issues
None Yet! :)

