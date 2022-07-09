// Requires router which allows you to declare routes in any file as long as you use the proper middleware
const router = require('express').Router();

// Requires the functions from animals.js in lib folder
const {filterByQuery, findById, createNewAnimal, validateAnimal} = require('../../lib/animals');

// Requires the function from the animals in data folder
const {animals} = require('../../data/animals');

// Adds the route to the front end. The get() method requires two arguments; first is a string that describes
// the route the client will have to fetch from. The second is a callback function that will execute every time
// that route is accessed with a GET request. The send() method from the res parameter (short for responses)
// sends the string to the client.
router.get('/animals', (req, res) => {
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

router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

router.post('/animals', (req, res) => {
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

// Exports router
module.exports = router;