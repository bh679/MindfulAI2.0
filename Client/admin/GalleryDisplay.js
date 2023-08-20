//GalleryDisplay.js

class GalleryDisplay {
    constructor(gallery, parentDiv, galleryMetaData) {
        this.gallery = gallery;
        this.parentDiv = parentDiv;
        this.selectedDiv;

        this.selectedPaintingId = null;
        this.selectedGroupId = null;

        this.galleryMetaData = galleryMetaData;
    }

   display(galleryMetaData) {
        const galleryContainer = document.createElement('div');
        galleryContainer.className = "container mt-5";

        // Create a Bootstrap card for Gallery Attributes
        const attributesCard = document.createElement('div');
        attributesCard.className = "card mb-4";

        const attributesCardBody = document.createElement('div');
        attributesCardBody.className = "card-body";


        // Create Open Button
        const liveBtn = document.createElement('button');
        liveBtn.className = "btn btn-info mt-3";  // Initial class for disabled state
        liveBtn.innerText = "View Live Gallery";

        // The URL you want to open
        const targetUrl = "../#"+galleryMetaData.id;  

        liveBtn.addEventListener('click', () => {
            window.open(targetUrl, '_blank');  // Opens the link in a new tab/window
        });

        // Attach the button to the document or a specific element if needed
        attributesCard.appendChild(liveBtn);


        const galleryAttributes = document.createElement('div');
        attributesCard.appendChild(attributesCardBody);




        const labelInstructions = document.createElement('label');
        labelInstructions.innerText = "Instructions:";
        attributesCardBody.appendChild(labelInstructions);

        const galleryInstructions = document.createElement('p');
        galleryInstructions.innerText = this.gallery.instructions;
        attributesCardBody.appendChild(galleryInstructions);

        const labelQuestions = document.createElement('label');
        labelQuestions.innerText = "Questions:";
        attributesCardBody.appendChild(labelQuestions);

        const galleryQuestions = document.createElement('p');
        galleryQuestions.innerText = this.gallery.Questions;
        attributesCardBody.appendChild(galleryQuestions);

        const labelWisdom = document.createElement('label');
        labelWisdom.innerText = "Wisdom:";
        attributesCardBody.appendChild(labelWisdom);

        const galleryWisdom = document.createElement('p');
        galleryWisdom.innerText = this.gallery.Wisdom;
        attributesCardBody.appendChild(galleryWisdom);

        // Create Save Button
        const saveBtn = document.createElement('button');
        saveBtn.className = "btn btn-secondary mt-3";  // Initial class for disabled state
        saveBtn.innerText = "Save";
        saveBtn.disabled = true;

        saveBtn.addEventListener('click', () => {
            // Handle saving functionality here
        });

        // Create Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = "btn btn-danger mt-3 ml-2";  // Added margin for space between buttons
        deleteBtn.innerText = "Delete";
        deleteBtn.addEventListener('click', () => {
            const confirmation = window.confirm("Do you want to delete the whole gallery?");
            if (confirmation) {
                // Handle delete functionality here
                adminDataEditor.DeletePaintingAndSave();
                console.log(this.gallery);
            }
        });

        // Append buttons to the card body
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "space-between";  // this pushes children apart, so if there are only two buttons, one will be on the far left, the other on the far right

        // Add the save button to the container
        buttonContainer.appendChild(saveBtn);

        // Add the delete button to the container
        buttonContainer.appendChild(deleteBtn);
        
        attributesCardBody.appendChild(buttonContainer);

        galleryContainer.appendChild(attributesCard);

        // Section to display the selected painting at the top
        const selectedPaintingSection = document.createElement('div');
        galleryContainer.appendChild(selectedPaintingSection);

        this.gallery.paintingGroups.forEach((group, groupIndex) => {
            // Create heading for each group.
            const groupHeading = document.createElement('h2');
            groupHeading.innerText = group.name;
            galleryContainer.appendChild(groupHeading);

            // Create a row for paintings.
            const row = document.createElement('div');
            row.className = "row";

            group.paintings.forEach((painting, paintingIndex) => {
                // Create a column for each painting.
                const col = document.createElement('div');
                col.className = "col-md-2";

                // Create Bootstrap card for each painting.
                const card = document.createElement('div');
                card.className = "card mb-2";

                 // Assign data attributes to store the IDs
                card.dataset.groupId = groupIndex; 
                card.dataset.paintingId = paintingIndex; 

                card.addEventListener('click', () => {
                    // Store the selected painting and group IDs as class variables
                    this.selectedGroupId = card.dataset.groupId;
                    this.selectedPaintingId = card.dataset.paintingId;

                    // Then display the selected painting
                    this.displaySelectedPainting(painting, card);
                });

                const cardImg = document.createElement('img');
                cardImg.className = "card-img-top";
                cardImg.src = painting.imageUrl;
                card.appendChild(cardImg);

                const cardBody = document.createElement('div');
                cardBody.className = "card-body";

                const cardTitle = document.createElement('h5');
                cardTitle.className = "card-title";
                cardTitle.innerText = painting.title;
                cardBody.appendChild(cardTitle);

                const cardSubtitle = document.createElement('h6');
                cardSubtitle.className = "card-subtitle mb-2 text-muted";
                cardSubtitle.innerText = painting.artist;
                cardBody.appendChild(cardSubtitle);

                card.appendChild(cardBody);
                col.appendChild(card);
                row.appendChild(col);
            });


            // After processing all paintings in the group, add a 'Create New' painting card
            const addCol = document.createElement('div');
            addCol.className = "col-md-2";

            const addCard = document.createElement('div');
            addCard.className = "card mb-2 create-new-card";

            const addCardBody = document.createElement('div');
            addCardBody.className = "card-body text-center";

            const addButton = document.createElement('button');
            addButton.className = "btn btn-outline-info";
            addButton.textContent = "Create New Painting";


            addCardBody.dataset.groupId = groupIndex; 

            addButton.addEventListener('click', () => {
                this.selectedGroupId = addCardBody.dataset.groupId;
                // Here, you might want to generate a new ID based on the number of paintings or other criteria.
                this.selectedPaintingId = group.paintings.length; // Assuming the ID can just be the next number

                // Create a dummy new painting object. You can modify this based on your needs.
                const newPainting = {
                    imageUrl: '',
                    title: '',
                    artist: '',
                    description: '',
                    personality: ''
                };
                group.paintings.push(newPainting); // Add the new painting to the group

                // Display the newly created painting as selected
                this.displaySelectedPainting(newPainting, addCardBody, true);
            });

            addCardBody.appendChild(addButton);
            addCard.appendChild(addCardBody);
            addCol.appendChild(addCard);
            row.appendChild(addCol);

            galleryContainer.appendChild(row);
        });

        // Append the gallery container to the body or another container.
        this.parentDiv.appendChild(galleryContainer);
    }

    Deselect()
    {
        // If this.selectedDiv exists and it has a parent node, remove it from the parent.
        if (this.selectedDiv && this.selectedDiv.parentNode) {
            this.selectedDiv.parentNode.removeChild(this.selectedDiv);
        }
    }

    displaySelectedPainting(painting, clickedCard, newPainting = false) {


        const labelStyle = "font-weight: bold;";


        // If this.selectedDiv exists and it has a parent node, remove it from the parent.
        this.Deselect();

        const row = document.createElement('div');
        row.className = "row mb-5";


       /* const col1 = document.createElement('div');
        col1.className = "col-md-1";
        const col2 = document.createElement('div');
        col2.className = "col-md-1";*/

        const col = document.createElement('div');
        col.className = "col-md-12";

        // Create Bootstrap card for the selected painting.
        const card = document.createElement('div');
        card.className = "card";

        const cardImg = document.createElement('img');
        cardImg.className = "card-img-top";
        cardImg.src = painting.imageUrl;
        cardImg.id = 'selectedPaintingImage';
        cardImg.style.padding = "0 35% 0 35%";
        card.appendChild(cardImg);

        const cardUrl = document.createElement('figcaption');
        cardUrl.className = "card-text small text-muted";
        cardUrl.placeholder = "path/to/your/image_goes_here.jpg";
        cardUrl.id = 'selectedPaintingUrl';
        cardUrl.style.fontSize = "10px";
        cardUrl.contentEditable = "true";
        cardUrl.innerText = painting.imageUrl;
        card.appendChild(cardUrl);

        const cardBody = document.createElement('div');
        cardBody.className = "card-body";

        // Title
        const labelTitle = document.createElement('label');
        labelTitle.style = labelStyle;
        labelTitle.innerText = "Title:";
        cardBody.appendChild(labelTitle);

        const cardTitle = document.createElement('div'); // using div to make it block level
        cardTitle.contentEditable = "true";
        cardTitle.innerText = painting.title;
        cardTitle.placeholder = "Artwork title here...";
        cardTitle.id = 'selectedPaintingTitle';
        cardBody.appendChild(cardTitle);

        // Artist
        const labelArtist = document.createElement('label');
        labelArtist.style = labelStyle;
        labelArtist.innerText = "Artist:";
        cardBody.appendChild(labelArtist);

        const cardSubtitle = document.createElement('div');
        cardSubtitle.contentEditable = "true";
        cardSubtitle.innerText = painting.artist;
        cardSubtitle.placeholder = "Artist name here...";
        cardSubtitle.id = 'selectedPaintingArtist';
        cardBody.appendChild(cardSubtitle);

        // Description
        const labelDescription = document.createElement('label');
        labelDescription.style = labelStyle;
        labelDescription.innerText = "Description:";
        cardBody.appendChild(labelDescription);

        const cardText = document.createElement('div');
        cardText.contentEditable = "true";
        cardText.innerText = painting.description;
        cardText.placeholder = "Desciption here...";
        cardText.id = 'selectedPaintingDescription';
        cardBody.appendChild(cardText);

        // Personality
        const labelPersonality = document.createElement('label');
        labelPersonality.style = labelStyle;
        labelPersonality.innerText = "Personality:";
        cardBody.appendChild(labelPersonality);

        const cardPersonality = document.createElement('div');
        cardPersonality.contentEditable = "true";
        cardPersonality.innerText = painting.personality;
        cardPersonality.placeholder = "AI Personality here...";
        cardPersonality.id = 'selectedPaintingPersonality';
        cardBody.appendChild(cardPersonality);

        const saveBtn = document.createElement('button');
        saveBtn.className = "btn mt-3";
        saveBtn.innerText = "Save";
        saveBtn.disabled = true; // Initially disable the save button
        saveBtn.addEventListener('click', () => {
            const updatedPainting = this.getCurrentPaintingValues();

            adminDataEditor.UpdatePaintingAndSave(updatedPainting, this.selectedGroupId, this.selectedPaintingId);
            // Handle saving functionality here
            // For now, we'll just console log the updated values
            console.log(updatedPainting);

            this.Deselect();
        });


        function handleChange() {
            saveBtn.disabled = false; // Enable the save button
        saveBtn.className = "btn btn-success mt-3";
        }

        cardTitle.addEventListener('input', handleChange);
        cardSubtitle.addEventListener('input', handleChange);
        cardText.addEventListener('input', handleChange);
        cardPersonality.addEventListener('input', handleChange);
        cardUrl.addEventListener('input', handleChange);


        const deleteBtn = document.createElement('button');
        deleteBtn.className = "btn btn-danger mt-3";
        deleteBtn.innerText = "Delete";
        deleteBtn.addEventListener('click', () => {
            const confirmation = window.confirm("Are you sure you want to delete this painting?");

            if (confirmation) {
                const updatedPainting = this.getCurrentPaintingValues();

                adminDataEditor.DeletePaintingAndSave(this.selectedGroupId, this.selectedPaintingId);
                
                // Handle saving functionality here
                // For now, we'll just console log the updated values
                console.log(updatedPainting);

                this.Deselect();
            }
        });



        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "space-between";  // this pushes children apart, so if there are only two buttons, one will be on the far left, the other on the far right

        // Add the save button to the container
        buttonContainer.appendChild(saveBtn);

        if (!newPainting) {
            // Add the delete button to the container
            buttonContainer.appendChild(deleteBtn);
        }

        // Add the button container to the card body
        cardBody.appendChild(buttonContainer);

        card.appendChild(cardBody);
        col.appendChild(card);
        //row.appendChild(col1);
        row.appendChild(col);
        //row.appendChild(col2);

        this.selectedDiv = row;

        //container.appendChild(row);

        // Identify the parent row of the clicked card
        const parentRow = clickedCard.closest('.row');

        // Insert the detailed view before this row
        parentRow.parentNode.insertBefore(this.selectedDiv, parentRow);



    }



    getCurrentPaintingValues() {
        const imageUrl = document.getElementById('selectedPaintingUrl').innerText;
        const title = document.getElementById('selectedPaintingTitle').innerText;
        const artist = document.getElementById('selectedPaintingArtist').innerText;
        const description = document.getElementById('selectedPaintingDescription').innerText;
        const personality = document.getElementById('selectedPaintingPersonality').innerText;

        return new Painting(title, imageUrl, personality, artist, description);
    }





}


        

