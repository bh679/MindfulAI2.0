//GalleryManager.js

class GalleryManager {
	

	// Async function to fetch data from a given URL and populate the gallery
	async GetDataFromURL(URL) {
		this.gallery = await fetchAndPopulateGallery(URL);  // Update gallery with data from the provided URL
		console.log(this.gallery);  // Log the updated gallery
	}

	// Function to get a random painting from the gallery
	getRandomPainting() {
		if (this.gallery.paintingGroups.length === 0) {
			return null;  // Return null if no painting groups in the gallery
		}

		// Choose a random painting group from the gallery
		const randomGroupIndex = Math.floor(Math.random() * this.gallery.paintingGroups.length);
		const randomGroup = this.gallery.paintingGroups[randomGroupIndex];

		if (randomGroup.paintings.length === 0) {
			return null;  // Return null if no paintings in the selected group
		}

		// Choose a random painting from the selected group
		const randomPaintingIndex = Math.floor(Math.random() * randomGroup.paintings.length);
		return randomGroup.paintings[randomPaintingIndex];  // Return the randomly selected painting
	}
}
