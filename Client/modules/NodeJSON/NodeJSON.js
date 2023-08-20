//NodeJSON.js
//https://chat.openai.com/share/e1006f7c-fdaf-45ac-9ff5-ac74b01648b8

class NodeJSON {
    static BASE_URL = "https://mindfulai.equalreality.com:3000";

    static GetNodeJSON(relativePath) {
        const url = `${NodeJSON.BASE_URL}/jsonData?filename=${relativePath}`;
        console.log(url);
        return fetch(url)
            .then(response => response.json())
            .then(data => {
                //console.log(JSON.stringify(data, null, 4));
                return data;
            })
            .catch(error => {
                console.error('Error fetching gallery data:', error);
                throw error;  // To propagate the error to further chained promises
            });
    }
    
    // Method to save data to a file
    static async SaveDataToFile(filename, data) {
        const url = `${NodeJSON.BASE_URL}/saveJSONData`;

        const requestBody = {
            filename: filename,
            json: data
        };

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)  // <-- This line changed, stringifying the whole request body
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();  // We're expecting a string message from the server
        })
        .then(message => {
            console.log(message);
            return message;
        })
        .catch(error => {
            console.error('Error saving data to file:', error);
            throw error;
        });
    }

}