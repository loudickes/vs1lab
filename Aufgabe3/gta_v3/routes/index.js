// File origin: VS1LAB A3

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

const { tagList } = require('../models/geotag-examples');



const geoTagStore = new GeoTagStore();     
GeoTagExamples.populateStore(geoTagStore); //populate the store with the example data

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.#
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  const latitude = "";
  const longitude = "";
  // Rendern der Seite mit den GeoTags und Koordinaten
  res.render('index', { taglist: geoTagStore.getAllGeoTags(), latitude, longitude }); //inserts all geotag examples that got populated before into the taglist that get stored as jsons now
});


/* ALTERNATIVE VERSION WO MAN AM ANFANG DIE GEOTAGS IN SEINER UMGEBUNG ANGEZEIGT BEKOMMT
router.get('/', (req, res) => {
  res.render('index', { taglist: geoTagStore.getAllGeoTags(), nearbyTags: [], latitude: "", longitude: "" });
});

router.get('/nearby-geotags', (req, res) => {
    const { latitude, longitude } = req.query;
    const nearbyTags = geoTagStore.getNearbyGeoTags(parseFloat(latitude), parseFloat(longitude), 1);
    res.json(nearbyTags);
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

// TODO: ... your code here ...

router.post('/tagging', (req, res) => {
  const { latitude, longitude, name, hashtag } = req.body;
  
  const newGeoTag = new GeoTag(parseFloat(latitude), parseFloat(longitude), name, hashtag);
  geoTagStore.addGeoTag(newGeoTag);

  const nearbyTags = geoTagStore.getNearbyGeoTags(parseFloat(latitude), parseFloat(longitude), 6);
  res.render('index', {taglist: nearbyTags, latitude, longitude });
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
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

// TODO: ... your code here ...

router.post('/discovery', (req, res) => {
  const { latitude, longitude, searchterm } = req.body;

  let foundTags;
  if (searchterm) {
    foundTags = geoTagStore.searchNearbyGeoTags(parseFloat(latitude), parseFloat(longitude), 10, searchterm);
  } else {
    foundTags = geoTagStore.getNearbyGeoTags(parseFloat(latitude), parseFloat(longitude), 10);
  }

  let newLatitude = latitude;
  let newLongitude = longitude;

  // If found tags exist, update the latitude and longitude to the first result
  if (foundTags.length > 0) {
    newLatitude = foundTags[0].latitude;
    newLongitude = foundTags[0].longitude;
  }

  res.render('index', { taglist: foundTags, latitude: newLatitude, longitude: newLongitude });
});


module.exports = router;

