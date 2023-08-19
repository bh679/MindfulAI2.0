//jsonHandler.js
//https://chat.openai.com/share/5741dd6d-ce8f-4fbb-98a7-e0e609bc7c8a

import fs from 'fs';
import path from 'path';

const sendJSON = (dataFolderPath, req, res) => {
    const absoluteDataFolderPath = path.resolve(dataFolderPath);
    const filePath = path.join(absoluteDataFolderPath, req.query.filename);

    console.log("getting json data");

    if (!filePath.startsWith(absoluteDataFolderPath)) {
        console.log('Invalid file path ' + filePath);
        return res.status(400).send('Invalid file path');
    }

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        console.log(jsonData);
        res.json(jsonData);
    } catch (error) {
        console.error(`Error reading file from disk: ${error}`);
        res.status(500).send('Error reading data.');
    }
}

const receiveAndStoreJSON = (dataFolderPath, req, res) => {
    console.log("Incoming request body:", req.body.json);
    const absoluteDataFolderPath = path.resolve(dataFolderPath);
    const filePath = path.join(absoluteDataFolderPath, req.body.filename);

    console.log(req.body);

    if (!filePath.startsWith(absoluteDataFolderPath)) {
        return res.status(400).send('Invalid file path');
    }

    try {
        let message = 'Data saved successfully.';
        
        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            message = 'File not found. Creating and saving data.';
        }
        
        //const stringifiedData = JSON.stringify(req.body.json, null, 4);
        fs.writeFileSync(filePath, req.body.json, 'utf8');
        
        res.send(message);
    } catch (error) {
        console.error(`Error writing file to disk: ${error}`);
        res.status(500).send('Error writing data.');
    }
}

export { sendJSON, receiveAndStoreJSON };
