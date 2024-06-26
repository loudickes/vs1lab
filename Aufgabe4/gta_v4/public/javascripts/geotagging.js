// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// Die Klassen aus den separaten Skripten importieren
import { LocationHelper } from './location-helper.js';
import { MapManager } from './map-manager.js';

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    // Get the latitude and longitude input fields
    let latitudeInput = document.getElementById("latitude_display");
    let longitudeInput = document.getElementById("longitude_display");
    let hiddenLatitudeInput = document.getElementById("hiddenLatitude");
    let hiddenLongitudeInput = document.getElementById("hiddenLongitude");

    // Check if the input fields already have values
    let latitude = hiddenLatitudeInput.value;
    let longitude = hiddenLongitudeInput.value;

    if (!latitude || !longitude) {
        // If the input fields are empty, find the current location
        LocationHelper.findLocation((locationHelper) => {
            // get current latitude and longitude
            latitude = locationHelper.latitude;
            longitude = locationHelper.longitude;

            // update input fields with the current location
            latitudeInput.value = latitude;
            longitudeInput.value = longitude;
            hiddenLatitudeInput.value = latitude;
            hiddenLongitudeInput.value = longitude;

            // Update the map and markers
            updateMapAndMarkers(latitude, longitude);
        });
    } else {
        // If the input fields already have values, use them to update the map and markers
        updateMapAndMarkers(latitude, longitude);
    }
}

function updateMapAndMarkers(latitude, longitude) {
    let contentElement = document.querySelector('.discovery__map');

    // Extract the GeoTag data from the data-tags attribute
    
    let tagsJson = contentElement.getAttribute('data-tags');  // Client site extracts the JSON-String from data-tags out of the ejs template after it got added there
    let tags = tagsJson ? JSON.parse(tagsJson) : [];          // converts JSON string into a javascript-Array
    
    // create object
    let mapManager = new MapManager();

    // call initMap function
    mapManager.initMap(latitude, longitude);
    // call updateMarkers function
    mapManager.updateMarkers(latitude, longitude, tags);      // hands the current coordinates and the geotag-Array as a parameter to the updatemarkers method from mapManager class

    // get img element
    let image = contentElement.querySelector("img");
    if (image) {
        // remove img element if it exists
        image.parentNode.removeChild(image);
    }

    // get span element
    let paragraph = contentElement.querySelector('span');
    if (paragraph) {
        // remove span element if it exists
        paragraph.parentNode.removeChild(paragraph);
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    // call function
    updateLocation();
});


/*
//ALTERNATIVE VERSION IN DER MAN AM ANFANG BEIM LADEN DER SEITE DIE GEOTAGS IN SEINER UMGEBUNG SIEHT
function updateLocation() {
    // Get the latitude and longitude input fields
    let latitudeInput = document.getElementById("latitude");
    let longitudeInput = document.getElementById("longitude");
    let hiddenLatitudeInput = document.getElementById("hiddenLatitude");
    let hiddenLongitudeInput = document.getElementById("hiddenLongitude");

    LocationHelper.findLocation((locationHelper) => {
        // get current latitude and longitude
        const latitude = locationHelper.latitude;
        const longitude = locationHelper.longitude;

        // update input fields with the current location
        latitudeInput.value = latitude;
        longitudeInput.value = longitude;
        hiddenLatitudeInput.value = latitude;
        hiddenLongitudeInput.value = longitude;

        // Fetch nearby GeoTags and update the map
        fetchNearbyGeoTagsAndUpdateMap(latitude, longitude);
    });
}

function fetchNearbyGeoTagsAndUpdateMap(latitude, longitude) {
    fetch(`/nearby-geotags?latitude=${latitude}&longitude=${longitude}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        updateMapAndMarkers(latitude, longitude, data);
    })
    .catch(error => {
        console.error('Error fetching nearby GeoTags:', error);
    });
}

function updateMapAndMarkers(latitude, longitude, tags = []) {
    let contentElement = document.querySelector('.discovery__map');

    // create object
    let mapManager = new MapManager();
    // call initMap function
    mapManager.initMap(latitude, longitude);
    // call updateMarkers function
    mapManager.updateMarkers(latitude, longitude, tags);

    // get img element
    let image = contentElement.querySelector("img");
    if (image) {
        // remove img element if it exists
        image.parentNode.removeChild(image);
    }

    // get span element
    let paragraph = contentElement.querySelector('span');
    if (paragraph) {
        // remove span element if it exists
        paragraph.parentNode.removeChild(paragraph);
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});
*/
