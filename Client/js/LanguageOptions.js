// Represents individual language options with their details
class LanguageOption {
  constructor(englishName, localName = "", languageID = "") {
    this.englishName = englishName; // English representation of the language
    this.localName = localName;     // Local representation (not used yet)
    this.languageID = languageID;   // Identifier for the language (not used yet)
    this.platforms = [];           // Platforms that support this language
  }
}

// Manages and compiles all language options
class LanguageOptionsManager {
  constructor() {
    this.data = {};
  }

  // Fetches data from a URL and saves it
  async fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      this.data = await response.json();
    } catch (error) {
      console.error('There was a problem fetching the language options:', error);
    }
  }

  // Compiles a list of shared language options from TextToSpeech and SpeechToText
  compileSharedLanguages() {
    const languageObjects = {}; // Dictionary to hold compiled language objects
    
    // Iterate through SpeechToText languages
    for (const platform in this.data.SpeechToText) {
      this.data.SpeechToText[platform].forEach(lang => {
        if (!languageObjects[lang]) {
          languageObjects[lang] = new LanguageOption(lang);
        }
        languageObjects[lang].platforms.push(platform);
      });
    }

    // Iterate through TextToSpeech languages ensuring the language is also supported in SpeechToText
    for (const platform in this.data.TextToSpeech) {
      this.data.TextToSpeech[platform].forEach(lang => {
        if (languageObjects[lang]) { // Only add if language already exists (i.e., is shared between both)
          languageObjects[lang].platforms.push(platform);
        }
      });
    }

    // Return the compiled dictionary of shared language objects
    return languageObjects;
  }
}

// Example usage:
/*
const manager = new LanguageOptionsManager();
manager.fetchData('YOUR_URL_HERE').then(() => {
  const sharedLanguages = manager.compileSharedLanguages();
  console.log(sharedLanguages);
});
*/
