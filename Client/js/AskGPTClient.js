//AskGPT - Client
async function AskGPT(input)
{
    try {
        console.log("progressInterval = setInterval(async function(){\n                try {");

        // Make POST request to updateUnFake
        const response = await fetch('https://brennan.games:3000/AskGPT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: input }),
        });
        
        // Parse response data
        const data = await response.json();

        return data.generatedText;

    } catch(error) {
        // If an error occurs, log it and update loading element
        console.error("Error fetching update: ", error);

        return "Server unresponsive...";
    }
}