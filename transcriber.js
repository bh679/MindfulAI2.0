class Transcriber {
    constructor(apiKeyInput, statusMessage) {
        this.retryInterval = 1000;  // Start with 1 second
        this.transcriptionId = null;

        this.apiKeyInput = apiKeyInput;
        this.statusMessage = statusMessage;
    }

    // Create a Promise that resolves with the transcription
    transcribeAudio(chunks) {
        return new Promise((resolve, reject) => {
            // Create the audio file and the form data to send to the API
            const blob = new Blob(chunks, { type: 'audio/wav' });
            const file = new File([blob], 'audio.wav', { type: 'audio/wav' });
            const formData = new FormData();
            formData.append('file', file);
            formData.append('model', 'whisper-1');

            // Make the API request
            fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + this.apiKeyInput.value
                },
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('API response was not ok. Status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.text) {
                    // Resolve the Promise with the transcription
                    resolve(data.text);
                } else if (data.status === 'processing') {
                    // Store the transcription ID
                    this.transcriptionId = data.id;
                    this.checkTranscriptionStatus(resolve, reject);
                }
            })
            .catch(error => {
                this.statusMessage.innerText = 'Error occurred: ' + error.message;
                reject(error.message);
            });
        });
    }

    // Use the stored transcription ID to check the status
    checkTranscriptionStatus(resolve, reject) {
        fetch('https://api.openai.com/v1/audio/transcriptions/' + this.transcriptionId, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this.apiKeyInput.value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'completed') {
                // Resolve the Promise with the transcription
                resolve(data.transcription);
            } else {
                setTimeout(() => this.checkTranscriptionStatus(resolve, reject), this.retryInterval);
                this.retryInterval *= 2;  // Double the interval for the next retry
            }
        })
        .catch(error => {
            this.statusMessage.innerText = 'Error occurred: ' + error.message;
            reject(error.message);
        });
    }
}
