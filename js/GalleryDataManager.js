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

const gallery = new Gallery();

// Fetching data and populating the Gallery instance
const url = 'https://mindfulai.equalreality.com/wp-content/uploads/2023/04/Gallery-2.json';
fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    data.paintingGroups.forEach(group => {
      gallery.addPaintingGroup(group);
    });
    console.log(gallery);  // Here you can see the populated gallery object
  })
  .catch(error => {
    console.log('There was a problem with the fetch operation:', error.message);
  });
