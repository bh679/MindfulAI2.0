class Transcriber {
    constructor(apiKeyInput, statusMessage, transcriptionDiv) {
        this.retryInterval = 1000;  // Start with 1 second
        this.transcriptionId = null;
        this.apiKeyInput = apiKeyInput;
        this.statusMessage = statusMessage;
        this.transcriptionDiv = transcriptionDiv;
    }

    sendDataToOpenAI(chunks, audioSize) {
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
            this.statusMessage.innerText = 'Received response from OpenAI. Status: ' + response.status + '. Audio file size: ' + audioSize.toFixed(2) + ' KB';
            return response.json();
        })
        .then(data => {
            this.statusMessage.innerText = 'Parsing response data. data.status: '+data.status+' Audio file size: ' + audioSize.toFixed(2) + ' KB';
            if (data.status === 'completed') {
                this.transcriptionDiv.innerText = data.transcription;
            } else if (data.status === 'processing') {
                // Store the transcription ID
                this.transcriptionId = data.id;
                this.statusMessage.innerText = "Processing transcriptionId: "+ this.transcriptionId + ' Transcription not ready, polling again in ' + this.retryInterval / 1000 + ' seconds. Audio file size: ' + audioSize.toFixed(2) + ' KB';
                setTimeout(this.checkTranscriptionStatus.bind(this), this.retryInterval);
                this.retryInterval *= 2;  // Double the interval for the next retry
            }
        })
        .catch(error => {
            this.statusMessage.innerText = 'Error occurred: ' + error.message + '. Audio file size: ' + audioSize.toFixed(2) + ' KB';
        });
    }

    checkTranscriptionStatus() {
        // Use the stored transcription ID to check the status
        fetch('https://api.openai.com/v1/audio/transcriptions/' + this.transcriptionId, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this.apiKeyInput.value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'completed') {
                this.transcriptionDiv.innerText = data.transcription;
            } else {
                this.statusMessage.innerText = 'Transcription not ready, polling again in ' + this.retryInterval / 1000 + ' seconds. Audio file size: ' + audioSize.toFixed(2) + ' KB';
                setTimeout(this.checkTranscriptionStatus.bind(this), this.retryInterval);
                this.retryInterval *= 2;  // Double the interval for the next retry
            }
        })
        .catch(error => {
            this.statusMessage.innerText = 'Error occurred: ' + error.message + '. Audio file size: ' + audioSize.toFixed(2) + ' KB';
        });
    }
}
