//server.js
// https://chat.openai.com/share/90ebe55e-bd60-47cf-b290-272980b7495e --getting imports working with nodejs.18

// Required libraries
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import express from 'express';
import range from 'express-range';
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
import { textToSpeech, getStreamSize } from './azure-cognitiveservices-speech.js';
import { sendJSON, receiveAndStoreJSON } from './jsonHandler.js';


// Use cors middleware for handling Cross-Origin Resource Sharing
app.use(cors());

// Tell Express to parse JSON in the body of incoming requests.
app.use(express.json());

// Use the express-range middleware
app.use(range({ accept: 'bytes' }));

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

// creates a temp file on server, the streams to client
/* eslint-disable no-unused-vars */
app.get('/text-to-speech', range({ accept: 'bytes' }), async (req, res, next) => {

    const { phrase, language, voice, file } = req.query;
    
    if (!phrase) return res.status(404).send('Invalid query string');
    
    let fileName = null;

    // Fetch the audio stream
    const { stream: audioStream, size: audioStreamSize } = await textToSpeech("australiaeast", phrase, language, voice);


    // Get file size
    //const audioStreamSize = await getStreamSize(audioStream); // Assuming you implement a function to get stream size

    const range = req.range(audioStreamSize);

    if (range && range.type === 'bytes' && range.length === 1) {
        const { start, end } = range[0];
        const chunkSize = (end - start) + 1;
        res.setHeader('Content-Range', `bytes ${start}-${end}/${audioStreamSize}`);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Length', chunkSize);
        res.setHeader('Content-Type', 'audio/mpeg');
        res.status(206);  // Status for Partial Content
        audioStream.pipe(res);
    } else {
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Transfer-Encoding', 'chunked');
        audioStream.pipe(res);
    }
});


app.get('/ping', function (req, res) {
    res.json({ status: 'Server is running!' });
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

// Set rootFolderPath (Make sure this path is correct according to your directory structure)
const dataFolderPath = './data';

// Using sendJSON with rootFolderPath for the '/data' route
app.get('/jsonData', (req, res) => sendJSON(dataFolderPath, req, res));

// Using receiveAndStoreJSON with rootFolderPath for the '/data' route
app.post('/saveJSONData', (req, res) => receiveAndStoreJSON(dataFolderPath, req, res));


// Define the port and HTTPS server options
const port = 3000;  // Define server port. Note: HTTPS servers typically use port 443 by default.

// Create and start the HTTPS server
var server = https.createServer(options, app).listen(port, () => {
    console.log(`Secure server is running on port ${port}`);
});