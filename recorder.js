class Recorder {
    constructor(apiKeyInput, recordButton, statusMessage, transcriptionDiv) {
        this.chunks = [];
        this.recorder = null;
        this.audioSize = 0;
        this.transcriptionId = null;  // Initialize the transcription ID
        this.retryInterval = 1000;  // Start with 1 second

        this.apiKeyInput = apiKeyInput;
        this.recordButton = recordButton;
        this.statusMessage = statusMessage;
        this.transcriptionDiv = transcriptionDiv;
    }

     toggleRecording(onStopCallback) {
        // Check if we're currently recording
        if (this.recorder && this.recorder.state === 'recording') {
            // Update the status message before stopping the recording
            this.statusMessage.innerText = 'Stopped recording. Audio file size: ' + this.audioSize.toFixed(2) + ' KB';
            // Stop the recording
            this.recorder.stop();
            this.recordButton.innerText = 'Start Recording';
        } else {
            // Request permissions and start recording
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    this.recorder = new MediaRecorder(stream);
                    
                    // Setup the data handling
                    this.recorder.ondataavailable = e => {
                        this.chunks.push(e.data);
                        this.audioSize += e.data.size / 1024;  // convert bytes to kilobytes
                    };
                    this.recorder.onstop = onStopCallback;
                    
                    // Start the recording
                    this.recorder.start();
                    this.recordButton.innerText = 'Stop Recording';
                    this.statusMessage.innerText = 'Recording';
                })
                .catch(() => {
                    this.statusMessage.innerText = 'Microphone not accessed';
                });
        }
    }
}

