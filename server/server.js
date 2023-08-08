
// Required libraries
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import express from 'express';
import https from 'https';

// Define HTTPS credentials using the File System (fs) to read the key and certificate files
const options = {
  key: fs.readFileSync('/opt/bitnami/apache/conf/mindfulai.equalreality.com.key'),   // Path to private key
  cert: fs.readFileSync('/opt/bitnami/apache/conf/mindfulai.equalreality.com.crt')   // Path to certificate file
};

// Create an instance of an Express application
const app = express();

let promptResponse = {};

//API's
import PromptGPT from './PromptGPT.js';
import { Speak, ResetCache } from './ElevenLabsServer.js'; 
import Transcribe from './WhisperTranscriberServer.js';


// Use cors middleware for handling Cross-Origin Resource Sharing
app.use(cors());

// Tell Express to parse JSON in the body of incoming requests.
app.use(express.json());

// Log all incoming requests
app.use(function(req, res, next) {
    console.log(`${req.method} request for '${req.url}'`);
    next();  // Pass control to the next middleware function
});

// Use the 'Speak' function as a route handler for the '/Speak' route - Eleven Labs
app.post('/Speak', Speak);

//Use the 'Transcribe' function as a route handler for the '/Transcribe' route - Whisper OpenAI
app.post('/Transcribe', Transcribe);

// Restart the server
app.get('/Restart', function (req, res) {
    //Restart();
});

// Call to GPT for older version of JudgeGPT
app.post('/AskGPT', function (req, res) {
    // Log the body of the request
    console.log(req.body);

    // Extract youtubeId from the request body
    const prompt = req.body.prompt;

    // Log the prompt
    console.log(prompt);

    // Create a new OpenAI Reponse with prompt
    promptResponse[prompt] = new PromptGPT(prompt);

    // Get the response 
    promptResponse[prompt].AskGPT().then((data) => {
        console.log(data);
        console.log(data.generatedText);
        res.json({ //why not make res.json = data
            generatedText: data.generatedText,
            inputPrompt: data.inputPrompt
        });
    })
    .catch((error) => {
        // If there is an error, log it and send a response
        console.error(error);
        res.json("error");
    });

});

// Define the port and HTTPS server options
const port = 3000;  // Define server port. Note: HTTPS servers typically use port 443 by default.

// Create and start the HTTPS server
var server = https.createServer(options, app).listen(port, () => {
    console.log(`Secure server is running on port ${port}`);
});