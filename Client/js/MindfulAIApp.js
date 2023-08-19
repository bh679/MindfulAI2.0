//MindfulAIApp.js

class MindfulAIApp {
    constructor(url) {

        this.galleryManager = new GalleryManager();
        this.currentPainting;
        this.languageManager;

        // Create a new SpeechManager object
        this.speechManager = new SpeechManager('https://mindfulai.equalreality.com:3000', document.getElementById('statusMessage'));
        
        if(url == null)
            this.dataURL = "DharmaHall.json";//'https://mindfulai.equalreality.com/wp-content/uploads/2023/04/Gallery-2.json';
        else
            this.dataURL = url;
    }

    // The main function to start the application logic
    async Start() {
        try {

            // Pull data from WordPress
            await this.galleryManager.GetDataFromURL(this.dataURL);

            console.log(this.galleryManager);

            // Pick a random picture
            this.currentPainting = this.galleryManager.getRandomPainting();

            if (this.currentPainting) {
                console.log(this.currentPainting.title);  // Display the title of the randomly chosen painting

                // Display the chosen painting as the background
                this.SetBackgroundImage(this.currentPainting.imageUrl);
            } else {
                console.log("No paintings available.");
            }

        } catch (error) {
            console.log('Error:', error.message);
        }
    }

    // TODO: Add speak button to talk to picture
    async UserTalk(text, callback1, callback2)
    {
        // TODO: Implement prompts with personality
        //GPTGen.promptWrapper.prePrompt = CurrentPainting.Prompt + galleryData.instructions + galleryData.Questions + languagePrompt + galleryData.valuesPrompt;
        var prompt = this.currentPainting.personality 
             + this.galleryManager.gallery.instructions 
             + this.languageManager.languagePrompt() 
             + (this.galleryManager.gallery.valuesPrompt ? this.galleryManager.gallery.valuesPrompt : "") 
             + ": {" + text + "}";

        console.log(prompt);

        // TODO: Implement reading back response
        var response = await AskGPT(prompt);

        console.log(response);

        if(callback1 != null)
            callback1(response);

        //read it out
        let voice = this.GetVoice();

        //check language
        if(voice.eleven)
            await this.speechManager.Speak(response,voice.id, callback2);
        else
        {
            console.log(this.languageManager.currentLanguage);
            console.log(this.languageManager.currentLanguage.id);
            await this.speechService.Speak(response, voice.id, this.languageManager.currentLanguage.APIKey, callback2);
        }
    }

    GetVoice()
    {
        if(this.languageManager.isLanguageSupportedForPlatform('ElevenLabs'))
            return {eleven: true, id: "21m00Tcm4TlvDq8ikWAM" };
        else 
            return {eleven: false, id: "21m00Tcm4TlvDq8ikWAM" };
    }

    Next()
    {
        this.currentPainting = this.galleryManager.next();
        this.SetBackgroundImage(this.currentPainting.imageUrl);

    }

    Previous()
    {
        this.currentPainting = this.galleryManager.previous();
        this.SetBackgroundImage(this.currentPainting.imageUrl);
    }

    SetBackgroundImage(imageUrl) {
    // Check if a background div already exists
    let bgElement = document.getElementById('background');
    
    // If it doesn't exist, create a new div element
    if(!bgElement) {
        bgElement = document.createElement('div');
        bgElement.id = "background";
        document.body.appendChild(bgElement); // Append the div to the body
    }
    
    // Set the image and other styles
    bgElement.style.backgroundImage = `url(${imageUrl})`;
    bgElement.style.backgroundSize = 'cover';
    bgElement.style.backgroundPosition = 'center';

    // Trigger the fade-in effect by setting opacity to 1
    setTimeout(() => {
        bgElement.style.opacity = '1';
    }, 0);  // A small delay using setTimeout to ensure styles are applied first
}

}

