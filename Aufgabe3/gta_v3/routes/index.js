// index.js

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars

const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars

const GeoTagStore = require('../models/geotag-store');
const GeoTagExamples = require('../models/geotag-examples');

// Create an instance of the GeoTagStore to store geotags in memory.
const store = new GeoTagStore();
// Populate the store with example geotags from GeoTagExamples.
GeoTagExamples.tagList.forEach(tag => store.addGeoTag(tag));

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests carry no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary

// Define a route for GET requests to the root URL ('/').
router.get('/', (req, res) => {
  // Render the 'index' template with an empty taglist.
  res.render('index', { taglist: [] });
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests carry the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

// Define a route for POST requests to '/tagging'.
router.post('/tagging', (req, res) => {
   // Extract name, latitude, longitude, and hashtag from the request body.
  const { name, latitude, longitude, hashtag } = req.body;
  // Create a new GeoTag object with the provided data.
  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag);
   // Add the new geotag to the store.
  store.addGeoTag(newGeoTag);
  // Get geotags that are within a radius of 5 units from the new geotag's location.
  const nearbyTags = store.getNearbyGeoTags(latitude, longitude);
  // Render the 'index' template with the list of nearby geotags.
  res.render('index', { taglist: nearbyTags });
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests carry the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

// Define a route for POST requests to '/discovery'.
router.post('/discovery', (req, res) => {
  const { latitude, longitude, keyword } = req.body;
  const searchResults = store.searchNearbyGeoTags(latitude, longitude, 1, keyword);
  res.render('index', { taglist: searchResults });
});

module.exports = router;
