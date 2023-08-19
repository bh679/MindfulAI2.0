//jsonHandler.js
const fs = require('fs');
const path = require('path');

const sendJSON = (rootFolderPath, req, res) => {
    const filePath = path.join(rootFolderPath, req.query.filename);

    if (!filePath.startsWith(rootFolderPath)) {
        return res.status(400).send('Invalid file path');
    }

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    } catch (error) {
        console.error(`Error reading file from disk: ${error}`);
        res.status(500).send('Error reading data.');
    }
}

const receiveAndStoreJSON = (rootFolderPath, req, res) => {
    const filePath = path.join(rootFolderPath, req.query.filename);

    if (!filePath.startsWith(rootFolderPath)) {
        return res.status(400).send('Invalid file path');
    }

    try {
        let message = 'Data saved successfully.';
        
        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            message = 'File not found. Creating and saving data.';
        }
        
        const stringifiedData = JSON.stringify(req.body, null, 4);
        fs.writeFileSync(filePath, stringifiedData, 'utf8');
        
        res.send(message);
    } catch (error) {
        console.error(`Error writing file to disk: ${error}`);
        res.status(500).send('Error writing data.');
    }
}


module.exports = {
    sendJSON,
    receiveAndStoreJSON
};
