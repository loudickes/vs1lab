// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */
const geolib = require('geolib');
/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{
    
    //constructor to initialize an empty array to store the geotags
    constructor() {
        this.geoTags = [];
    }

    //add a Geotag with push command, "push" will attach an object at the end of an array
    addGeoTag(geoTag) {
        this.geoTags.push(geoTag);
        
    }

    //fuction to remove geotags, use filter command to create a new geoTags array without the array you wanted to remove
    removeGeoTag(name) {
        this.geoTags = this.geoTags.filter(tag => tag.name !== name); 
    }

    //function to getNearbyGeoTags, returns all geotags in a given radius from a location
    getNearbyGeoTags(latitude, longitude, radius) {
        const lat = parseFloat(latitude);               //converts the latitude to a float  to prevent mistakes
        const lon = parseFloat(longitude);              //converts the longitude to a float to prevent mistakes

        return this.geoTags.filter(tag => this._iswithinRadius(tag, lat, lon, radius)); //filters the given geoTags array and only returns the tags, that are within the given radius
    }

    //search all nearby geotags in the proximity(radius) of a location that match a keyword 
    searchNearbyGeoTags(latitude, longitude, radius, keyword) {
        return this.geoTags.filter(tag =>                                       //uses filter command to return a new array based on the proximity from the given keyword,
            this._iswithinRadius(tag, latitude, longitude, radius) &&           //checks which getoags are in the radius of the keyword & 
            (tag.name.toLowerCase().includes(keyword.toLowerCase()) || tag.hashtag.toLowerCase().includes(keyword.toLowerCase())) //only picks the geotags that match either the name or the hashtag of the keyword
        );
    }

    //returns the geotags array with all its elements
    getAllGeoTags() {
        return this.geoTags;
    }

    //function to determine, if a geotag is within the radius of a given location, uses geolib.getDistance to determine the distance on the Earth
    _iswithinRadius(tag, latitude, longitude, radius) {
        const distance = geolib.getDistance(
            { latitude: parseFloat(tag.latitude), longitude: parseFloat(tag.longitude) },
            { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
        );
        return distance <= radius * 1000; // convert radius to meters and checks if the distance between the two points is within the given radius
    }


    /*searchNearbyGeoTags(latitude, longitude, radius, keyword) {
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        return this.geoTags.filter(tag => this._iswithinRadius(tag, lat, lon, radius) && 
        (tag.name.includes(keyword) || tag.hashtag.includes(keyword)));
    }

    getAllGeoTags() {
        return this.geoTags;
    }
 /*
    _iswithinRadius(tag, latitude, longitude, radius) {
        const distance = this._calculateDistance(tag.latitude, tag.longitude, latitude, longitude);
        return distance <= radius;
    }

    _calculateDistance(lat1, lon1, lat2, lon2) {
        const toRad = (value) => value * Math.PI / 180;
        const R = 6371; //Earth radius in km

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }*/



}

module.exports = InMemoryGeoTagStore
