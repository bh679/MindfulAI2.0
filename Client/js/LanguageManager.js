//LanguageManager.cs

const DEFAULT_LANGUAGE_KEY = 'en'; // This variable will hold the key for English.

class LanguageManager
{
	constructor(dropDown, title)
	{
		this.dropDown = dropDown;
		this.title = title;

		// Example usage:
		this.phrases = new Phrases(
		    document.getElementById("recordButtonTxt"),
		    document.getElementById("recordButtonTxt"),
		    document.getElementById("recordButtonTxt"),
		    document.getElementById("recordButtonTxt"),
		    document.getElementById("languageTxt")
		);

		// Load translations from a remote JSON file:
		this.phrases.loadDataFromJSON('./js/language.json').then(() => {
		    // Once data is loaded, you can set the desired language:
		    this.phrases.setLanguage(DEFAULT_LANGUAGE_KEY);
		});

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
		this.title.innerHTML = globe2 + this.phrases.language.currentValue + ": "+ this.phrases.currentLanguage.currentValue;
	}

	populateDropdown() {
        // Example: List of languages. You can fetch this from a server or any other source.
        const languages = ["台灣中文 (comnig)", "English", "Español (comnig)", "Français (comnig)", "हिंदी (comnig)", "Italiano (comnig)", "Deutsch (comnig)", "Polski (comnig)", "Português (comnig)"];

        this.dropDown.innerHTML = "";  // Clear the dropdown first
        for (let lang of languages) {
            let item = document.createElement("a");
            item.classList.add("dropdown-item");
            item.href = "#";
            item.innerText = lang;
            this.dropDown.appendChild(item);
        }
    }

    addDropdownListeners() {
        // Attach click listeners to dropdown items
        this.dropDown.addEventListener("click", (event) => {
            if (event.target.classList.contains("dropdown-item")) {
                this.changeLanguage(event.target.innerText);
            }
        });
    }

    changeLanguage(language) {
        //this.currentLanguage = language;
        
        // Highlight the selected language in the dropdown
        for (let item of this.dropDown.children) {
            if (item.innerText === language) {
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
    constructor(startrecordingDiv, stoprecordingDiv, processingDiv, respondingDiv, languageDiv) {
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
        this.language = new LanguageDiv(languageDiv, {
            [DEFAULT_LANGUAGE_KEY]: "Language",
            // Add other languages here...
        });
        this.currentLanguage = new LanguageDiv(languageDiv, {
            [DEFAULT_LANGUAGE_KEY]: "English",
            // Add other languages here...
        });
    }

    setLanguage(language) {
        this.startrecording.setLanguage(language);
        this.stoprecording.setLanguage(language);
        this.processing.setLanguage(language);
        this.responding.setLanguage(language);
        this.language.setLanguage(language);
        this.currentLanguage.setLanguage(language);
    }

    async loadDataFromJSON(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();

            this.startrecording.languages = data.startrecording;
            this.stoprecording.languages = data.stoprecording;
            this.processing.languages = data.processing;
            this.responding.languages = data.responding;
            this.language.languages = data.language;
            this.currentLanguage.languages = data.language;
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