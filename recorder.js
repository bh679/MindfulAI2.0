// Initialize the array to hold the audio chunks and the MediaRecorder object
let chunks = [];
let recorder;
let audioSize = 0;
let transcriptionId = null;  // Initialize the transcription ID

// Get the elements from the page
const apiKeyInput = document.getElementById('apiKey');
const recordButton = document.getElementById('recordButton');
const statusMessage = document.getElementById('statusMessage');
const transcriptionDiv = document.getElementById('transcription');

// When the record button is clicked
recordButton.onclick = function() {
    // Check if we're currently recording
    if (recorder && recorder.state === 'recording') {
        // Update the status message before stopping the recording
        statusMessage.innerText = 'Stopped recording. Audio file size: ' + audioSize.toFixed(2) + ' KB';
        // Stop the recording
        recorder.stop();
        recordButton.innerText = 'Start Recording';
    } else {
        // Request permissions and start recording
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                recorder = new MediaRecorder(stream);
                
                // Setup the data handling
                recorder.ondataavailable = e => {
                    chunks.push(e.data);
                    audioSize += e.data.size / 1024;  // convert bytes to kilobytes
                };
                recorder.onstop = sendDataToOpenAI;
                
                // Start the recording
                recorder.start();
                recordButton.innerText = 'Stop Recording';
                statusMessage.innerText = 'Recording';
            })
            .catch(() => {
                statusMessage.innerText = 'Microphone not accessed';
            });
    }
};
