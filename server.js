// Loads express.js
const express = require('express');

// Tells our app to use the specific port if it has been set, but if not, default to port 3001
const PORT = process.env.PORT || 3001;

// Instantiates the server
const app = express();

const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

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

// Use apiRoutes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// Method that makes the server listen. Ports 80 are typically for "http://" sites and 443 is typically for
// "https://" sites. Ports with numbers 1024 and below are considered special by the operating system and
// often require special permissions (such as running the process as an administrator).
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
