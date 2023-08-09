class MindfulAIApp {
    constructor() {

        this.galleryManager = new GalleryManager();
        
        this.dataURL = 'https://mindfulai.equalreality.com/wp-content/uploads/2023/04/Gallery-2.json';
    }

    // The main function to start the application logic
    async start() {
        try {

            // Pull data from WordPress
            await this.galleryManager.GetDataFromURL(this.dataURL);

            // Pick a random picture
            const randomPainting = this.galleryManager.getRandomPainting();

            if (randomPainting) {
                console.log(randomPainting.title);  // Display the title of the randomly chosen painting

                // Display the chosen painting as the background
                this.setBackgroundImage(randomPainting.imageUrl);
            } else {
                console.log("No paintings available.");
            }

            // TODO: Add speak button to talk to picture
            // TODO: Implement prompts with personality
            // TODO: Implement reading back response
        } catch (error) {
            console.log('Error:', error.message);
        }
    }

    setBackgroundImage(imageUrl) {
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
app.start();
