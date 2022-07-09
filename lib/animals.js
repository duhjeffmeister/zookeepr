// Need the fs library to write data when POST-ing.
const fs = require('fs');

// module that provides utilities for working with file and directory paths. 
const path = require('path');

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
    }  
    // Filters
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

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

    // Accepts the POST route's req.body value and the array we want to add the data to (animalsArray). This does NOT
// actually add information to the animals.json because whenever we use require() to import data or functionality,
// it's only reading the data and creating a copy of it to use in server.js. Nothing we do with the imported data
// will ever affect the content of the file from which that data came. We will have to use .push() to save the new
// data as well as import and use the fs library to write that data to animals.json. 
function createNewAnimal (body, animalsArray) {
    const animal = body;

    // When POST-ing a new animal, this adds it to the imported animals array from the animals.json file.
    animalsArray.push(animal);

    // fs.writeFileSync() is the synchronous version of fs.writeFile() and doesn't require a callback function. If
    // there was a much large dataset, the asynchronous version would be better. path.join() joins the value of 
    // __dirname (directory of the file we execute the code in) with the path to the animals.json file.
    // After this, the JavaScript array data needs to be saved as a JSON so we use JSON.stringify() to convert it.
    // The other two arguments (null and 2) keep the data formatted: "null" means we don't want to edit any existing
    // data. If we did, we would change "null". The "2" indicates we want to create white space between values to
    // make it more readable. If these arguments were left out, the JSON file would be very hard to read.
    fs.writeFileSync(
        path.join(__dirname, '../data/animals.json'),
        JSON.stringify({ animals: animalsArray}, null, 2)
    );

    // Return finished code to post route for response
    return animal;
}


// Creates validation function to make sure our data is correct. This runs the animal parameter (content of the
// req.body) and we're running the properties through a series of validation checks. If any of them are false
// then false will be returned and not create the animal data.
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

// Turns functions into modules to be used in other files.
module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};