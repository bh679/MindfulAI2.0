//GalleryManager.js
//design of this class ChatGPT - https://chat.openai.com/share/17e2b265-c6b0-4576-a8cb-c6b1b25e5b71

class GalleryManager {
	

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
		const randomGroupIndex = Math.floor(Math.random() * this.gallery.paintingGroups.length);
		const randomGroup = this.gallery.paintingGroups[randomGroupIndex];

		if (randomGroup.paintings.length === 0) {
			return getRandomPainting(count++);  // Return null if no paintings in the selected group
		}

		// Choose a random painting from the selected group
		const randomPaintingIndex = Math.floor(Math.random() * randomGroup.paintings.length);

		if(randomGroup.paintings[randomPaintingIndex] == null)
			return getRandomPainting(count++); 

		console.log(randomGroup.paintings[randomPaintingIndex]);
		return randomGroup.paintings[randomPaintingIndex];  // Return the randomly selected painting
	}
}
