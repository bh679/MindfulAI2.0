const hash = window.location.hash.substring(1);  // "section1"

console.log(hash);

class DataFetcher {
    constructor(url) {
        this.url = url;
        this.data = {};  // Initialize as an empty dictionary
    }

    async fetchData() {
        try {
            const response = await fetch(this.url);

            console.log(response);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const jsonData = await response.json();
            const dataArray = jsonData.data; 

            // Convert the array to a dictionary, keyed by 'id'
            this.data = dataArray.reduce((acc, item) => {
                acc[item.id] = item;
                return acc;
            }, {});

            return this.data;
        } catch (error) {
            console.error("There was a problem fetching the data:", error);
        }
    }

    // Method to get data by ID
    getDataById() {
        console.log(this.data);
        return this.data[hash];
    }
}

/*/ Usage:
const url = "https://mindfulai.equalreality.com/wp-content/uploads/2023/04/Gallery-2.json";
const dataFetcher = new DataFetcher(url);

dataFetcher.fetchData().then(() => {
    const dataForId1 = dataFetcher.getDataById("1");
    console.log(dataForId1);  // Log the data for id "1"
});
*/