//GalleryManager.js
//design of this class ChatGPT - https://chat.openai.com/share/17e2b265-c6b0-4576-a8cb-c6b1b25e5b71

class GalleryManager {
	
	constructor()
	{
		this.currentPictureId = 0;
		this.currentGroupIndex = 0;
	}

	// Async function to fetch data from a given URL and populate the gallery
	async GetDataFromURL(URL) {
		this.gallery = await fetchAndPopulateGallery(URL);  // Update gallery with data from the provided URL
		console.log(this.gallery);  // Log the updated gallery

	}

	// Function to get a random painting from the gallery
	getRandomPainting(count) {

		if(count == null)
			count = 0;

		if(count > 50)
			return null;

		if (this.gallery.paintingGroups.length === 0) {
			return null;  // Return null if no painting groups in the gallery
		}

		// Choose a random painting group from the gallery
		this.currentGroupIndex = Math.floor(Math.random() * this.gallery.paintingGroups.length);
		const randomGroup = this.gallery.paintingGroups[this.currentGroupIndex];

		if (randomGroup.paintings.length === 0) {
			return this.getRandomPainting(count++);  // Return null if no paintings in the selected group
		}

		// Choose a random painting from the selected group
		this.currentPictureId = Math.floor(Math.random() * randomGroup.paintings.length);

		if(randomGroup.paintings[this.currentPictureId] == null)
			return this.getRandomPainting(count++); 

		console.log(randomGroup.paintings[this.currentPictureId]);
		return randomGroup.paintings[this.currentPictureId];  // Return the randomly selected painting
	}

	next() {
        if (this.gallery.paintingGroups.length === 0) {
            console.log("No painting groups available.");
            return null;
        }

        const currentGroup = this.gallery.paintingGroups[this.currentGroupIndex];
        
        this.currentPictureId++; // Move to the next picture

        // Check if we've gone past the end of the current group
        if (this.currentPictureId >= currentGroup.paintings.length) {
            this.currentPictureId = 0; // Reset picture ID
            this.currentGroupIndex++; // Move to the next group
            
            // Check if we've gone past the last group
            if (this.currentGroupIndex >= this.gallery.paintingGroups.length) {
                this.currentGroupIndex = 0; // Loop back to the first group
            }
        }

        return this.gallery.paintingGroups[this.currentGroupIndex].paintings[this.currentPictureId];
    }

    previous() {
        if (this.gallery.paintingGroups.length === 0) {
            console.log("No painting groups available.");
            return null;
        }

        const currentGroup = this.gallery.paintingGroups[this.currentGroupIndex];
        
        this.currentPictureId--; // Move to the previous picture

        // Check if we've gone before the start of the current group
        if (this.currentPictureId < 0) {
            this.currentGroupIndex--; // Move to the previous group
            
            // Check if we've gone before the first group
            if (this.currentGroupIndex < 0) {
                this.currentGroupIndex = this.gallery.paintingGroups.length - 1; // Loop back to the last group
            }
            // Set picture ID to the last painting in the group
            this.currentPictureId = this.gallery.paintingGroups[this.currentGroupIndex].paintings.length - 1;
        }

        return this.gallery.paintingGroups[this.currentGroupIndex].paintings[this.currentPictureId];
    }
}
