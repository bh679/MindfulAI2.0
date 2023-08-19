//DataManager.js
//https://chat.openai.com/share/5741dd6d-ce8f-4fbb-98a7-e0e609bc7c8a
document.addEventListener('DOMContentLoaded', function() {
    fetch('https://mindfulai.equalreality.com:3000/jsonData?filename=GallerysData.json')
        .then(response => response.json())
        .then(data => {
            createButtons(data.data);
        })
        .catch(error => {
            console.error('Error loading GallerysData.json:', error);
        });
});

function createButtons(galleries) {
    const container = document.getElementById('buttonsContainer');

    galleries.forEach(gallery => {
        const button = document.createElement('button');
        button.textContent = gallery.id;
        button.addEventListener('click', () => {
            displayGalleryData(gallery.url);
        });
        container.appendChild(button);
    });
}

function displayGalleryData(relativePath) {
    const url = `https://mindfulai.equalreality.com:3000/jsonData?filename=${relativePath}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const output = document.getElementById('output');
            output.textContent = JSON.stringify(data, null, 4);
        })
        .catch(error => {
            console.error('Error fetching gallery data:', error);
        });
}
