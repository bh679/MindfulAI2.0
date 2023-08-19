// Data collector 
// - Making the data importer: https://chat.openai.com/share/b0e2c55e-ef3a-4eb4-8f90-a0d6db1c9a8f

// Class to represent individual paintings.
class Painting {
  // Constructor initializes the Painting object with given attributes.
  constructor(title, imageUrl, personality, artist, description) {
    this.title = title;           // Title of the painting.
    this.imageUrl = imageUrl;     // Image URL of the painting.
    this.personality = personality; // Personality or character of the painting.
    this.artist = artist;         // Artist of the painting.
    this.description = description; // Description of the painting.
  }
}

// Class to represent a group of paintings.
class PaintingGroup {
  // Constructor initializes the group with a name.
  constructor(name) {
    this.name = name;            // Name of the painting group.
    this.paintings = [];         // List to store painting objects in this group.
  }

  // Method to add a painting object to the group.
  addPainting(painting) {
    //console.log(painting);      // Log the painting data.

    // Check if the image URL comes from a specific domain.
    if (painting.imageUrl && painting.imageUrl.startsWith('http://13.237.241.168/')) {
      // Replace the domain in the URL if it matches the specified one.
      painting.imageUrl = painting.imageUrl.replace('http://13.237.241.168/', 'https://mindfulai.equalreality.com/');
    }

    // Create a new Painting object and push it to the paintings list.
    this.paintings.push(new Painting(
      painting.title, 
      painting.imageUrl, 
      painting.personality, 
      painting.artist, 
      painting.description
    ));
  }
}

// Class to represent the entire gallery.
class Gallery {
  // Constructor initializes an empty gallery.
  constructor() {
    this.paintingGroups = [];   // List to store groups of paintings.
    this.questionsToAsk = 0;    // Number of questions to ask.
    this.wisdomToOffer = 0;     // Number of wisdoms to offer.
    this.instructions = "";     // Gallery instructions.
    this.Questions = "";        // Questions related to the gallery.
    this.Wisdom = "";           // Wisdom related to the gallery.
  }

  // Method to set additional gallery attributes.
  setGalleryAttributes(attributes) {
    this.questionsToAsk = attributes.questionsToAsk;  // Set number of questions to ask.
    this.wisdomToOffer = attributes.wisdomToOffer;    // Set number of wisdoms to offer.
    this.instructions = attributes.instructions;      // Set gallery instructions.
    this.Questions = attributes.Questions;            // Set gallery questions.
    this.Wisdom = attributes.Wisdom;                  // Set gallery wisdom.
  }

  // Method to add a group of paintings to the gallery.
  addPaintingGroup(paintingGroupData) {
    const group = new PaintingGroup(paintingGroupData.name); // Create a new painting group.
    
    // Add each painting in the group data to the painting group.
    paintingGroupData.paintings.forEach(painting => {
      group.addPainting(painting);
    });
    // Add the populated painting group to the gallery.
    this.paintingGroups.push(group);
  }
}

// Async function to fetch gallery data and populate a Gallery object.
async function fetchAndPopulateGallery(url) {
  try {
    const data = await NodeJSON.GetNodeJSON(url);  // Fetch data from the provided URL.

    /*// Check the response status.
    if (!response.ok) {
      console.error(`Failed to fetch from ${url}. Status: ${response.status}`);
      const textResponse = await response.text(); // Fetch the text response.
      console.error('Response content:', textResponse);  // Log the response content.
      throw new Error('Network response was not ok'); // Throw an error if fetch failed.
    }

    const data = await response.json();  // Parse the response data as JSON.*/

    const gallery = new Gallery();       // Create a new gallery object.

    // Populate the gallery with additional attributes.
    gallery.setGalleryAttributes({
      questionsToAsk: data.questionsToAsk,
      wisdomToOffer: data.wisdomToOffer,
      instructions: data.instructions,
      Questions: data.Questions,
      Wisdom: data.Wisdom
    });

    // Populate the gallery with groups of paintings.
    data.paintingGroups.forEach(group => {
      gallery.addPaintingGroup(group);
    });

    console.log('Successfully populated gallery:', gallery); // Log the populated gallery.
    
    return gallery;  // Return the populated gallery object.

  } catch (error) {
    // Log and throw any errors.
    console.error('There was a problem with the fetch operation:', error.message);
    throw error;
  }
}
