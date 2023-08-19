//NodeJSON.js
//https://chat.openai.com/share/e1006f7c-fdaf-45ac-9ff5-ac74b01648b8

class NodeJSON {
    static BASE_URL = "https://mindfulai.equalreality.com:3000";

    static GetNodeJSON(relativePath) {
        const url = `${NodeJSON.BASE_URL}/jsonData?filename=${relativePath}`;
        return fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(JSON.stringify(data, null, 4));
                return data;
            })
            .catch(error => {
                console.error('Error fetching gallery data:', error);
                throw error;  // To propagate the error to further chained promises
            });
    }
}