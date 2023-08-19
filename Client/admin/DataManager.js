//DataManager.js
//https://chat.openai.com/share/5741dd6d-ce8f-4fbb-98a7-e0e609bc7c8a

//import { NodeJSON } from '../modules/NodeJSON/NodeJSON.js';

class AdminDataEditor
{

    constructor(editor)
    {
        //this.output = document.getElementById('jsonEditor');
        this.editor = editor;
        this.saveButton = document.getElementById('saveButton');
        this.currentJSON = "";
        this.gallery = {};
        this.galleryDisplay = {}
        this.currentFile="";
    }

    Start()
    {
        NodeJSON.GetNodeJSON("GallerysData.json").then(data => {
            this.CreateButtons(data.data);//output.textContent = JSON.stringify(data, null, 4);
        }).catch(error => {
            // Handle any error that wasn't caught in GetNodeJSON
        });
    }

    async CreateButtons(galleries) {
        const container = document.getElementById('buttonsContainer');

        for (const gallery of galleries) {
            const button = document.createElement('button');
            button.textContent = gallery.id;
            button.className = "btn btn-outline-info mt-3"; // Default class for buttons
            button.addEventListener('click', async () => {
                // Reset all buttons to default state
                container.querySelectorAll('button').forEach(btn => {
                    btn.className = "btn btn-outline-info mt-3"; // Default class
                    btn.disabled = false; // Enable all buttons
                });
                
                // Set the current button to selected state
                button.className = "btn btn-primary mt-3";
                button.disabled = true;

                await this.DisplayGalleryData(gallery.url);
                this.currentFile = gallery.url;
                this.saveButton.onclick = () => {
                    adminDataEditor.Save(gallery.url);
                };
            });
            container.appendChild(button);
        }
    }



    async DisplayGalleryData(relativePath) {
        try {
            const data = await NodeJSON.GetNodeJSON(relativePath);

            this.currentJSON = data;
            this.UpdateVisualDisplay();


            this.editor.setValue(JSON.stringify(data, null, 4));

            // Adjust the height initially
            adjustEditorHeightToScreen(this.editor);
        } catch (error) {
            // Handle any error that wasn't caught in GetNodeJSON
            console.log("Error:" + error);
        }
    }


    async UpdateVisualDisplay()
    {

            //set gallery data
            this.gallery = new Gallery();       // Create a new gallery object.

            // Populate the gallery with additional attributes.
            this.gallery.setGalleryAttributes({
              questionsToAsk: this.currentJSON.questionsToAsk,
              wisdomToOffer: this.currentJSON.wisdomToOffer,
              instructions: this.currentJSON.instructions,
              Questions: this.currentJSON.Questions,
              Wisdom: this.currentJSON.Wisdom
            });

            // Populate the gallery with groups of paintings.
            this.currentJSON.paintingGroups.forEach(group => {
              this.gallery.addPaintingGroup(group);
            });

            // You would use it like this:
            // Assuming you've instantiated a gallery object named 'myGallery'
            var parentDiv = document.getElementById('visualEditor');
            parentDiv.innerHTML = "";
            this.galleryDisplay = new GalleryDisplay(this.gallery, parentDiv);
            this.galleryDisplay.display();
    }

    Save(relativePath)
    {
        NodeJSON.SaveDataToFile(relativePath, this.output.innerText);
    }

    UpdatePaintingAndSave(painting, groupArrayIndex, paintingArrayIndex) {
        // Access the specific group using groupArrayIndex
        let targetGroup = this.currentJSON.paintingGroups[groupArrayIndex];

        // Replace the painting in that group using paintingArrayIndex
        targetGroup.paintings[paintingArrayIndex] = painting;

        // Optional: Save the updated JSON to file.
        // (Assuming you have a method to save the JSON)

        NodeJSON.SaveDataToFile(this.currentFile, JSON.stringify(this.currentJSON));
    }


}
