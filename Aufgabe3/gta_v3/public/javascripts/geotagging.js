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
// ... your code here ...

function updateLocation() {
    LocationHelper.findLocation((locationHelper) => {
        // get current latitude
        let latitude = locationHelper.latitude;
        // get current longitude
        let longitude = locationHelper.longitude;

        // change values to the current location
        document.getElementById("latitude").value = latitude;
        document.getElementById("longitude").value = longitude;
        document.getElementById("hiddenLatitude").value = latitude;
        document.getElementById("hiddenLongitude").value = longitude;

        let contentElement = document.querySelector('.discovery__map');

        // create object
        let mapManager = new MapManager();
        // call initMap function
        mapManager.initMap(latitude, longitude);
        // call updateMarkers function
        mapManager.updateMarkers(latitude, longitude);

        // get img element
        let image = contentElement.querySelector("img");
        // remove img element
        image.parentNode.removeChild(image);

        // get p element
        let paragraph = contentElement.querySelector('span');
        // remove p element
        paragraph.parentNode.removeChild(paragraph);
    });
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    // call function
    updateLocation();
});