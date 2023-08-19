//GalleryDisplay.js

class GalleryDisplay {
    constructor(gallery, parentDiv) {
        this.gallery = gallery;
        this.parentDiv = parentDiv;
    }

    display() {
        console.log("display");
        const galleryContainer = document.createElement('div');
        galleryContainer.className = "container mt-5";

        this.gallery.paintingGroups.forEach(group => {
            // Create heading for each group.
            const groupHeading = document.createElement('h2');
            groupHeading.innerText = group.name;
            galleryContainer.appendChild(groupHeading);

            // Create a row for paintings.
            const row = document.createElement('div');
            row.className = "row";

            group.paintings.forEach(painting => {
                // Create a column for each painting.
                const col = document.createElement('div');
                col.className = "col-md-4";

                // Create Bootstrap card for each painting.
                const card = document.createElement('div');
                card.className = "card mb-4";

                const cardImg = document.createElement('img');
                cardImg.className = "card-img-top";
                cardImg.src = painting.imageUrl;
                card.appendChild(cardImg);

                const cardBody = document.createElement('div');
                cardBody.className = "card-body";

                const labelUrl = document.createElement('label');
                labelUrl.innerText = "Image URL:";
                cardBody.appendChild(labelUrl);

                const cardUrl = document.createElement('p');
                cardUrl.className = "card-text small";
                cardUrl.style.fontSize = "12px";
                cardUrl.innerText = painting.imageUrl;
                cardBody.appendChild(cardUrl);

                const labelTitle = document.createElement('label');
                labelTitle.innerText = "Title:";
                cardBody.appendChild(labelTitle);
                
                const cardTitle = document.createElement('h5');
                cardTitle.className = "card-title";
                cardTitle.innerText = painting.title;
                cardBody.appendChild(cardTitle);

                const labelArtist = document.createElement('label');
                labelArtist.innerText = "Artist:";
                cardBody.appendChild(labelArtist);

                const cardSubtitle = document.createElement('h6');
                cardSubtitle.className = "card-subtitle mb-2 text-muted";
                cardSubtitle.innerText = painting.artist;
                cardBody.appendChild(cardSubtitle);

                const labelDescription = document.createElement('label');
                labelDescription.innerText = "Description:";
                cardBody.appendChild(labelDescription);

                const cardText = document.createElement('p');
                cardText.className = "card-text";
                cardText.innerText = painting.description;
                cardBody.appendChild(cardText);

                card.appendChild(cardBody);
                col.appendChild(card);
                row.appendChild(col);
            });

            galleryContainer.appendChild(row);
        });

        // Display gallery attributes.
        const galleryAttributes = document.createElement('div');
        galleryAttributes.className = "mt-5";
        
        const labelInstructions = document.createElement('label');
        labelInstructions.innerText = "Instructions:";
        galleryAttributes.appendChild(labelInstructions);

        const galleryInstructions = document.createElement('p');
        galleryInstructions.innerText = this.gallery.instructions;
        galleryAttributes.appendChild(galleryInstructions);

        const labelQuestions = document.createElement('label');
        labelQuestions.innerText = "Questions:";
        galleryAttributes.appendChild(labelQuestions);

        const galleryQuestions = document.createElement('p');
        galleryQuestions.innerText = this.gallery.Questions;
        galleryAttributes.appendChild(galleryQuestions);

        const labelWisdom = document.createElement('label');
        labelWisdom.innerText = "Wisdom:";
        galleryAttributes.appendChild(labelWisdom);

        const galleryWisdom = document.createElement('p');
        galleryWisdom.innerText = this.gallery.Wisdom;
        galleryAttributes.appendChild(galleryWisdom);

        galleryContainer.appendChild(galleryAttributes);

        // Append the gallery container to the body or another container.
        this.parentDiv.appendChild(galleryContainer);
    }

}

