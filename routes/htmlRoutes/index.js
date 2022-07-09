const path = require('path');
const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

// Adds route from the index.html file to server.js. Having just a / route points us to the root route of
// the server. This is used to create a homepage for a server. Since it is only supposed to respond with a
// HTML page to display in browser, we use res.sendFile() instead of res.json() which tells them where to
// find the file we want our server to read and send back to the client. We are using the path module again
// to ensure we're finding the correct location for the HTML code we want to display in the browser. That way,
// we know it will work in any server environment. The URL only shows http://localhost:3001 because we're just
// linking the contents of the file to the browser, not the actual file.
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

  // This route takes us to the animals.html file. The endpoint is just /animals which is intentional because
  // when we create routes we need to stay organized and set expectations of what type of data is being
  // transferred at that endpoint. We can assume that a route that has the term api in it will deal in transference
  // of JSON data, whereas more normal looking endpoints such as /animals should serve as an HTML page. Express.js
  // isn't opinionated about how routes should be named and organized, so that's a system developers must create.
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

  // This route takes us to the zookeepers.html file
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

  // Wildcard Routes: The * is a wildcard, which means that any route that wasn't previously defined will fall
  // under this request and will receive the homepage as the response. The wildcard route should ALWAYS come last
  // as the order of your routes matter. If this is above any other routes, then all routes will point towards the
  // wildcard route.
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

//
router.use(animalRoutes);

// Exports router as a module.
module.exports = router;