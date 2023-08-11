//MicrosoftCognitiveServicesTextToSpeech.js
class MSSpeechService {
  constructor() {
    this.serverSrc = "https://mindfulai.equalreality.com:3000/text-to-speech";
    this.audioType = "audio/mpeg";
  }

  async Speak(text, voice, language, callBack) {
    // Construct the URL based on input
    const url = `${this.serverSrc}?phrase=${encodeURIComponent(text)}&language=${encodeURIComponent(language)}&voice=${encodeURIComponent(voice)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const blob = await response.blob();
      const audioURL = window.URL.createObjectURL(blob);
      
      const audioElement = new Audio(audioURL);
      audioElement.addEventListener("ended", callBack);
      audioElement.play();

      // If you want to return the audio URL or some other data to the caller, you can do so here.
      return audioURL;

    } catch (error) {
      console.error("There was a problem with the fetch operation:", error.message);
      throw error;
    }
  }
}

// Usage
const speechService = new MSSpeechService();
/*speechService.Speak("Hello World", "en-US", () => {
  console.log("Speech finished playing");
}).catch(err => {
  console.error("Error:", err.message);
});*/
