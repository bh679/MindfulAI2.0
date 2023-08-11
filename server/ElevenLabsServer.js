//ElevenLAbsServer.js
import axios from 'axios';
import ENV from './env.js';
import { textToSpeech } from './azure-cognitiveservices-speech.js';

const ELEVENLABS_API_KEY = ENV.ELEVENLABS_API_KEY;

var audioCache = new Map(); // Create a cache to store audio results

const Speak = async (req, res) => {
    console.log("Speak");
    const text = req.body.text;
    var voiceId;

    if(req.body.voiceId == null || req.body.voiceId == "")
        voiceId = '21m00Tcm4TlvDq8ikWAM';  // default voice
    else
        voiceId = req.body.voiceId;

    const cacheKey = `${text}-${voiceId}`; // Create a unique key based on text and voiceId

    // If audio data is in cache, send it
    if(audioCache.has(cacheKey)) {
        return res.send(audioCache.get(cacheKey));
    }

    console.log("VoiceId " + voiceId);

    await GetFromEleven(text, voiceId, cacheKey, res);
};

const GetFromMS = async (text, voiceId, cacheKey, res) => {

    // stream from file or memory
    if (file && file === true) {
        fileName = `./temp/stream-from-file-${timeStamp()}.mp3`;
    }

    const audioStream = await textToSpeech("australiaeast", text);
    res.set({
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked'
    });
}

const GetFromEleven = async (text, voiceId, cacheKey, res) => 
{
    const headers = {
        'Accept': 'audio/mpeg',
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
    };

    const body = JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
        }
    });

    try {
        const response = await axios.post(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, body, {
            headers: headers,
            responseType: 'arraybuffer'  // This is important for handling binary data
        });

        const audio = Buffer.from(response.data, 'binary');

        audioCache.set(cacheKey, audio); // Store the audio data in cache

        res.send(audio);
    } catch(err) {
        // Handle any error that occurred during the API call
        console.error("Error fetching audio:", err);
        res.status(500).send('Failed to generate audio');
    }
}

// Function to reset the cache
const ResetCache = () => {
    audioCache.clear();
    console.log("Audio cache has been cleared");
};

export { Speak, ResetCache };