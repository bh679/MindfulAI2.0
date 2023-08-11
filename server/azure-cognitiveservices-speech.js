// azure-cognitiveservices-speech.js

import sdk from 'microsoft-cognitiveservices-speech-sdk';
import { Buffer } from 'buffer';
import { PassThrough } from 'stream';
import fs from 'fs';
import ENV from './env.js';

// Extract API key from ENV
const MS_AZURE_COG_API_KEY = ENV.MS_AZURE_COG_API_KEY;

/**
 * Node.js server code to convert text to speech
 * @returns stream
 * @param {*} key your resource key
 * @param {*} region your resource region
 * @param {*} text text to convert to audio/speech
 * @param {*} filename optional - best for long text - temp file for converted speech/audio
 */
const textToSpeech = async (/*key, */region, text, language, voice, filename)=> {

    let key = MS_AZURE_COG_API_KEY;
    
    // convert callback function to promise
    return new Promise((resolve, reject) => {
        
        const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
        speechConfig.speechSynthesisOutputFormat = 5; // mp3
        speechConfig.SpeechSynthesisLanguage = language; //language
        speechConfig.SpeechSynthesisVoiceName = "en-US-JennyNeural";//voice
        
        let audioConfig = null;
        
        if (filename) {
            audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
        }
        
        const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

        synthesizer.speakTextAsync(
            text,
            result => {
                
                const { audioData } = result;

                synthesizer.close();
                
                if (filename) {
                    const audioFile = fs.createReadStream(filename);
                    resolve({ stream: audioFile, size: fs.statSync(filename).size });
                    
                } else {
                    // return stream from memory
                    const bufferStream = new PassThrough();
                    bufferStream.end(Buffer.from(audioData));
                    resolve({ stream: bufferStream, size: audioData.length });
                }
            },
            error => {
                synthesizer.close();
                reject(error);
            }); 
        });
};

//I can remove this funciotn, its export and imports
const getStreamSize = async (audioStream) => {
    return new Promise((resolve, reject) => {
        const tmpFile = `./temp/stream-size-tmp-${timeStamp()}.mp3`;
        const writeStream = fs.createWriteStream(tmpFile);
        audioStream.pipe(writeStream);

        writeStream.on('finish', () => {
            const size = fs.statSync(tmpFile).size;
            fs.unlinkSync(tmpFile);  // Clean up the temporary file
            resolve(size);
        });

        writeStream.on('error', (error) => {
            reject(error);
        });
    });
}

export { textToSpeech, getStreamSize };