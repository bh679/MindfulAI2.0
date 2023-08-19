//DataManager.js
//https://chat.openai.com/share/5741dd6d-ce8f-4fbb-98a7-e0e609bc7c8a

//import { NodeJSON } from '../modules/NodeJSON/NodeJSON.js';



class AdminDataEditor
{


    constructor()
    {
        this.output = document.getElementById('output');
        this.saveButton = document.getElementById('saveButton');
        this.currentJSON = ""
    }

    Start()
    {
        NodeJSON.GetNodeJSON("GallerysData.json").then(data => {
            this.CreateButtons(data.data);//output.textContent = JSON.stringify(data, null, 4);
        }).catch(error => {
            // Handle any error that wasn't caught in GetNodeJSON
        });
    }

    CreateButtons(galleries) {
        const container = document.getElementById('buttonsContainer');

        galleries.forEach(gallery => {
            const button = document.createElement('button');
            button.textContent = gallery.id;
            button.addEventListener('click', () => {
                this.DisplayGalleryData(gallery.url);
                this.saveButton.onclick = () => {
                    adminDataEditor.Save(gallery.url);
                };

            });
            container.appendChild(button);
        });
    }

    DisplayGalleryData(relativePath) {
        // Usage:
        NodeJSON.GetNodeJSON(relativePath).then(data => {
            this.currentJSON = data;
            this.output.textContent = JSON.stringify(data, null, 4);
        }).catch(error => {
            // Handle any error that wasn't caught in GetNodeJSON
        });
    }


    Save(relativePath)
    {
        console.log(relativePath + " \n" + this.output.innerText);
        NodeJSON.SaveDataToFile(relativePath, this.output.innerText);
    }

}

var adminDataEditor = new AdminDataEditor();
document.addEventListener('DOMContentLoaded', function() {
    adminDataEditor.Start();
});
