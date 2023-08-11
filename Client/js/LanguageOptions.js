/**
 * Represents a single language option.
 */
class LanguageOption {
  constructor(englishLanguageName) {
    /** Name of the language in English. */
    this.englishLanguageName = englishLanguageName;
    
    /** Language ID (not used yet). */
    this.languageID = null;
    
    /** List of platforms that support this language. */
    this.platforms = [];
  }
}

/**
 * Manages language options and operations related to them.
 */
class LanguageOptionsManager {
  constructor() {
    /** Dictionary to store the LanguageOption objects. */
    this.languageOptions = {};
  }

  /** 
     * Fetches data from a URL and saves it.
     * @param {string} url - The URL to fetch data from.
     */
  async fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      this.data = await response.json();
      this.processSharedLanguages(this.data);
      console.log(this.languageOptions);

    } catch (error) {
      console.error('There was a problem fetching the language options:', error);
    }
  }

  /**
   * Processes shared languages from provided data.
   * @param {Object} data - The data containing language options for platforms.
   */
  processSharedLanguages(data) {
    const speechToTextPlatforms = data.SpeechToText || {};
    const textToSpeechPlatforms = data.TextToSpeech || {};

    for (let platform in speechToTextPlatforms) {
      speechToTextPlatforms[platform].forEach(sttLanguage => {
        for (let ttsPlatform in textToSpeechPlatforms) {
          textToSpeechPlatforms[ttsPlatform].forEach(ttsLanguage => {
            if (ttsLanguage.toLowerCase().includes(sttLanguage.toLowerCase()) || sttLanguage.toLowerCase().includes(ttsLanguage.toLowerCase())) {
              if (!this.languageOptions[ttsLanguage]) {
                this.languageOptions[ttsLanguage] = new LanguageOption(ttsLanguage);
              }
              if (!this.languageOptions[ttsLanguage].platforms.includes(platform)) {
                this.languageOptions[ttsLanguage].platforms.push(platform);
              }
              if (!this.languageOptions[ttsLanguage].platforms.includes(ttsPlatform)) {
                this.languageOptions[ttsLanguage].platforms.push(ttsPlatform);
              }
            }
          });
        }
      });
    }
    return this.languageOptions;
  }
}

// Example usage:
//const manager = new LanguageOptionsManager();
//manager.fetchData('YOUR_URL_HERE'); // Replace 'YOUR_URL_HERE' with the URL you want to fetch data from.
