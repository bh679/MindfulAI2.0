//https://chat.openai.com/share/cd8628b6-1fed-4028-af5a-882bb8a436b7
//https://chat.openai.com/share/ca60ea94-5709-4675-8563-96d220fa6b52 
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class Transcriber {
    constructor(apiKeyInput, statusMessage) {
        this.retryInterval = 1000;  // Start with 1 second
        this.transcriptionId = null;

        this.apiKeyInput = apiKeyInput;
        this.statusMessage = statusMessage;
    }

    // Create a Promise that resolves with the transcription
    async transcribeAudio(chunks) {
        // Create the audio file and the form data to send to the API
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], 'audio.wav', { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', 'whisper-1');

        // Make the API request
        try {
            const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
                headers: {
                    'Authorization': 'Bearer ' + this.apiKeyInput,
                    ...formData.getHeaders()
                }
            });

            const data = response.data;
            if (data.text) {
                // Resolve the Promise with the transcription
                return data.text;
            } else if (data.status === 'processing') {
                // Store the transcription ID
                this.transcriptionId = data.id;
                return this.checkTranscriptionStatus();
            }
        } catch (error) {
            this.statusMessage = 'Error occurred: ' + error.message;
            throw error;
        }
    }

    // Use the stored transcription ID to check the status
    async checkTranscriptionStatus() {
        try {
            const response = await axios.get('https://api.openai.com/v1/audio/transcriptions/' + this.transcriptionId, {
                headers: {
                    'Authorization': 'Bearer ' + this.apiKeyInput
                }
            });

            const data = response.data;
            if (data.status === 'completed') {
                // Resolve the Promise with the transcription
                return data.transcription;
            } else {
                setTimeout(() => this.checkTranscriptionStatus(), this.retryInterval);
                this.retryInterval *= 2;  // Double the interval for the next retry
            }
        } catch (error) {
            this.statusMessage = 'Error occurred: ' + error.message;
            throw error;
        }
    }
}

module.exports = Transcriber;