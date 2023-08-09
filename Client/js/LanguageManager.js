//LanguageManager.cs

class LanguageManager
{
	constructor(dropDown, title)
	{
		this.dropDown = dropDown;
		this.title = title;
		this.currentLanguage = "English"

		this.populateDropdown();
		this.addDropdownListeners();
		this.UpdateTitle();

		//this.languagePrompt = ". Respond in English";		
	}

	languagePrompt()
	{
		return ". Respond in" + this.currentLanguage+". ";
	}

	UpdateTitle()
	{
		this.title.innerHTML = globe2 + " Language: " + this.currentLanguage;
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
        this.currentLanguage = language;
        
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

class Phrases
{
	constructor()
	{
		this.startrecording;
		this.stoprecording;
		this.processing;
		this.responding;
		this.language;
	}
}