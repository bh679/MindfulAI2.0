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

                    if(btn.id == "new-gallery-button")
                        btn.className = "btn btn-outline-warning mt-3";
                    else if(btn.id != "new-gallery-submit")
                        btn.className = "btn btn-outline-info mt-3"; // Default class
                    btn.disabled = false; // Enable all buttons
                    btn.hidden = false;
                    inputDiv.hidden = true;
                });
                
                // Set the current button to selected state
                button.className = "btn btn-info mt-3";
                button.disabled = true;

                await this.DisplayGalleryData(gallery);
                this.currentFile = gallery.url;
                this.saveButton.onclick = () => {
                    adminDataEditor.Save(gallery.url);
                };
            });
            container.appendChild(button);
        }

        var inputDiv = this.CreateInput(container);
        inputDiv.hidden = true;

        const button = document.createElement('button');
        button.textContent = "new";
        button.id = "new-gallery-button";
        button.className = "btn btn-outline-warning mt-3"; // Default class for buttons
        button.addEventListener('click', async () => {
            // Reset all buttons to default state
            container.querySelectorAll('button').forEach(btn => {
                if(btn.id != "new-gallery-button" && btn.id != "new-gallery-submit")
                    btn.className = "btn btn-outline-info mt-3"; // Default class
                btn.disabled = false; // Enable all buttons
                btn.hidden = false;
                inputDiv.hidden = true;
            });

            button.className = "btn btn-warning mt-3";
            inputDiv.hidden = false;
            button.disabled = true;
            
        });
        container.appendChild(button);


        container.appendChild(inputDiv);
    }

    CreateInput(container)
    {
        // Create the main div element
        const divInputGroup = document.createElement('div');
        divInputGroup.className = 'input-group mb-3';

        // Create the input element
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';
        input.placeholder = "Recipient's username";
        input.setAttribute('aria-label', "Recipient's username");
        input.setAttribute('aria-describedby', "basic-addon2");

        // Append the input element to the main div
        divInputGroup.appendChild(input);

        // Create the div for the button
        const divInputGroupAppend = document.createElement('div');
        divInputGroupAppend.className = 'input-group-append';

        // Create the button element
        const button = document.createElement('button');
        button.className = 'btn btn-outline-secondary';
        button.type = 'button';
        button.id = "new-gallery-submit";
        button.textContent = 'Button';
        button.addEventListener('click', async () => {
            
            this.CreateNewGalleryFile(input.value);
            divInputGroup.hidden = true;
            
        });

        // Append the button to its div
        divInputGroupAppend.appendChild(button);

        // Append the button div to the main div
        divInputGroup.appendChild(divInputGroupAppend);

        // Finally, append the main div to the container
        //const container = document.querySelector('.container'); // replace .container with your container's selector
        return divInputGroup;
    }

    async CreateNewGalleryFile(name)
    {
        NodeJSON.SaveDataToFile(name + ".json", '{"paintingGroups": []}');

        var gal = {};
        gal.id = name;
        gal.url = "./" + name + ".json";

        var json = await NodeJSON.GetNodeJSON("GallerysData.json");
        
        json.data.push(gal);

        console.log(json);

        await NodeJSON.SaveDataToFile('GallerysData.json', JSON.stringify(json));
        location.reload();

    }


    async DisplayGalleryData(galleryMetaData) {

        var relativePath = galleryMetaData.url;

        try {
            const data = await NodeJSON.GetNodeJSON(relativePath);

            this.currentJSON = data;
            this.UpdateVisualDisplay(galleryMetaData);


            this.editor.setValue(JSON.stringify(data, null, 4));

            // Adjust the height initially
            adjustEditorHeightToScreen(this.editor);
        } catch (error) {
            // Handle any error that wasn't caught in GetNodeJSON
            console.log("Error:" + error);
        }
    }


    async UpdateVisualDisplay(galleryMetaData)
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
            this.galleryDisplay = new GalleryDisplay(this.gallery, parentDiv, galleryMetaData);
            this.galleryDisplay.display(galleryMetaData);
    }

    async Save(relativePath)
    {
        await NodeJSON.SaveDataToFile(relativePath, this.output.innerText);
        location.reload();
    }

    UpdatePaintingAndSave(painting, groupArrayIndex, paintingArrayIndex) {
        // Access the specific group using groupArrayIndex
        let targetGroup = this.currentJSON.paintingGroups[groupArrayIndex];

        // Replace the painting in that group using paintingArrayIndex
        targetGroup.paintings[paintingArrayIndex] = painting;

        // Optional: Save the updated JSON to file.
        // (Assuming you have a method to save the JSON)

        NodeJSON.SaveDataToFile(this.currentFile, JSON.stringify(this.currentJSON));
        location.reload();
    }

    async DeletePaintingAndSave(groupArrayIndex, paintingArrayIndex) {
        // Access the specific group using groupArrayIndex
        let targetGroup = this.currentJSON.paintingGroups[groupArrayIndex];

        // Remove the painting in that group using paintingArrayIndex
        if (targetGroup.paintings && targetGroup.paintings.length > paintingArrayIndex) {
            targetGroup.paintings.splice(paintingArrayIndex, 1); // Removes the painting at the specified index
        }

        // Optional: Save the updated JSON to file.
        // (Assuming you have a method to save the JSON)
        await NodeJSON.SaveDataToFile(this.currentFile, JSON.stringify(this.currentJSON));
        location.reload();
    }

    async DeletePaintingAndSave()
    {
        console.log(this.currentFile);


        var json = await NodeJSON.GetNodeJSON("GallerysData.json");
        var galleries = json.data;
        
        for (const gallery of galleries) 
        {
            if(gallery.url == this.currentFile){
                galleries.pop(gallery);
            }
        }

        json.data = galleries;

        console.log(json);

        await NodeJSON.SaveDataToFile('GallerysData.json', JSON.stringify(json));
        location.reload();

    }



}
