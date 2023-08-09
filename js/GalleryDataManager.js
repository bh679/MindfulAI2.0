//Data collector 
//- Making the data importer: https://chat.openai.com/share/b0e2c55e-ef3a-4eb4-8f90-a0d6db1c9a8f

// Painting class to hold individual painting details
class Painting {
  constructor(title, imageUrl, personality, artist, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.personality = personality;
    this.artist = artist;
    this.description = description;
  }
}

// PaintingGroup class to hold a group of paintings
class PaintingGroup {
  constructor(name) {
    this.name = name;
    this.paintings = [];
  }
  
  addPainting(painting) {
    console.log(painting);

    // Check if imageUrl is from the specified domain and replace if necessary
    if (painting.imageUrl && painting.imageUrl.startsWith('http://13.237.241.168/')) {
        painting.imageUrl = painting.imageUrl.replace('http://13.237.241.168/', 'https://mindfulai.equalreality.com/');
    }

    this.paintings.push(new Painting(
        painting.title, 
        painting.imageUrl, 
        painting.personality, 
        painting.artist, 
        painting.description
    ));
}

}

// Gallery class to hold all painting groups
class Gallery {
  constructor() {
    this.paintingGroups = [];
  }
  
  addPaintingGroup(paintingGroupData) {
    const group = new PaintingGroup(paintingGroupData.name);
    paintingGroupData.paintings.forEach(painting => {
      group.addPainting(painting);
    });
    this.paintingGroups.push(group);
  }
}

async function fetchAndPopulateGallery(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            // Log the URL and the status for context
            console.error(`Failed to fetch from ${url}. Status: ${response.status}`);
            const textResponse = await response.text();  // Retrieve text response for further logging
            console.error('Response content:', textResponse);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        const gallery = new Gallery();  // Create a new Gallery instance

        data.paintingGroups.forEach(group => {
            gallery.addPaintingGroup(group);
        });

        console.log('Successfully populated gallery:', gallery);
        
        return gallery;  // Return the populated gallery

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error.message);
        throw error;  // If you want the error to be propagated for further handling
    }
}
