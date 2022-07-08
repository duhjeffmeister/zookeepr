// Need the fs library to write data when POST-ing.
const fs = require('fs');

// module that provides utilities for working with file and directory paths. 
const path = require('path');

// Loads express.js
const express = require('express');

// Creates a route that the front end can request data from
const { animals } = require('./data/animals.json');

// Tells our app to use the specific port if it has been set, but if not, default to port 3001
const PORT = process.env.PORT || 3001;

// Instantiates the server
const app = express();

// Parse incoming string or array data. app.use mounts a function to the server that our requests 
// will pass through before getting to the intended endpoint. The functions we mount to our server are referred
// to as middleware. express.urlencoded is a method built into Express that takes incoming POST data and converts
// it to the key/value pairings that can be accessed in the req.body object. The extended: true option informs our
// server that there may be sub-array data nested in it as well so it needs to search deeply into the POST data to
// parse all of the data correctly.
app.use(express.urlencoded({ extended: true}));

// Parse incoming JSON data. express.json() takes incoming POST data int eh form of JSON and parses it into the req.body
// JavaScript object. Both of these middleware functions need to be set up every time you create a server that is looking
// to accept POST data.
app.use(express.json());

// Provides a file path to a location in our application (in this case the public folder) and this instructs the server
// to make these files static resources, meaning all of the front-end code can now be accessed without having a specific
// server endpoint created for it.
app.use(express.static('public'));

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
    path.join(__dirname, './data/animals.json'),
    JSON.stringify({ animals: animalsArray}, null, 2)
  );

  // Return finished code to post route for response
  return body;
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
  // values, it would become an array in the JSON.
  // res.json(animals)
  // res.send('Hello!');
  res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

// Adds route from the index.html file to server.js. Having just a / route points us to the root route of
// the server. This is used to create a homepage for a server. Since it is only supposed to respond with a
// HTML page to display in browser, we use res.sendFile() instead of res.json() which tells them where to
// find the file we want our server to read and send back to the client. We are using the path module again
// to ensure we're finding the correct location for the HTML code we want to display in the browser. That way,
// we know it will work in any server environment. The URL only shows http://localhost:3001 because we're just
// linking the contents of the file to the browser, not the actual file.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/api/animals', (req, res) => {
  // Set ID based on what the next index of the array will be. Remember the length property is always going
  // to be one number ahead of the last index of the array so we can avoid any duplicate values. This adds
  // the ID to the JSON file.
  req.body.id = animals.length.toString();

  // If any data in req.body is incorrect after validation check, send 400 error back. That error indicates
  // to the user that the server doesn't have any problems and the request is understood, but they incorrectly
  // made the request and we can't allow it to work. Anything in the 400 range implies a user error and not
  // a server error.
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {

  // Add animal to JSON file and animals array in this function.
  const animal = createNewAnimal (req.body, animals);

  // req.body is where our incoming content will be, allowing us to access data on the server side
  res.json(req.body);
  }
});

app.post('/api/animals', (req, res) => {});

// Method that makes the server listen. Ports 80 are typically for "http://" sites and 443 is typically for
// "https://" sites. Ports with numbers 1024 and below are considered special by the operating system and
// often require special permissions (such as running the process as an administrator).
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
