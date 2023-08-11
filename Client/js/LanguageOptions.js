/**
 * Represents a single language option.
 */
class LanguageOption {
  constructor(englishLanguageName, id, APIKey) {
    /** Name of the language in English. */
    this.englishLanguageName = englishLanguageName;
    
    /** Language ID (not used yet). */
    this.id = id;

    this.APIKey = APIKey;
    
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
            // Comparing language IDs
            sttLanguage.id.some(sttId => {
              return ttsLanguage.id.includes(sttId);
            }) 
            {
              if (!this.languageOptions[ttsLanguage.id]) {
                this.languageOptions[ttsLanguage.id] = new LanguageOption(ttsLanguage.name, ttsLanguage.id, ttsLanguage.APIKey);
              }
              if (!this.languageOptions[ttsLanguage.id].platforms.includes(platform)) {
                this.languageOptions[ttsLanguage.id].platforms.push(platform);
              }
              if (!this.languageOptions[ttsLanguage.id].platforms.includes(ttsPlatform)) {
                this.languageOptions[ttsLanguage.id].platforms.push(ttsPlatform);
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
