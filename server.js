// Loads express.js
const express = require('express');

// Creates a route that the front end can request data from
const {animals} = require('./data/animals');

// Tells our app to use the specific port if it has been set, but if not, default to port 3001
const PORT = process.env.PORT || 3001;

// Instantiates the server
const app = express();

// Takes in "req.query" as an argument and filter through the animals accordingly, returning the new filtered array
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array. Remember, it is initially a copy of the 
            // animalsArray, but here we're updating it for each trait in the .forEach() loop. For each trait being targeted 
            // by the filter, the filteredResults array will then contain only the entries that contain the trait, so at the 
            // end we'll have an array of animals that have every one of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    
    // Returns the filtered results
    return filteredResults;
}

// Adds the route to the front end. The get() method requires two arguments; first is a string that describes
// the route the client will have to fetch from. The second is a callback function that will execute every time
// that route is accessed with a GET request. The send() method from the res parameter (short for responses)
// sends the string to the client.
app.get('/api/animals', (req, res) => {
    let results = animals;

    if (req.query) {
        results = filterByQuery(req.query, results);
    }

    // Responds with a JSON after taking the query parameter. If you repeat the same query name with different
    // values, it would becone an array in the JSON.
    // res.json(animals)
    // res.send('Hello!');
    res.json(results);
});

// Method that makes the server listen. Ports 80 are typically for "http://" sites and 443 is typically for
// "https://" sites. Ports with numbers 1024 and below are considered special by the operating system and
// often require special permissions (such as running the process as an administrator).
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

