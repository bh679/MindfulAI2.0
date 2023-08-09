//MindfulAIApp.js

class MindfulAIApp {
    constructor() {

        this.galleryManager = new GalleryManager();
        this.currentPainting;
        
        this.dataURL = 'https://mindfulai.equalreality.com/wp-content/uploads/2023/04/Gallery-2.json';
    }

    // The main function to start the application logic
    async Start() {
        try {

            // Pull data from WordPress
            await this.galleryManager.GetDataFromURL(this.dataURL);

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
    async UserTalk(text)
    {
        // TODO: Implement prompts with personality
        //GPTGen.promptWrapper.prePrompt = CurrentPainting.Prompt + galleryData.instructions + galleryData.Questions + languagePrompt + galleryData.valuesPrompt;
        var prompt = this.currentPainting.personality 
             + this.galleryManager.gallery.instructions 
             + languagePrompt 
             + (this.galleryManager.gallery.valuesPrompt ? this.galleryManager.gallery.valuesPrompt : "") 
             + ": {" + text + "}";

        console.log(prompt);

        // TODO: Implement reading back response
        var response = await AskGPT(prompt);

        console.log(response);
        
    }

/*
    public void AskQuestion()
    {
        if(questionId < galleryData.questionsToAsk)
            GPTGen.promptWrapper.prePrompt = CurrentPainting.Prompt + galleryData.instructions + galleryData.Questions + languagePrompt;
        else if(questionId < galleryData.questionsToAsk+galleryData.wisdomToOffer)
            GPTGen.promptWrapper.prePrompt = CurrentPainting.Prompt + galleryData.instructions + galleryData.Wisdom + languagePrompt;
        else
        {
            GPTGen.promptWrapper.prePrompt = CurrentPainting.Prompt + galleryData.instructions + languagePrompt;
            responseReader.wrapper.postPrompt = Instruction[Random.Range(0,Instruction.Length)];
        }
        
        questionId ++;
    }
*/

    SetBackgroundImage(imageUrl) {
    // Create a new div element
    const bgElement = document.createElement('div');

    // Style the div to fill the entire viewport and set the image as the background
    bgElement.style.width = '100vw';
    bgElement.style.height = '100vh';
    bgElement.style.backgroundImage = `url(${imageUrl})`;
    bgElement.style.backgroundSize = 'cover'; // Cover the viewport
    bgElement.style.backgroundPosition = 'center'; // Center the image

    // Append the div to the body
    document.body.appendChild(bgElement);
}
}

// To start the app
const app = new MindfulAIApp();
app.Start();
