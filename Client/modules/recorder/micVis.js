const wave = document.querySelector(".wave");
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const microphone = audioContext.createMediaStreamSource(stream);

const statusMessage = document.querySelector(".status-message"); // You'll need to add a status message element in your HTML

const recorder = new Recorder(statusMessage);

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    microphone.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 2048; // Fast Fourier Transform size
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function updateWave() {
      analyser.getByteTimeDomainData(dataArray);
      let sum = dataArray.reduce((acc, val) => acc + val, 0);
      let average = sum / bufferLength;
      let scaleY = average / 128; // Adjust this for better visualization
      wave.style.height = `${scaleY * 100}%`;
      
      requestAnimationFrame(updateWave);
    }

    updateWave();

    // Adding event listener to toggle recording when clicking on the wave container
    wave.addEventListener("click", () => {
      recorder.toggleRecording((chunk) => {
        // Here, you can do something with the recorded audio chunk, like sending it for transcription
        console.log("Recording chunk:", chunk);
      });
    });
  })
  .catch((error) => {
    console.error("Error accessing microphone:", error);
  });
