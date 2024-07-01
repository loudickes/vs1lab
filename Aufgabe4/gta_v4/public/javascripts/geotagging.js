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

const mapManager = new MapManager();

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
    const taggingForm = document.getElementById('tag-form');
    const discoveryForm = document.getElementById('discoveryFilterForm');
    const resultList = document.getElementById('discoveryResults');
    const mapElement = document.getElementById('mapView');

    // Event-Listener für das Tagging-Formular
    taggingForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(taggingForm);
        const geotag = {
            latitude: formData.get('latitude'),
            longitude: formData.get('longitude'),
            name: formData.get('name'),
            hashtag: formData.get('hashtag')
        };

        try {
            const response = await fetch('/api/geotags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(geotag)
            });
            const result = await response.json();
            console.log('Created GeoTag:', result);
            updateResults();
        } catch (error) {
            console.error('Error creating GeoTag:', error);
        }
    });

    // Event-Listener für das Discovery-Formular
    discoveryForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(discoveryForm);
        const query = new URLSearchParams({
            searchterm: formData.get('searchterm'),
            latitude: formData.get('latitude'),
            longitude: formData.get('longitude')
        });

        try {
            const response = await fetch(`/api/geotags?${query.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            console.log('Retrieved GeoTags:', result);
            updateResults(result);
        } catch (error) {
            console.error('Error retrieving GeoTags:', error);
        }
    });

    // Funktion zur Aktualisierung der Ergebnisliste und der Karte
    async function updateResults(geotags = null) {
        if (!geotags) {
            const response = await fetch('/api/geotags', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            geotags = await response.json();
        }

        // Aktualisieren der Ergebnisliste
        resultList.innerHTML = '';
        geotags.forEach(geotag => {
            const listItem = document.createElement('li');
            listItem.textContent = `${geotag.name} (${geotag.latitude}, ${geotag.longitude}) ${geotag.hashtag}`;
            resultList.appendChild(listItem);
        });

        let longitude = document.getElementById("longitude_display").value;
        let latitude = document.getElementById("latitude_display").value;

        mapManager.updateMarkers(latitude, longitude, geotags);
    }

    // Initiale Ergebnisse laden
    updateResults();
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
