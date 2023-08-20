//GalleryLookUp.js

//import { NodeJSON } from '../modules/NodeJSON/NodeJSON.js';

const hash = window.location.hash.substring(1);  // "section1"

console.log(hash);

class DataFetcher {
    constructor(url) {
        this.url = url;
        this.data = {};  // Initialize as an empty dictionary
    }

    async fetchData() {
	    return NodeJSON.GetNodeJSON(this.url)
	        .then(data => {
	            console.log(data);
	            const jsonData = data;
	            const dataArray = jsonData.data; 
	            console.log(dataArray);

	            // Convert the array to a dictionary, keyed by 'id'
	            this.data = dataArray.reduce((acc, item) => {
	                acc[item.id] = item;
	                return acc;
	            }, {});

	            return this.data;
	        })
	        .catch(error => {
	            // Handle any error that wasn't caught in GetNodeJSON
	            console.error("There was a problem fetching the data:", error);
	            // If you want to propagate the error to the calling function, rethrow it:
	            throw error;
	        });
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