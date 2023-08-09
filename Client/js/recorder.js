//recorder.js
//https://chat.openai.com/share/ca60ea94-5709-4675-8563-96d220fa6b52
class Recorder {
    constructor(statusMessage) {
        this.chunk = null;
        this.recorder = null;
        this.audioSize = 0;
        this.transcriptionId = null;  // Initialize the transcription ID
        this.retryInterval = 1000;  // Start with 1 second
        this.statusMessage = statusMessage;
    }

     toggleRecording(onStopCallback) {
        // Check if we're currently recording
        if (this.recorder && this.recorder.state === 'recording') {
            // Update the status message before stopping the recording
            this.statusMessage.innerText = 'Stopped recording. Audio file size: ' + this.audioSize.toFixed(2) + ' KB';
            // Stop the recording
            this.recorder.stop();
        } else {
            // Request permissions and start recording
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    this.recorder = new MediaRecorder(stream);
                    
                    // Setup the data handling
                    this.recorder.ondataavailable = e => {
                        this.chunk = e.data;
                        this.audioSize = e.data.size / 1024;  // convert bytes to kilobytes
                    };
                    this.recorder.onstop = () => {
                        onStopCallback(this.chunk);
                        // Reset chunk and audioSize after each recording
                        this.chunk = null;
                        this.audioSize = 0;
                    };
                    
                    // Start the recording
                    this.recorder.start();
                    this.statusMessage.innerText = 'Recording';
                })
                .catch(() => {
                    this.statusMessage.innerText = 'Microphone not accessed';
                });
        }
    }
}

