//LanguageManager.cs

const DEFAULT_LANGUAGE_KEY = 'en'; // This variable will hold the key for English.

class LanguageManager
{
	constructor(dropDown, title)
	{
		this.dropDown = dropDown;
		this.title = title;
		this.currentLanguage = null;

		this.init();
		
	}

	async init()
	{


		this.optionsManager = new LanguageOptionsManager();
		await this.optionsManager.fetchData('./js/languageOptions.json');

		// Example usage:
		this.phrases = new Phrases(
		    document.getElementById("recordButtonTxt"),
		    document.getElementById("recordButtonTxt"),
		    document.getElementById("recordButtonTxt"),
		    document.getElementById("recordButtonTxt"),
		    document.getElementById("recordButtonTxt"),
		    document.getElementById("languageTxt"),
		    document.getElementById("appTxt"),
		    document.getElementById("feedbackTxt"),
		    document.getElementById("aboutTxt")
		);

		// Load translations from a remote JSON file:
		await this.phrases.loadDataFromJSON('./js/language.json')

		this.phrases.setLanguage(DEFAULT_LANGUAGE_KEY);
        this.currentLanguage = this.getLanguage(DEFAULT_LANGUAGE_KEY);
		

		this.populateDropdown();
		this.addDropdownListeners();
		this.UpdateTitle();	
	}

	languagePrompt()
	{
		return ". Respond in" + this.phrases.currentLanguage.currentValue+". ";
	}

	UpdateTitle()
	{
		this.title.innerHTML = globe2 + " " + this.phrases.language.currentValue + ": "+ this.phrases.currentLanguage.currentValue;
	}

	populateDropdown() {
	    this.dropDown.innerHTML = "";  // Clear the dropdown first

	    // Iterate through the keys of this.phrases.language to populate the dropdown
	    for (let langKey in this.phrases.currentLanguage.languages) {
	        let item = document.createElement("a");
	        item.classList.add("dropdown-item");
	        item.href = "#";
	        
	        // Use the key lookup to get the language name
	        item.innerText = this.phrases.currentLanguage.languages[langKey];
	        item.setAttribute("data-lang", langKey);

	        this.dropDown.appendChild(item);
	    }
	}

	/**
     * Returns a language based on its ID.
     * @param {string} languageId - The ID of the desired language.
     * @return {LanguageOption | null} - Returns the LanguageOption object if found, otherwise returns null.
     */
    getLanguage(languageId) {

    	if(this.optionsManager.languageOptions[languageId] == null)
    	{
        	console.log("Cant find language " + languageId);
    		return null;
		}

    	return this.optionsManager.languageOptions[languageId];
    }

	/**
     * Checks if a given language supports a specific platform.
     * @param {string} targetPlatform - The name of the platform to check against.
     * @return {boolean} - Returns true if the language supports the platform, otherwise false.
     */
    isLanguageSupportedForPlatform(targetPlatform) {
        if (this.currentLanguage) {
            return this.currentLanguage.platforms.includes(targetPlatform);
        }
        return false;
    }

    addDropdownListeners() {
        // Attach click listeners to dropdown items
        this.dropDown.addEventListener("click", (event) => {
            if (event.target.classList.contains("dropdown-item")) {
            	console.log(event.target.getAttribute("data-lang"));
                this.changeLanguage(event.target.getAttribute("data-lang"));
            }
        });
    }

    changeLanguage(language) {
        this.currentLanguage = this.getLanguage(language);
		this.phrases.setLanguage(language);
        
        // Highlight the selected language in the dropdown
        for (let item of this.dropDown.children) {
            if (item.getAttribute("data-lang") === language) {
                item.classList.add("bg-secondary");
            } else {
                item.classList.remove("bg-secondary");
            }
        }

		this.UpdateTitle();
    }

}


// Usage
document.addEventListener("DOMContentLoaded", function() {
    const dropDown = document.getElementById("languageDropdown");
    const title = document.querySelector(".nav-link.dropdown-toggle");
    
    const languageManager = new LanguageManager(dropDown, title);
});





class Phrases {
    constructor(startrecordingDiv, stoprecordingDiv, processingDiv, respondingDiv, speakingDiv, languageDiv, appDiv, feedbackDiv, aboutDiv) {
        this.startrecording = new LanguageDiv(startrecordingDiv, {
            [DEFAULT_LANGUAGE_KEY]: "Ask Me Something!",
            // Add other languages here...
        });
        this.stoprecording = new LanguageDiv(stoprecordingDiv, {
            [DEFAULT_LANGUAGE_KEY]: "I'm Done Asking.",
            // Add other languages here...
        });
        this.processing = new LanguageDiv(processingDiv, {
            [DEFAULT_LANGUAGE_KEY]: "Processing",
            // Add other languages here...
        });
        this.responding = new LanguageDiv(respondingDiv, {
            [DEFAULT_LANGUAGE_KEY]: "Responding",
            // Add other languages here...
        });
        this.speaking = new LanguageDiv(speakingDiv, {
            [DEFAULT_LANGUAGE_KEY]: "Responding",
            // Add other languages here...
        });
        this.language = new LanguageDiv(languageDiv, {
            [DEFAULT_LANGUAGE_KEY]: "Language",
            // Add other languages here...
        });
        this.currentLanguage = new LanguageDiv(languageDiv, {
            [DEFAULT_LANGUAGE_KEY]: "English",
            // Add other languages here...
        });
        this.app = new LanguageDiv(languageDiv, {
            [DEFAULT_LANGUAGE_KEY]: "English",
            // Add other languages here...
        });
        this.app = new LanguageDiv(appDiv, {
            [DEFAULT_LANGUAGE_KEY]: "App",
            // Add other languages here...
        });
        this.feedback = new LanguageDiv(feedbackDiv, {
            [DEFAULT_LANGUAGE_KEY]: "Feedback",
            // Add other languages here...
        });
        this.about = new LanguageDiv(aboutDiv, {
            [DEFAULT_LANGUAGE_KEY]: "About",
            // Add other languages here...
        });
    }

    setLanguage(language) {
        this.startrecording.setLanguage(language);
        this.stoprecording.setLanguage(language);
        this.processing.setLanguage(language);
        this.responding.setLanguage(language);
        this.speaking.setLanguage(language);
        this.language.setLanguage(language);
        this.currentLanguage.setLanguage(language);
        this.app.setLanguage(language);
        this.feedback.setLanguage(language);
        this.about.setLanguage(language);
    }

    async loadDataFromJSON(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

            this.startrecording.languages = data.startrecording;
            this.stoprecording.languages = data.stoprecording;
            this.processing.languages = data.processing;
            this.responding.languages = data.responding;
            this.speaking.languages = data.speaking;
            this.language.languages = data.language;
            this.currentLanguage.languages = data.currentLanguage;
            this.app.languages = data.app;
            this.feedback.languages = data.feedback;
            this.about.languages = data.about;
        } catch (error) {
            console.error("Error loading data from JSON:", error);
        }
    }
}

class LanguageDiv {
    constructor(div, languages) {
        this.div = div;
        this.languages = languages;
        this.currentValue;
        
        // Set default language initially.
        this.setLanguage(DEFAULT_LANGUAGE_KEY);
    }

    setLanguage(language) {
        if (this.languages[language]) {

            if(this.div != null && (this.div.textContent == "" || this.div.textContent == this.currentValue))
            	this.div.textContent = this.languages[language];
            this.currentValue = this.languages[language];
        } else {
            console.error(`Language ${language} not supported for this div.`);
        }
    }
}





// Example JSON structure:
/*
{
    "startrecording": {
        "en": "Ask Me Something!",
        "es": "¡Pregúntame algo!"
        // ... other translations
    },
    "stoprecording": {
        "en": "I'm Done Asking.",
        "es": "He terminado de preguntar."
        // ... other translations
    },
    "processing": {
        "en": "Processing",
        "es": "Procesando"
        // ... other translations
    },
    "responding": {
        "en": "Responding",
        "es": "Respondiendo"
        // ... other translations
    },
    "language": {
        "en": "Language",
        "es": "Idioma"
        // ... other translations
    }
}
*/